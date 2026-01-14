require('dotenv').config(); // Load .env
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // Built-in Node module
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Your MySQL Connection
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For login tokens
const multer = require('multer'); // For file uploads
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // Allows us to read JSON from frontend

// ==========================================
//  1. MULTER CONFIGURATION (For File Uploads)
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Allow Frontend to access these files via URL
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// ==========================================
//  2. AUTH ROUTES (Register, Login & Passwords)
// ==========================================

// REGISTER
app.post('/api/auth/register', async (req, res) => {
  const { fullName, email, username, password } = req.body;

  try {
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUser.length > 0) {
      if (existingUser[0].email === email) {
        return res.status(400).json({ message: "Email sudah terdaftar!" });
      } else {
        return res.status(400).json({ message: "Username sudah dipakai!" });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.query(
      'INSERT INTO users (nama, email, username, password, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, username, hashedPassword, 'penyewa']
    );

    res.status(201).json({ message: "Registrasi berhasil! Silakan login." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, username]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "User tidak ditemukan!" });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password salah!" });
    }

    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: "Login berhasil!",
      token,
      user: {
        id: user.user_id,
        nama: user.nama,
        role: user.role,
        npm: user.npm,               
        no_hp: user.no_hp,           
        profile_picture: user.profile_picture 
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// CHANGE PASSWORD (LOGGED IN USER)
app.post('/api/auth/change-password', async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  try {
    // 1. Get User
    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (users.length === 0) return res.status(404).json({ message: "User tidak ditemukan." });
    
    const user = users[0];

    // 2. Verify Old Password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password lama salah!" });
    }

    // 3. Hash New Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 4. Update Database
    await db.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, userId]);

    res.json({ message: "Password berhasil diubah!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

// ==========================================
//  NEW: EMAIL CONFIGURATION & ROUTES
// ==========================================

// 1. Configure Email Transporter (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // From .env
    pass: process.env.EMAIL_PASS  // From .env (App Password)
  }
});

// 2. FORGOT PASSWORD (SEND EMAIL)
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ message: "Email tidak terdaftar." });
    }
    const user = users[0];

    // Generate Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 Hour from now

    // Save Token to DB
    await db.query(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?', 
      [resetToken, tokenExpiry, user.user_id]
    );

    // Send Email
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password - Lapangan Instan',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #36499C;">Permintaan Reset Password</h2>
          <p>Anda menerima email ini karena ada permintaan untuk mereset password akun anda.</p>
          <p>Silakan klik tombol di bawah ini untuk membuat password baru:</p>
          <a href="${resetLink}" style="background-color: #36499C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: gray;">Link ini akan kadaluarsa dalam 1 jam.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Link reset password telah dikirim ke email anda." });

  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ message: "Gagal mengirim email. Cek koneksi server." });
  }
});

// 3. RESET PASSWORD (VERIFY TOKEN & UPDATE)
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    // Find user with valid token AND token not expired
    const [users] = await db.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()', 
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Token tidak valid atau sudah kadaluarsa." });
    }
    const user = users[0];

    // Hash New Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update Password & Clear Token
    await db.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?', 
      [hashedPassword, user.user_id]
    );

    res.json({ message: "Password berhasil direset! Silakan login." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});


// PROFILE ROUTINGS
// ==========================================
//  USER PROFILE ROUTES
// ==========================================

// GET: Get User Details (Fresh Data)
app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT user_id, nama, email, username, role, no_hp, npm, profile_picture FROM users WHERE user_id = ?', 
      [req.params.id]
    );
    
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT: Update User Profile (Text + Image)
app.put('/api/users/:id', upload.single('profilePic'), async (req, res) => {
  const { id } = req.params;
  const { nama, email, npm, noHp } = req.body;
  
  try {
    // 1. Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    // 2. Determine Profile Picture Filename
    let profilePicFilename = users[0].profile_picture; // Default to old picture
    if (req.file) {
      profilePicFilename = req.file.filename; // Update if new file uploaded
    }

    // 3. Update Database
    await db.query(
      `UPDATE users 
       SET nama = ?, email = ?, npm = ?, no_hp = ?, profile_picture = ? 
       WHERE user_id = ?`,
      [nama, email, npm, noHp, profilePicFilename, id]
    );

    // 4. Return the updated user data (so frontend can update LocalStorage)
    const updatedUser = {
      id: parseInt(id),
      nama,
      email,
      npm,
      no_hp: noHp,
      profile_picture: profilePicFilename,
      role: users[0].role // Keep existing role
    };

    res.json({ 
      message: "Profile berhasil diperbarui!", 
      user: updatedUser 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update profile." });
  }
});

// ==========================================
//  3. BOOKING ROUTES
// ==========================================

// Create New Booking (SECURED: Admins cannot book)
app.post('/api/bookings', upload.single('krsFile'), async (req, res) => {
  try {
    const { userId, courtId, date, timeSlot } = req.body;

    // ------------------------------------------------------------------
    // 1. SECURITY CHECK: Is this user an Admin? (BLOCK THEM)
    // ------------------------------------------------------------------
    const [userCheck] = await db.query('SELECT role FROM users WHERE user_id = ?', [userId]);

    if (userCheck.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    if (userCheck[0].role === 'admin') {
      return res.status(403).json({ message: "Admin tidak boleh melakukan booking!" });
    }
    // ------------------------------------------------------------------

    if (!req.file) {
      return res.status(400).json({ message: "File KRS wajib diupload!" });
    }
    const krsFilename = req.file.filename;

    const times = timeSlot.split('-');
    const startTime = times[0].trim().replace('.', ':') + ":00";
    const endTime = times[1].trim().replace('.', ':') + ":00";

    // 2. Save to Bookings Database
    await db.query(
      `INSERT INTO bookings (user_id, court_id, booking_date, start_time, end_time, krs_photo) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, courtId, date, startTime, endTime, krsFilename]
    );

    // 3. Create Initial Notification (Booking Received)
    const notifMessage = `Booking berhasil dibuat untuk tanggal ${date} jam ${timeSlot}. Menunggu verifikasi admin.`;
    
    await db.query(
      'INSERT INTO notifications (user_id, message) VALUES (?, ?)',
      [userId, notifMessage]
    );

    res.status(201).json({ message: "Booking berhasil dibuat! Menunggu verifikasi admin." });

  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Gagal membuat booking. Cek server log." });
  }
});


// ==========================================
//  4. GENERAL ROUTES
// ==========================================

app.get('/api/courts', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM courts');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ==========================================
//  5. ADMIN ROUTES
// ==========================================

// GET: Retrieve all bookings
app.get('/api/admin/bookings', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.booking_id, 
        b.booking_date, 
        b.start_time, 
        b.end_time, 
        b.status, 
        b.krs_photo,
        u.nama AS user_name,
        u.no_hp,          -- <--- MAKE SURE THIS LINE IS HERE!
        u.npm,
        c.name AS court_name
      FROM bookings b
      JOIN users u ON b.user_id = u.user_id
      JOIN courts c ON b.court_id = c.court_id
      ORDER BY b.created_at DESC
    `;
    
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Error Admin:", err);
    res.status(500).json({ message: "Gagal mengambil data." });
  }
});

// PUT: Update Booking Status (Approve/Reject)
app.put('/api/admin/bookings/:id', async (req, res) => {
  const { id } = req.params;
  const { status, adminId } = req.body; 

  try {
    // 1. SAFETY NET CHECK
    if (!adminId) {
       return res.status(401).json({ message: "Unauthorized: No Admin ID provided." });
    }

    const [users] = await db.query('SELECT role FROM users WHERE user_id = ?', [adminId]);

    if (users.length === 0 || users[0].role !== 'admin') {
       return res.status(403).json({ message: "Access Denied: You are not an admin." });
    }

    // 2. FETCH BOOKING DETAILS
    const [bookingData] = await db.query(
      `SELECT b.user_id, b.booking_date, b.start_time, c.name as court_name 
       FROM bookings b 
       JOIN courts c ON b.court_id = c.court_id 
       WHERE b.booking_id = ?`,
      [id]
    );

    if (bookingData.length === 0) {
      return res.status(404).json({ message: "Booking tidak ditemukan." });
    }
    const booking = bookingData[0];

    // 3. UPDATE STATUS
    await db.query('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, id]);

    // 4. SEND RESULT NOTIFICATION TO USER
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date(booking.booking_date).toLocaleDateString('id-ID', dateOptions);
    const timeStr = booking.start_time.slice(0, 5); 

    let message = "";
    if (status === 'approved') {
      message = `✅ Hore! Booking ${booking.court_name} tanggal ${dateStr} jam ${timeStr} telah DISETUJUI.`;
    } else if (status === 'rejected') {
      message = `❌ Maaf, booking ${booking.court_name} tanggal ${dateStr} jam ${timeStr} DITOLAK. Silakan cek jadwal lain.`;
    }

    if (message) {
      await db.query(
        'INSERT INTO notifications (user_id, message) VALUES (?, ?)',
        [booking.user_id, message]
      );
    }

    res.json({ message: `Status berhasil diubah menjadi ${status}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update status." });
  }
});


// ==========================================
//  6. PUBLIC ROUTES (Schedule)
// ==========================================

// GET: Get specific bookings for a court on a specific date
app.get('/api/schedule', async (req, res) => {
  const { courtId, date } = req.query;

  try {
    const [rows] = await db.query(
      `SELECT start_time, end_time, status 
       FROM bookings 
       WHERE court_id = ? AND booking_date = ? 
       AND (status = 'approved' OR status = 'pending')`,
      [courtId, date]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching schedule" });
  }
});

// GET: My Bookings (History)
app.get('/api/my-bookings/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `
      SELECT b.*, c.name as court_name 
      FROM bookings b
      JOIN courts c ON b.court_id = c.court_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `;
    const [rows] = await db.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// GET: My Notifications
app.get('/api/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', 
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

// PUT: Mark Notification as Read
app.put('/api/notifications/read/:id', async (req, res) => {
  try {
    await db.query('UPDATE notifications SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
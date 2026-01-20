const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Email Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.register = async (req, res) => {
  const { fullName, email, username, password } = req.body;
  try {
    const [existingUser] = await db.query(
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    if (existingUser.length > 0) {
      if (existingUser[0].email === email) return res.status(400).json({ message: "Email sudah terdaftar!" });
      else return res.status(400).json({ message: "Username sudah dipakai!" });
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
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    if (users.length === 0) return res.status(400).json({ message: "User tidak ditemukan!" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password salah!" });

    const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

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
};

exports.changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (users.length === 0) return res.status(404).json({ message: "User tidak ditemukan." });
    
    const user = users[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password lama salah!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await db.query('UPDATE users SET password = ? WHERE user_id = ?', [hashedPassword, userId]);

    res.json({ message: "Password berhasil diubah!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: "Email tidak terdaftar." });
    
    const user = users[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 Hour

    await db.query('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?', [resetToken, tokenExpiry, user.user_id]);

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password - Lapangan Instan',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #36499C;">Permintaan Reset Password</h2>
          <p>Silakan klik tombol di bawah ini untuk membuat password baru:</p>
          <a href="${resetLink}" style="background-color: #36499C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 12px; color: gray;">Link ini akan kadaluarsa dalam 1 jam.</p>
        </div>`
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Link reset password telah dikirim ke email anda." });
  } catch (err) {
    console.error("Email Error:", err);
    res.status(500).json({ message: "Gagal mengirim email." });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()', [token]);
    if (users.length === 0) return res.status(400).json({ message: "Token tidak valid atau sudah kadaluarsa." });
    
    const user = users[0];
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.query('UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?', [hashedPassword, user.user_id]);

    res.json({ message: "Password berhasil direset! Silakan login." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
};
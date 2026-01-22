const db = require('../db');

exports.createBooking = async (req, res) => {
  try {
    const { userId, courtId, date, timeSlot } = req.body;

    const [userCheck] = await db.query('SELECT role FROM users WHERE user_id = ?', [userId]);
    if (userCheck.length === 0) return res.status(404).json({ message: "User tidak ditemukan." });
    if (userCheck[0].role === 'admin') return res.status(403).json({ message: "Admin tidak boleh melakukan booking!" });

    if (!req.file) return res.status(400).json({ message: "File KRS wajib diupload!" });
    
    const krsFilename = req.file.filename;
    const times = timeSlot.split('-');
    const startTime = times[0].trim().replace('.', ':') + ":00";
    const endTime = times[1].trim().replace('.', ':') + ":00";

    await db.query(
      `INSERT INTO bookings (user_id, court_id, booking_date, start_time, end_time, krs_photo) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, courtId, date, startTime, endTime, krsFilename]
    );

    // Ambil nama lapangan
    const [courtData] = await db.query('SELECT name FROM courts WHERE court_id = ?', [courtId]);
    const courtName = courtData.length > 0 ? courtData[0].name : 'Lapangan';

    const notifMessage = `Booking berhasil dibuat untuk ${courtName} tanggal ${date} jam ${timeSlot}. Menunggu verifikasi admin.`;
    await db.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [userId, notifMessage]);

    res.status(201).json({ message: "Booking berhasil dibuat! Menunggu verifikasi admin." });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Gagal membuat booking." });
  }
};

exports.getCourts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM courts');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

exports.getSchedule = async (req, res) => {
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
    console.error("Error fetching schedule:", err);
    res.status(500).json({ message: "Error fetching schedule" });
  }
};

exports.getMyBookings = async (req, res) => {
  const { userId } = req.params;
  try {
    const query = `SELECT b.*, c.name as court_name FROM bookings b JOIN courts c ON b.court_id = c.court_id WHERE b.user_id = ? ORDER BY b.created_at DESC`;
    const [rows] = await db.query(query, [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
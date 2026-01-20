const db = require('../db');

exports.getAllBookings = async (req, res) => {
  try {
    const query = `
      SELECT b.booking_id, b.booking_date, b.start_time, b.end_time, b.status, b.krs_photo,
             u.nama AS user_name, u.no_hp, u.npm,
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
};

exports.updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status, adminId } = req.body; 

  try {
    if (!adminId) return res.status(401).json({ message: "Unauthorized: No Admin ID provided." });
    
    const [users] = await db.query('SELECT role FROM users WHERE user_id = ?', [adminId]);
    if (users.length === 0 || users[0].role !== 'admin') return res.status(403).json({ message: "Access Denied." });

    const [bookingData] = await db.query(
      `SELECT b.user_id, b.booking_date, b.start_time, c.name as court_name FROM bookings b JOIN courts c ON b.court_id = c.court_id WHERE b.booking_id = ?`,
      [id]
    );

    if (bookingData.length === 0) return res.status(404).json({ message: "Booking tidak ditemukan." });
    const booking = bookingData[0];

    await db.query('UPDATE bookings SET status = ? WHERE booking_id = ?', [status, id]);

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date(booking.booking_date).toLocaleDateString('id-ID', dateOptions);
    const timeStr = booking.start_time.slice(0, 5); 

    let message = "";
    if (status === 'approved') message = `✅ Hore! Booking ${booking.court_name} tanggal ${dateStr} jam ${timeStr} telah DISETUJUI.`;
    else if (status === 'rejected') message = `❌ Maaf, booking ${booking.court_name} tanggal ${dateStr} jam ${timeStr} DITOLAK.`;

    if (message) {
      await db.query('INSERT INTO notifications (user_id, message) VALUES (?, ?)', [booking.user_id, message]);
    }

    res.json({ message: `Status berhasil diubah menjadi ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update status." });
  }
};
const db = require('../db');

exports.getUserProfile = async (req, res) => {
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
};

exports.updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { nama, email, npm, noHp } = req.body;
  
  try {
    const [users] = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    if (users.length === 0) return res.status(404).json({ message: "User not found" });

    let profilePicFilename = users[0].profile_picture;
    if (req.file) {
      profilePicFilename = req.file.filename;
    }

    await db.query(
      `UPDATE users SET nama = ?, email = ?, npm = ?, no_hp = ?, profile_picture = ? WHERE user_id = ?`,
      [nama, email, npm, noHp, profilePicFilename, id]
    );

    const updatedUser = {
      id: parseInt(id),
      nama, email, npm, no_hp: noHp,
      profile_picture: profilePicFilename,
      role: users[0].role
    };

    res.json({ message: "Profile berhasil diperbarui!", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal update profile." });
  }
};
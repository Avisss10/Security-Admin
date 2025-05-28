// controllers/authController.js
const db = require('../config/db');

exports.login = (req, res) => {
  const { nip, password } = req.body;

  if (!nip || !password) {
    return res.status(400).json({ message: 'NIP dan password wajib diisi' });
  }

  const query = 'SELECT * FROM user WHERE nip = ? AND password = ?';
  db.query(query, [nip, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: 'NIP atau password salah' });
    }

    // Kirim data user (tanpa password)
    const user = results[0];
    delete user.password;
    res.json({ message: 'Login berhasil', user });
  });
};

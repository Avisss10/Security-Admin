const db = require('../config/db');

// GET semua user (bisa filter ?level=Security)
exports.getAllUsers = (req, res) => {
  const levelFilter = req.query.level;

  let query = `
    SELECT u.id_user, u.nip, u.nama_user, u.password, u.id_level, l.nama_level,
           u.id_cabang, c.nama_cabang
    FROM user u
    JOIN level_user l ON u.id_level = l.id_level
    LEFT JOIN cabang c ON u.id_cabang = c.id_cabang
  `;

  const params = [];

  if (levelFilter) {
    query += ' WHERE l.nama_level = ?';
    params.push(levelFilter);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// POST: tambah user
exports.createUser = (req, res) => {
  const { nip, nama_user, password, id_level, id_cabang } = req.body;

  const query = `
    INSERT INTO user (nip, nama_user, password, id_level, id_cabang)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [nip, nama_user, password, id_level, id_cabang], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User berhasil ditambahkan', id: result.insertId });
  });
};

// PUT: update user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { nip, nama_user, password, id_level, id_cabang } = req.body;

  const query = `
    UPDATE user
    SET nip = ?, nama_user = ?, password = ?, id_level = ?, id_cabang = ?
    WHERE id_user = ?
  `;

  db.query(query, [nip, nama_user, password, id_level, id_cabang, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User berhasil diperbarui' });
  });
};

// DELETE: hapus user
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  console.log('Mencoba menghapus user dengan ID:', id); // log tambahan

  db.query('DELETE FROM user WHERE id_user = ?', [id], (err, result) => {
    if (err) {
      console.error('Error saat delete user:', err); // log error
      return res.status(500).json({ error: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }
    res.json({ message: 'User berhasil dihapus' });
  });
};


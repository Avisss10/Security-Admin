// controllers/cabangController.js
const Cabang = require('../models/cabangModel');

exports.getAllCabang = (req, res) => {
  Cabang.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getCabangById = (req, res) => {
  Cabang.getById(req.params.id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Cabang tidak ditemukan' });
    res.json(results[0]);
  });
};

exports.createCabang = (req, res) => {
  Cabang.create(req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Cabang berhasil ditambahkan', id: result.insertId });
  });
};

exports.updateCabang = (req, res) => {
  Cabang.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cabang berhasil diperbarui' });
  });
};

exports.deleteCabang = (req, res) => {
  Cabang.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Cabang berhasil dihapus' });
  });
};

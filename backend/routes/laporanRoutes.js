const db = require('../config/db'); // ✅ tambahkan ini
const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');

router.post('/', (req, res) => {
  const {
    id_user,
    id_cabang,
    jenis_laporan,
    judul_laporan,
    kondisi_cuaca,
    deskripsi_laporan
  } = req.body;

  const query = `
    INSERT INTO laporan (
      id_user, id_cabang, jenis_laporan, judul_laporan,
      hari_laporan, tanggal_laporan, waktu_laporan, kondisi_cuaca, deskripsi_laporan
    ) VALUES (?, ?, ?, ?, DAYNAME(CURDATE()), CURDATE(), CURTIME(), ?, ?)
  `;

  db.query(
    query,
    [id_user, id_cabang, jenis_laporan, judul_laporan, kondisi_cuaca, deskripsi_laporan],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Laporan berhasil ditambahkan', id_laporan: result.insertId });
    }
  );
});


router.get('/today', (req, res) => {
  const query = `
    SELECT l.*, u.nama_user, u.nip, c.nama_cabang, f.nama_foto AS foto
    FROM laporan l
    JOIN user u ON l.id_user = u.id_user
    JOIN cabang c ON u.id_cabang = c.id_cabang
    LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
    WHERE l.tanggal = CURDATE()
    ORDER BY l.id_laporan DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/export', laporanController.exportLaporan);
router.get('/filter', laporanController.filterLaporan);
router.get('/', laporanController.getAllLaporan);
router.get('/arsip', laporanController.getRecentArsip);
router.get('/:id', laporanController.getLaporanById);
router.delete('/:id', laporanController.deleteLaporan);



module.exports = router;

const db = require('../config/db'); // ✅ tambahkan ini
const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const upload = require('../middleware/uploadFoto');

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
    SELECT 
      l.id_laporan, l.jenis_laporan, l.judul_laporan, l.kondisi_cuaca, 
      l.deskripsi_laporan, l.tanggal_laporan, l.waktu_laporan, l.hari_laporan,
      u.nama_user, u.nip,
      c.nama_cabang,
      GROUP_CONCAT(f.foto_path) AS foto_list
    FROM laporan l
    JOIN user u ON l.id_user = u.id_user
    JOIN cabang c ON l.id_cabang = c.id_cabang
    LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
    WHERE l.tanggal_laporan = CURDATE()
    GROUP BY l.id_laporan
    ORDER BY l.id_laporan DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const formatted = results.map(item => ({
      ...item,
      foto_list: item.foto_list ? item.foto_list.split(',') : []
    }));

    res.json(formatted);
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  // Hapus foto laporan dulu (karena FK constraint)
  db.query('DELETE FROM foto_laporan WHERE id_laporan = ?', [id], (err1) => {
    if (err1) return res.status(500).json({ error: err1.message });

    // Hapus laporan
    db.query('DELETE FROM laporan WHERE id_laporan = ?', [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      res.json({ message: 'Laporan berhasil dihapus' });
    });
  });
});



router.post('/:id/foto', upload.single('foto'), (req, res) => {
  const id_laporan = req.params.id;
  const foto_path = req.file.filename;

  const query = `
    INSERT INTO foto_laporan (id_laporan, foto_path)
    VALUES (?, ?)
  `;

  db.query(query, [id_laporan, foto_path], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      message: 'Foto berhasil diupload',
      foto_path
    });
  });
});


router.get('/export', laporanController.exportLaporan);
router.get('/jenis-laporan', laporanController.getJenisLaporan);
router.get('/arsip', laporanController.getRecentArsip);
router.get('/', laporanController.getAllLaporan);
router.get('/:id', laporanController.getLaporanById);
router.delete('/:id', laporanController.deleteLaporan);




module.exports = router;

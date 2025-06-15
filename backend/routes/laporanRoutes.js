const db = require('../config/db'); // ✅ tambahkan ini
const express = require('express');
const router = express.Router();
const { 
  exportLaporan,
  getJenisLaporan,
  getArsipLaporan,
  deleteLaporan,
  getAllLaporan,
  getLaporanById 
} = require('../controllers/laporanController');

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

router.get('/arsip', (req, res) => {
  const { jenis, id_cabang, dari, sampai } = req.query;
  // Jika ada filter, pakai getArsipLaporanFiltered
  if (jenis || id_cabang || dari || sampai) {
    require('../models/laporanModel').getArsipLaporanFiltered(
      { jenis, id_cabang, dari, sampai },
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        // Format foto_paths jadi array
        const formatted = result.map(r => ({
          ...r,
          foto_paths: r.foto_paths ? r.foto_paths.split(',') : []
        }));
        res.json(formatted);
      }
    );
  } else {
    // Default: ambil semua arsip (lebih dari 7 hari lalu)
    require('../models/laporanModel').getArsipLaporan((err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const formatted = result.map(r => ({
        ...r,
        foto_paths: r.foto_paths ? r.foto_paths.split(',') : []
      }));
      res.json(formatted);
    });
  }
});


router.get('/export', exportLaporan);
router.get('/jenis-laporan', getJenisLaporan);
router.delete('/:id', deleteLaporan);
router.get('/', getAllLaporan);
router.get('/:id', getLaporanById);



module.exports = router;

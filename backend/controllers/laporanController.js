const db = require('../config/db');
const Laporan = require('../models/laporanModel');

exports.getAllLaporan = (req, res) => {
  Laporan.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    results.forEach(row => {
      row.foto_paths = row.foto_paths ? row.foto_paths.split(',') : [];
    });

    res.json(results);
  });
};

exports.getLaporanById = (req, res) => {
  const { id } = req.params;
  Laporan.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    const row = results[0];
    row.foto_paths = row.foto_paths ? row.foto_paths.split(',') : [];
    res.json(row);
  });
};

exports.deleteLaporan = (req, res) => {
  const { id } = req.params;
  Laporan.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Laporan tidak ditemukan' });

    res.json({ message: 'Laporan berhasil dihapus' });
  });
};

exports.getRecentArsip = (req, res) => {
const { jenis, cabang } = req.query;

  let sql = `
    SELECT l.*, 
           u.nama_user, u.nip, 
           c.nama_cabang,
           GROUP_CONCAT(f.foto_path) AS foto_list
    FROM laporan l
    JOIN user u ON l.id_user = u.id_user
    JOIN cabang c ON u.id_cabang = c.id_cabang
    LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
    WHERE l.tanggal_laporan >= CURDATE() - INTERVAL 7 DAY
  `;

  const params = [];

  if (jenis) {
    sql += ' AND l.jenis_laporan = ?';
    params.push(jenis);
  }

  if (cabang) {
    sql += ' AND u.id_cabang = ?';
    params.push(cabang);
  }

  sql += ' GROUP BY l.id_laporan ORDER BY l.tanggal_laporan DESC';

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: 'Gagal ambil arsip laporan', details: err });

    const formatted = result.map(r => ({
      ...r,
      foto_list: r.foto_list ? r.foto_list.split(',') : []
    }));

    res.json(formatted);
  });
};

exports.filterLaporan = (req, res) => {
  const params = {
    tanggal: req.query.tanggal,
    jenis: req.query.jenis,
    id_cabang: req.query.id_cabang
  };

  Laporan.filterLaporan(params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    results.forEach(r => {
      r.foto_paths = r.foto_paths ? r.foto_paths.split(',') : [];
    });

    res.json(results);
  });
};

const { Parser } = require('json2csv');
exports.exportLaporan = (req, res) => {
  const format = req.query.format || 'csv';

  Laporan.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Untuk CSV/Excel
    if (format === 'csv') {
      const fields = [
        'id_laporan', 'judul_laporan', 'jenis_laporan',
        'tanggal_laporan', 'waktu_laporan', 'nama_user',
        'nip', 'nama_cabang', 'kondisi_cuaca', 'deskripsi_laporan'
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(results);

      res.header('Content-Type', 'text/csv');
      res.attachment('laporan.csv');
      return res.send(csv);
    }

    res.status(400).json({ message: 'Format export tidak didukung' });
  });
};
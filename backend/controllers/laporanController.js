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

exports.getJenisLaporan = (req, res) => {
  const sql = `
    SELECT COLUMN_TYPE 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'laporan' 
      AND COLUMN_NAME = 'jenis_laporan' 
      AND TABLE_SCHEMA = 'security_db'
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Gagal ambil jenis laporan ENUM:', err);
      return res.status(500).json({ message: 'Gagal ambil jenis laporan' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Kolom tidak ditemukan' });
    }

    const enumString = rows[0].COLUMN_TYPE;
    const enumValues = enumString
      .replace(/^enum\(/, '')
      .replace(/\)$/, '')
      .split(',')
      .map(val => val.replace(/'/g, ''));

    res.json(enumValues);
  });
};

exports.getRecentArsip = (req, res) => {
  const { jenis, id_cabang, dari, sampai } = req.query; // Ganti "cabang" → "id_cabang"

  let sql = `
    SELECT l.*, 
           u.nama_user, u.nip, 
           c.nama_cabang,
           GROUP_CONCAT(f.foto_path) AS foto_list
    FROM laporan l
    JOIN user u ON l.id_user = u.id_user
    JOIN cabang c ON u.id_cabang = c.id_cabang
    LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
    WHERE 1=1
  `;

  const params = [];

  if (dari) {
    sql += ' AND l.tanggal_laporan >= ?';
    params.push(dari);
  } else {
    sql += ' AND l.tanggal_laporan >= CURDATE() - INTERVAL 7 DAY';
  }

  if (sampai) {
    sql += ' AND l.tanggal_laporan <= ?';
    params.push(sampai);
  }

  if (jenis) {
    sql += ' AND l.jenis_laporan = ?';
    params.push(jenis);
  }

  if (id_cabang) {
    sql += ' AND u.id_cabang = ?';
    params.push(id_cabang);
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

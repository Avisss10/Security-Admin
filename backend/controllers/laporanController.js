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

const getArsipLaporan = (req, res) => {
  Laporan.getArsipLaporan((err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Gagal ambil arsip laporan' });
    }
    res.status(200).json(result);
  });
}
exports.getArsipLaporan = getArsipLaporan;



exports.getRecentArsip = (req, res) => {
  const { jenis, id_cabang, dari, sampai } = req.query;

  Laporan.getArsipLaporanFiltered({ jenis, id_cabang, dari, sampai }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Gagal ambil arsip laporan', details: err });
    }

    const formatted = result.map(r => ({
      ...r,
      foto_paths: r.foto_paths ? r.foto_paths.split(',') : []
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

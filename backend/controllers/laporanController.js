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
  Laporan.getRecentArsip((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    results.forEach(row => {
      row.foto_paths = row.foto_paths ? row.foto_paths.split(',') : [];
    });

    res.json(results);
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

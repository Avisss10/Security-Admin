const db = require('../config/db');

const Laporan = {
  getAll: (callback) => {
    const query = `
      SELECT 
        l.id_laporan,
        l.judul_laporan,
        l.jenis_laporan,
        l.hari_laporan,
        l.tanggal_laporan,
        l.waktu_laporan,
        l.kondisi_cuaca,
        l.deskripsi_laporan,
        l.created_at,
        u.nama_user,
        u.nip,
        c.nama_cabang,
        GROUP_CONCAT(f.foto_path) AS foto_paths
      FROM laporan l
      JOIN user u ON l.id_user = u.id_user
      JOIN cabang c ON l.id_cabang = c.id_cabang
      LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
      GROUP BY l.id_laporan
      ORDER BY l.id_laporan DESC
    `;
    db.query(query, callback);
  },

  getById: (id, callback) => {
    const query = `
      SELECT 
        l.*,
        u.nama_user,
        u.nip,
        c.nama_cabang,
        GROUP_CONCAT(f.foto_path) AS foto_paths
      FROM laporan l
      JOIN user u ON l.id_user = u.id_user
      JOIN cabang c ON l.id_cabang = c.id_cabang
      LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
      WHERE l.id_laporan = ?
      GROUP BY l.id_laporan
    `;
    db.query(query, [id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM laporan WHERE id_laporan = ?', [id], callback);
  },

  getRecentArsip: (callback) => {
    const query = `
      SELECT 
        l.id_laporan,
        l.judul_laporan,
        l.jenis_laporan,
        l.hari_laporan,
        l.tanggal_laporan,
        l.waktu_laporan,
        l.kondisi_cuaca,
        l.deskripsi_laporan,
        l.created_at,
        u.nama_user,
        u.nip,
        c.nama_cabang,
        GROUP_CONCAT(f.foto_path) AS foto_paths
      FROM laporan l
      JOIN user u ON l.id_user = u.id_user
      JOIN cabang c ON l.id_cabang = c.id_cabang
      LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
      WHERE l.tanggal_laporan >= CURDATE() - INTERVAL 7 DAY
      GROUP BY l.id_laporan
      ORDER BY l.tanggal_laporan DESC
    `;
    db.query(query, callback);
  },

  filterLaporan: (params, callback) => {
  let query = `
    SELECT 
      l.*, u.nama_user, u.nip, c.nama_cabang,
      GROUP_CONCAT(f.foto_path) AS foto_paths
    FROM laporan l
    JOIN user u ON l.id_user = u.id_user
    JOIN cabang c ON l.id_cabang = c.id_cabang
    LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
    WHERE 1=1
  `;
  
  const values = [];

  if (params.tanggal) {
    query += ' AND l.tanggal_laporan = ?';
    values.push(params.tanggal);
  }

  if (params.jenis) {
    query += ' AND l.jenis_laporan = ?';
    values.push(params.jenis);
  }

  if (params.id_cabang) {
    query += ' AND l.id_cabang = ?';
    values.push(params.id_cabang);
  }

  query += ' GROUP BY l.id_laporan ORDER BY l.tanggal_laporan DESC';

  db.query(query, values, callback);
}

};

module.exports = Laporan;


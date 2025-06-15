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

  getArsipLaporan: (callback) => {
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
        l.id_cabang,
        u.nama_user,
        u.nip,
        c.nama_cabang,
        GROUP_CONCAT(f.foto_path) AS foto_paths
      FROM laporan l
      JOIN user u ON l.id_user = u.id_user
      JOIN cabang c ON l.id_cabang = c.id_cabang
      LEFT JOIN foto_laporan f ON l.id_laporan = f.id_laporan
      WHERE l.tanggal_laporan < CURDATE() - INTERVAL 7 DAY
      GROUP BY l.id_laporan
      ORDER BY l.tanggal_laporan DESC
    `;
    db.query(query, callback);
  },

  getArsipLaporanFiltered: ({ jenis, id_cabang, dari, sampai }, callback) => {
  let conditions = [];
  let values = [];

  // Filter berdasarkan tanggal
  if (dari && sampai) {
    conditions.push("l.tanggal_laporan BETWEEN ? AND ?");
    values.push(dari, sampai);
  }

  // Filter jenis laporan (jika diisi)
  if (jenis) {
    conditions.push("l.jenis_laporan = ?");
    values.push(jenis);
  }

  // Filter cabang (jika diisi)
  if (id_cabang) {
    conditions.push("l.id_cabang = ?");
    values.push(id_cabang);
  }

  const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";

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
    ${whereClause}
    GROUP BY l.id_laporan
    ORDER BY l.tanggal_laporan DESC
  `;

  db.query(query, values, callback);
}

};
module.exports = Laporan;


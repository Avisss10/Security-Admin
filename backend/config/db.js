// backend/config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // sesuaikan jika ada
  database: 'security_db' // sesuaikan dengan database yang kamu buat
});

db.connect((err) => {
  if (err) {
    console.error('Gagal koneksi ke database:', err.message);
    return;
  }
  console.log('✅ Terkoneksi ke MySQL');
});

module.exports = db;

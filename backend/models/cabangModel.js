// models/cabangModel.js
const db = require('../config/db');

const Cabang = {
  getAll: (callback) => {
    db.query('SELECT * FROM cabang', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM cabang WHERE id_cabang = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO cabang SET ?', data, callback);
  },

  update: (id, data, callback) => {
    db.query('UPDATE cabang SET ? WHERE id_cabang = ?', [data, id], callback);
  },

  delete: (id, callback) => {
    db.query('DELETE FROM cabang WHERE id_cabang = ?', [id], callback);
  },
};

module.exports = Cabang;

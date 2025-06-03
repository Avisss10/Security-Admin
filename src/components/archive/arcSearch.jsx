import React, { useState, useEffect } from 'react';
import '../../styles/search.css';
import axios from 'axios';

const ArchiveSearch = ({ onSearch }) => {
  const [filter, setFilter] = useState({
    jenis: '',
    id_cabang: '',
    dari: '',
    sampai: ''
  });

  const [cabangList, setCabangList] = useState([]);
  const [jenisList, setJenisList] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/cabang')
      .then(res => setCabangList(res.data))
      .catch(err => console.error('Gagal ambil cabang:', err));
  }, []);

  // Dapatkan semua jenis laporan dari data unik
  useEffect(() => {
    axios.get('http://localhost:5000/api/laporan/jenis-laporan')
      .then(res => setJenisList(res.data))
      .catch(err => console.error('Gagal ambil jenis laporan:', err));
  }, []);

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const { dari, sampai } = filter;

  const now = new Date();
  const semingguLalu = new Date();
  semingguLalu.setDate(now.getDate() - 7);

  // Konversi tanggal ke objek Date jika diisi
  const dariDate = dari ? new Date(dari) : null;
  const sampaiDate = sampai ? new Date(sampai) : null;

  // Validasi 1: dari > sampai
  if (dari && sampai && dariDate > sampaiDate) {
    alert('Tanggal "Dari" tidak boleh setelah "Sampai"');
    return;
  }

  // Validasi 2: dari/sampai lebih dari 7 hari ke belakang
  if ((dariDate && dariDate < semingguLalu) || (sampaiDate && sampaiDate < semingguLalu)) {
    alert('Tanggal tidak boleh lebih dari 7 hari ke belakang');
    return;
  }

  // Jika semua validasi lolos, kirim filter
  onSearch(filter);
};

return (
    <div className='post'>
      <form className="search-row" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="jenis">Jenis Laporan:</label>
          <select name="jenis" value={filter.jenis} onChange={handleChange}>
            <option value="">Semua Jenis</option>
            {jenisList.map((jenis, index) => (
              <option key={index} value={jenis}>{jenis}</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="id_cabang">Cabang:</label>
          <select name="id_cabang" value={filter.id_cabang} onChange={handleChange}>
            <option value="">Semua Cabang</option>
            {cabangList.map((cabang) => (
              <option key={cabang.id_cabang} value={cabang.id_cabang}>
                {cabang.nama_cabang}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="dari">Dari Tanggal:</label>
          <input
            type="date"
            name="dari"
            value={filter.dari}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="sampai">Sampai Tanggal:</label>
          <input
            type="date"
            name="sampai"
            value={filter.sampai}
            onChange={handleChange}
          />
        </div>

        {/* Tombol di luar input-group */}
        <button type="submit" className="btn-search">Cari</button>
      </form>


      <div className="search-tips">
        <p>·········· </p>
        <p>🔍 Gunakan filter untuk mencari laporan berdasarkan jenis, cabang, dan tanggal.</p>
        <p>📅 Tanggal harus berada dalam rentang 7 hari terakhir.</p>
      </div>
    </div>
  );
};

export default ArchiveSearch;
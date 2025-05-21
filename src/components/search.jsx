import React from 'react'
import '../styles/search.css'

const search = () => {
  return (
    <div className="search-container">
      <h2 className="search-title">Search Report</h2>
      
      <div className="search-form">
        <div className="form-group">
          <label>Jenis Laporan</label>
          <div className="select-wrapper">
            <select className="form-select">
              <option value="">Pilih Jenis Laporan</option>
              <option value="harian">Laporan Harian</option>
              <option value="mingguan">Laporan Mingguan</option>
              <option value="bulanan">Laporan Bulanan</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label>Dari Tanggal:</label>
          <input 
            type="date" 
            className="form-input" 
            placeholder="DD-MM-YYYY"
          />
        </div>
        
        <div className="form-group">
          <label>Sampai Tanggal:</label>
          <input 
            type="date" 
            className="form-input" 
            placeholder="DD-MM-YYYY"
          />
        </div>
        
        <button className="cari-button">Cari</button>
      </div>
      
      <div className="search-note">
        <p className="note-title">*Catatan</p>
        <p className="note-text">Periode Archive Hanya Bisa Di Lihat 7 Hari Ke Belakang</p>
      </div>
    </div>
  )
}

export default search
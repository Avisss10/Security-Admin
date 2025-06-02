import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentHeader from './contentHeader';
import Post from './post';
import '../styles/content.css';

const Content = () => {
  const [laporanHariIni, setLaporanHariIni] = useState([]);

  useEffect(() => {
    fetchLaporanHariIni();
  }, []);

  const fetchLaporanHariIni = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/laporan/today');
      setLaporanHariIni(res.data);
    } catch (err) {
      console.error('Gagal fetch laporan hari ini:', err);
    }
  };
  
  const handleDeleteLaporan = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/laporan/${id}`);
    setLaporanHariIni(prev => prev.filter(l => l.id_laporan !== id));
  } catch (err) {
    console.error('Gagal hapus laporan:', err);
  }
};


  return (
    <div className="content">
      {/* ✅ Header */}
      <ContentHeader />

      {/* ✅ Isi dashboard */}
      {laporanHariIni.length === 0 ? (
        <p>Tidak ada laporan hari ini.</p>
      ) : (
        laporanHariIni.map((laporan) => (
        <Post
          key={laporan.id_laporan}
          nama_user={laporan.nama_user}
          nip={laporan.nip}
          nama_cabang={laporan.nama_cabang}
          deskripsi={laporan.deskripsi_laporan}
          jenis={laporan.jenis_laporan}
          judul={laporan.judul_laporan}
          cuaca={laporan.kondisi_cuaca}
          hari={laporan.hari_laporan}
          waktu={laporan.waktu_laporan}
          tanggal={laporan.tanggal_laporan}
          foto_list={laporan.foto_list}
          onDelete={() => handleDeleteLaporan(laporan.id_laporan)}
        />
        ))
      )}
    </div>
  );
};

export default Content;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ContentHeader from './contentHeader';
import Post from './post';
import "../styles/content.css";

const Content = ({ pageName = "Dashboard" }) => {
  const [laporanList, setLaporanList] = useState([]);

  // Ambil semua laporan dari backend
  const fetchLaporan = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/laporan/today');
      setLaporanList(res.data);
    } catch (err) {
      console.error('Gagal mengambil laporan hari ini:', err);
    }
  };


  useEffect(() => {
    fetchLaporan();
  }, []);

  // Hapus laporan
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/laporan/${id}`);
      fetchLaporan(); // Refresh data setelah hapus
    } catch (err) {
      console.error('Gagal menghapus laporan:', err);
    }
  };

  return (
    <div className='content'>
      <ContentHeader title={pageName} />
      {laporanList.length === 0 ? (
        <p className="no-post">Belum ada laporan.</p>
      ) : (
        laporanList.map((lap) => (
          <Post
            key={lap.id_laporan}
            id={lap.id_laporan}
            nama={lap.nama_user}
            nip={lap.nip}
            cabang={lap.nama_cabang}
            isi_laporan={lap.isi_laporan}
            jam={lap.jam}
            tanggal={lap.tanggal}
            foto={lap.foto} // nama file
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default Content;

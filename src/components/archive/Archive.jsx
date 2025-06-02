import React, { useEffect, useState } from 'react';
import ArcHeader from './ArcHeader';
import ArchiveSearch from './arcSearch';
import ArchiveList from './arcList';
import '../../styles/archive.css';

const Archive = () => {
  const [laporan, setLaporan] = useState([]);

  useEffect(() => {
    // Simulasi fetch data
    setLaporan([
      {
        id_laporan: 1,
        nip: '435621',
        nama_user: 'Security A',
        nama_cabang: 'WITEL & STO Tanjung Priok',
        deskripsi: 'Laporan dummy',
        tanggal: '2025-06-01',
        waktu: '09:00:00',
        jenis: 'Dalam Gedung',
        judul: 'Kondisi Ruang Server',
        cuaca: 'Berawan',
        foto_list: ['lapor1.png']
      }
    ]);
  }, []);

  return (
    <div className="archive-container">
      <ArcHeader />
      <ArchiveSearch />
      <ArchiveList laporan={laporan} />
    </div>
  );
};

export default Archive;

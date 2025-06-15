import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArchiveList from '../../components/archive/arcList';
import ArcSearch from '../../components/archive/arcSearch';
import ArcHeader from '../../components/archive/arcHeader';

const Archive = () => {
  const [laporan, setLaporan] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterDescription, setFilterDescription] = useState('Laporan hari ini');

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/laporan/');

      const laporanWithFotoList = res.data.map((item) => ({
        ...item,
        foto_list: Array.isArray(item.foto_paths) ? item.foto_paths : (typeof item.foto_paths === 'string' ? item.foto_paths.split(',') : []),
      }));

      setLaporan(laporanWithFotoList);

      // Filter laporan to only today's reports
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filteredToday = laporanWithFotoList.filter((item) => {
        const tanggal = new Date(item.tanggal_laporan);
        tanggal.setHours(0, 0, 0, 0);
        return tanggal.getTime() === today.getTime();
      });

      setFiltered(filteredToday);
      setFilterDescription('Laporan hari ini');
      setSearch(''); // reset search on data fetch
    } catch (err) {
      console.error('Gagal ambil data arsip:', err);
    }
  };

  const handleFilterSearch = (filter) => {
    let filteredResult = laporan;
    let descriptionParts = [];

    // Filter jenis
    if (filter.jenis) {
      filteredResult = filteredResult.filter(l =>
        l.jenis_laporan.toLowerCase().trim() === filter.jenis.toLowerCase().trim()
      );
      if (filter.jenis.toLowerCase() !== 'semua jenis') {
        descriptionParts.push(`Jenis: ${filter.jenis}`);
      }
    }

    // Filter cabang
    if (filter.id_cabang) {
      filteredResult = filteredResult.filter(l =>
        String(l.id_cabang) === String(filter.id_cabang)
      );
      if (filter.id_cabang !== 'semua cabang') {
        descriptionParts.push(`Cabang: ${filter.id_cabang}`);
      }
    }

    // Filter tanggal
    if (filter.dari && filter.sampai) {
      const dari = new Date(filter.dari);
      dari.setHours(0, 0, 0, 0); // mulai dari awal hari
      const sampai = new Date(filter.sampai);
      sampai.setHours(23, 59, 59, 999); // akhir hari

      filteredResult = filteredResult.filter(l => {
        const tanggal = new Date(l.tanggal);
        return tanggal >= dari && tanggal <= sampai;
      });
      descriptionParts.push(`Tanggal: ${filter.dari} - ${filter.sampai}`);
    }

    setFiltered(filteredResult);
    setFilterDescription(descriptionParts.length > 0 ? descriptionParts.join(', ') : 'Semua laporan');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/laporan/${id}`);
      const updated = laporan.filter(item => item.id_laporan !== id);
      setLaporan(updated);
      setFiltered(updated.filter(item =>
        item.judul_laporan.toLowerCase().includes(search.toLowerCase())
      ));
    } catch (err) {
      console.error('Gagal hapus:', err);
    }
  };

  const handleSearchChange = (term) => {
    setSearch(term);
    if (term === '') {
      setFiltered(laporan);
    } else {
      setFiltered(
        laporan.filter((item) =>
          item.judul_laporan.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="archive-wrapper">
      <ArcHeader/>
      <ArcSearch
        search={search}
        onSearchChange={handleSearchChange}
        onSearch={handleFilterSearch}
        onReset={() => {
          fetchData();
          setFilterDescription('Laporan hari ini');
          setSearch('');
        }}
      />
      <div className="filter-description" style={{ margin: '10px 0', fontWeight: '600' }}>
        {filterDescription}
      </div>
      <ArchiveList laporan={filtered} onDelete={handleDelete} />
    </div>
  );
};

export default Archive;

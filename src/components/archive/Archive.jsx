import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArchiveList from '../../components/archive/arcList';
import ArcSearch from '../../components/archive/arcSearch';
import ArcHeader from '../../components/archive/arcHeader';


const Archive = () => {
  const [laporan, setLaporan] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/laporan/arsip');
      setLaporan(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error('Gagal ambil data arsip:', err);
    }
  };

  const handleFilterSearch = (filter) => {
  let filteredResult = laporan;

  // Filter jenis
  if (filter.jenis) {
    filteredResult = filteredResult.filter(l => l.jenis_laporan === filter.jenis);
  }

  // Filter cabang
  if (filter.id_cabang) {
    filteredResult = filteredResult.filter(l => l.id_cabang == filter.id_cabang);
  }

  // Filter tanggal
  if (filter.dari && filter.sampai) {
    const dari = new Date(filter.dari);
    const sampai = new Date(filter.sampai);
    filteredResult = filteredResult.filter(l => {
      const tanggal = new Date(l.tanggal);
      return tanggal >= dari && tanggal <= sampai;
    });
  }

  setFiltered(filteredResult);
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
    setFiltered(
      laporan.filter((item) =>
        item.judul_laporan.toLowerCase().includes(term.toLowerCase())
      )
    );
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
      />
      <ArchiveList laporan={filtered} onDelete={handleDelete} />
    </div>
  );
};

export default Archive;

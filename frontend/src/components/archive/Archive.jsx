import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ArchiveTable from './ArcTable';
import ArcSearch from './arcSearch';
import ArcHeader from './arcHeader';

const Archive = () => {
  const [laporan, setLaporan] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentFilter, setCurrentFilter] = useState({ dari: null, sampai: null, jenis: null, id_cabang: null });

  const fetchData = async (filterParams = null) => {
    try {
      setLoading(true);
      let params = {};
      if (filterParams) {
        params = filterParams;
      } else {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        params = { dari: today, sampai: today };
      }
      const res = await axios.get('http://localhost:5000/api/laporan/arsip', { params });
      setLaporan(res.data);
      setFiltered(res.data);
      setCurrentFilter(params);
    } catch (err) {
      console.error('Gagal ambil data arsip:', err);
    } finally {
      setLoading(false);
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
        const tanggal = new Date(l.tanggal_laporan);
        return tanggal >= dari && tanggal <= sampai;
      });
    }

    setFiltered(filteredResult);
    setCurrentFilter(filter);
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

  const renderFilterDescription = () => {
    const { dari, sampai, jenis, id_cabang } = currentFilter;
    let descriptions = [];

    if (dari && sampai) {
      if (dari === sampai) {
        descriptions.push({ label: 'Laporan', value: `Hari Ini (${dari})` });
      } else {
        descriptions.push({ label: 'Laporan', value: `Dari ${dari} sampai ${sampai}` });
      }
    }

    if (jenis) {
      descriptions.push({ label: 'Jenis', value: jenis });
    }

    if (id_cabang) {
      descriptions.push({ label: 'Cabang', value: id_cabang });
    }

    if (descriptions.length === 0) {
      // Default to "Laporan Hari Ini" if no filters active
      const today = new Date().toISOString().split('T')[0];
      descriptions.push({ label: 'Laporan', value: `Hari Ini (${today})` });
    }

    return (
      <div className="filter-description-container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {descriptions.map((desc, index) => (
          <div
            key={index}
            className="filter-badge"
            style={{
              backgroundColor: '#6f42c1',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '15px',
              fontSize: '0.9rem',
              fontWeight: '500',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
            title={`${desc.label}: ${desc.value}`}
          >
            <strong>{desc.label}:</strong> {desc.value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="archive-wrapper">
      <ArcHeader/>
      <ArcSearch
        search={search}
        onSearchChange={handleSearchChange}
        onSearch={handleFilterSearch}
      />
      <div className="filter-description">
        {renderFilterDescription()}
      </div>
      {loading ? (
        <div className="table-loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <ArchiveTable laporan={filtered} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default Archive;

import React from 'react';
import '../../styles/search.css';

const ArchiveSearch = () => {
  return (
    <form className="search-row">
      <select>
        <option value="">Semua Jenis</option>
        <option value="1">Dalam Gedung</option>
        <option value="2">Luar Gedung</option>
      </select>
      <input type="date" />
      <input type="date" />
      <button type="submit" className="btn-search">Cari</button>
    </form>
  );
};

export default ArchiveSearch;

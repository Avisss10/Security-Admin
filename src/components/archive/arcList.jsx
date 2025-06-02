import React from 'react';

const ArchiveList = ({ laporan }) => {
  return (
    <div className="laporan-list">
      {laporan.map((lapor) => (
        <div className="laporan-item" key={lapor.id_laporan}>
          <h4>{lapor.judul}</h4>
          <p><strong>Jenis:</strong> {lapor.jenis}</p>
          <p><strong>Cuaca:</strong> {lapor.cuaca}</p>
          <p><strong>Deskripsi:</strong> {lapor.deskripsi}</p>
          <p><strong>Tanggal:</strong> {lapor.tanggal}</p>
        </div>
      ))}
    </div>
  );
};

export default ArchiveList;

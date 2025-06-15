import React, { useState } from 'react';
import '../../styles/post.css';
import '../../styles/archive.css';
import Post from '../dashboard/post.jsx';

const ArchiveList = ({ laporan, onDelete }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  if (!laporan || laporan.length === 0) {
    return <p className="no-post-message">🔍 Tidak ada laporan ditemukan.</p>;
  }

  const closeModal = () => {
    setSelectedReport(null);
  };

  const handleDelete = () => {
    if (onDelete && selectedReport) {
      onDelete(selectedReport.id_laporan);
      closeModal();
    }
  };

  return (
    <>
      <table className="archive-table">
        <thead>
          <tr>
            <th>NIP</th>
            <th>Nama</th>
            <th>Cabang</th>
            <th>Deskripsi Laporan</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {laporan.map((lapor) => (
            <tr key={lapor.id_laporan}>
              <td>{lapor.nip}</td>
              <td>{lapor.nama_user}</td>
              <td>{lapor.nama_cabang}</td>
              <td>{lapor.deskripsi_laporan}</td>
              <td>{new Date(lapor.tanggal_laporan).toLocaleDateString('id-ID')}</td>
              <td>
                <button className="btn btn-primary" onClick={() => setSelectedReport(lapor)}>Detail</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedReport && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <Post
              nama_user={selectedReport.nama_user}
              nip={selectedReport.nip}
              nama_cabang={selectedReport.nama_cabang}
              deskripsi={selectedReport.deskripsi_laporan}
              jenis={selectedReport.jenis_laporan}
              judul={selectedReport.judul_laporan}
              cuaca={selectedReport.cuaca}
              hari={new Date(selectedReport.tanggal_laporan).toLocaleDateString('id-ID', { weekday: 'long' })}
              tanggal={selectedReport.tanggal_laporan}
              waktu={selectedReport.waktu_laporan || new Date(selectedReport.tanggal_laporan).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })}
              foto_list={selectedReport.foto_list}
              onDelete={handleDelete}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ArchiveList;

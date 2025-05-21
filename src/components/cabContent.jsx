import React, { useState } from 'react';
import { BiPencil } from 'react-icons/bi';
import '../styles/cabContent.css';
import CabHeader from './CabHeader';
import EditCabangModal from './cabEdit';

const CabContent = () => {
  // Initial sample data with useState hook
  const [cabangData, setCabangData] = useState([
    {
      id: 0,
      namaCabang: 'Jakarta Utara',
      alamatCabang: 'Jl.Panti, no 57 Jakarta Utara',
    },
    {
      id: 1,
      namaCabang: 'Jakarta Barat',
      alamatCabang: 'Jl.Panti, no 57 Jakarta Barat',
    },
  ]);

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cabangToEdit, setCabangToEdit] = useState(null);

  // Handle adding new cabang
  const handleAddCabang = (newCabang) => {
    setCabangData([...cabangData, newCabang]);
  };

  // Open edit modal and set the cabang to edit
  const handleOpenEditModal = (cabang) => {
    setCabangToEdit(cabang);
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCabangToEdit(null);
  };

  // Update cabang data
  const handleUpdateCabang = (updatedCabang) => {
    setCabangData(
      cabangData.map(cabang => 
        cabang.id === updatedCabang.id ? updatedCabang : cabang
      )
    );
  };

  return (
    <>
      <CabHeader onAddCabang={handleAddCabang} />
      
      <div className="cab-content">
        <div className="cabang-table-container">
          <table className="cabang-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nama Cabang</th>
                <th>Alamat Cabang</th>
                <th>Custom</th>
              </tr>
            </thead>
            <tbody>
              {cabangData.map((cabang) => (
                <tr key={cabang.id}>
                  <td>{cabang.id}</td>
                  <td>{cabang.namaCabang}</td>
                  <td>{cabang.alamatCabang}</td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleOpenEditModal(cabang)}
                    >
                      <BiPencil className="edit-icon" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Cabang Modal */}
      <EditCabangModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        cabangData={cabangToEdit}
        onUpdateCabang={handleUpdateCabang}
      />
    </>
  );
};

export default CabContent;
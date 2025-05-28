import React, { useState, useEffect } from 'react';
import { BiPencil } from 'react-icons/bi';
import '../styles/secContent.css';
import SecHeader from './SecHeader';
import EditSecurityModal from './secEdit';
import axios from 'axios';

const SecContent = () => {
  const [securityAccounts, setSecurityAccounts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [securityToEdit, setSecurityToEdit] = useState(null);

  // 🔄 Fetch data dari backend
  const fetchSecurityAccounts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/user?level=Security');
      const formatted = res.data.map((user) => ({
        id: user.id_user,
        nip: user.nip,
        name: user.nama_user,
        password: user.password,
        cabang: user.nama_cabang,
        level: user.nama_level,
        id_cabang: user.id_cabang,
        id_level: user.id_level
      }));
      setSecurityAccounts(formatted);
    } catch (err) {
      console.error('Gagal fetch security:', err);
    }
  };

  useEffect(() => {
    fetchSecurityAccounts();
  }, []);

  // ✅ Tambah security (dari SecHeader)
  const handleAddSecurity = async (newSecurity) => {
    try {
      await axios.post('http://localhost:5000/api/user', newSecurity);
      fetchSecurityAccounts(); // refresh
    } catch (err) {
      console.error('Gagal tambah security:', err);
    }
  };

  // ✅ Buka modal edit
  const handleOpenEditModal = (security) => {
    setSecurityToEdit(security);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSecurityToEdit(null);
  };

  // ✅ Update security (PUT)
  const handleUpdateSecurity = async (updatedSecurity) => {
    try {
      await axios.put(`http://localhost:5000/api/user/${updatedSecurity.id}`, updatedSecurity);
      fetchSecurityAccounts(); // refresh
      handleCloseEditModal();
    } catch (err) {
      console.error('Gagal update security:', err);
    }
  };

  return (
    <>
      <SecHeader onAddSecurity={handleAddSecurity} />

      <div className="sec-content">
        <div className="security-table-container">
          <table className="security-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NIP</th>
                <th>Name</th>
                <th>Password</th>
                <th>Cabang</th>
                <th>Level</th>
                <th>Custom</th>
              </tr>
            </thead>
            <tbody>
              {securityAccounts.map((account) => (
                <tr key={account.id}>
                  <td>{account.id}</td>
                  <td>{account.nip}</td>
                  <td>{account.name}</td>
                  <td>{account.password}</td>
                  <td>{account.cabang}</td>
                  <td>{account.level}</td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleOpenEditModal(account)}
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

      {/* Modal Edit */}
      <EditSecurityModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        securityData={securityToEdit}
        onUpdateSecurity={handleUpdateSecurity}
      />
    </>
  );
};

export default SecContent;

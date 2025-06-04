import React, { useState, useEffect } from 'react';
import { BiPencil, BiTrash } from 'react-icons/bi';
import '../styles/secContent.css';
import SecHeader from './SecHeader';
import EditSecurityModal from './secEdit';
import DelConfirm from './delConfirm';
import axios from 'axios';

const SecContent = () => {
  const [securityAccounts, setSecurityAccounts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [securityToEdit, setSecurityToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [securityToDelete, setSecurityToDelete] = useState(null);

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

  // ➕ Tambah security (dipanggil dari SecHeader)
  const handleAddSecurity = async (newSecurity) => {
    try {
      await axios.post('http://localhost:5000/api/user', newSecurity);
      fetchSecurityAccounts(); // refresh otomatis
    } catch (err) {
      console.error('Gagal tambah security:', err);
    }
  };

  // ✏️ Edit security
  const handleOpenEditModal = (security) => {
    setSecurityToEdit(security);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSecurityToEdit(null);
  };

  const handleUpdateSecurity = async (updatedSecurity) => {
    try {
      await axios.put(`http://localhost:5000/api/user/${updatedSecurity.id}`, updatedSecurity);
      fetchSecurityAccounts(); // refresh otomatis
      handleCloseEditModal();
    } catch (err) {
      console.error('Gagal update security:', err);
    }
  };

  // 🗑️ Delete security
  const handleOpenDeleteModal = (security) => {
    setSecurityToDelete(security);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSecurityToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/user/${securityToDelete.id}`);
      fetchSecurityAccounts(); // refresh otomatis
    } catch (err) {
      console.error('Gagal menghapus security:', err);
    } finally {
      handleCloseDeleteModal();
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
                  <td className="btn-group">
                    <button
                      className="edit-btn"
                      onClick={() => handleOpenEditModal(account)}
                    >
                      <BiPencil className="edit-icon" />
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleOpenDeleteModal(account)}
                    >
                      <BiTrash className="delete-icon" />
                      Delete
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

      {/* Modal Delete */}
      <DelConfirm
        isOpen={isDeleteModalOpen}
        message={`Apakah Anda yakin ingin menghapus security "${securityToDelete?.name}"?`}
        onCancel={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default SecContent;

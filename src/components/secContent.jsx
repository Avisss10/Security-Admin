import React, { useState } from 'react';
import { BiPencil } from 'react-icons/bi';
import '../styles/secContent.css';
import SecHeader from './SecHeader';
import EditSecurityModal from './secEdit';

const SecContent = () => {
  // Initial sample data
  const [securityAccounts, setSecurityAccounts] = useState([
    {
      id: 0,
      nip: 435621,
      name: 'Security 1',
      password: '#hashpass',
      cabang: 'Jakarta Barat',
      level: 'Security',
    },
    {
      id: 1,
      nip: 435622,
      name: 'Security 2',
      password: '#hashpass',
      cabang: 'Jakarta Utara',
      level: 'Security',
    },
  ]);

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [securityToEdit, setSecurityToEdit] = useState(null);

  // Handle adding new security
  const handleAddSecurity = (newSecurity) => {
    setSecurityAccounts([...securityAccounts, newSecurity]);
  };

  // Open edit modal and set the security to edit
  const handleOpenEditModal = (security) => {
    setSecurityToEdit(security);
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSecurityToEdit(null);
  };

  // Update security data
  const handleUpdateSecurity = (updatedSecurity) => {
    setSecurityAccounts(
      securityAccounts.map(security => 
        security.id === updatedSecurity.id ? updatedSecurity : security
      )
    );
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

      {/* Edit Security Modal */}
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
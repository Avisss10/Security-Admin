import React, { useState, useEffect } from 'react';
import '../styles/secEdit.css';

const EditSecurityModal = ({ isOpen, onClose, securityData, onUpdateSecurity }) => {
  const [formData, setFormData] = useState({
    id: '',
    nip: '',
    name: '',
    password: '',
    cabang: '',
    level: 'Security',
  });

  // Initialize form data when security data changes
  useEffect(() => {
    if (securityData) {
      setFormData({
        id: securityData.id,
        nip: securityData.nip,
        name: securityData.name,
        password: securityData.password,
        cabang: securityData.cabang,
        level: securityData.level,
      });
    }
  }, [securityData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateSecurity(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Security</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nip">NIP:</label>
            <input
              type="number"
              id="nip"
              name="nip"
              value={formData.nip}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Leave unchanged to keep current password"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cabang">Cabang:</label>
            <select
              id="cabang"
              name="cabang"
              value={formData.cabang}
              onChange={handleChange}
              required
            >
              <option value="">Select Cabang</option>
              <option value="Jakarta Barat">Jakarta Barat</option>
              <option value="Jakarta Utara">Jakarta Utara</option>
              <option value="Jakarta Selatan">Jakarta Selatan</option>
              <option value="Jakarta Timur">Jakarta Timur</option>
              <option value="Jakarta Pusat">Jakarta Pusat</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="level">Level:</label>
            <input
              type="text"
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              readOnly
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Update Security</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSecurityModal;
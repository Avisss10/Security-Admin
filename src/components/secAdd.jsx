import React, { useState } from 'react';
import '../styles/secAdd.css';

const AddSecurityModal = ({ isOpen, onClose, onAddSecurity }) => {
  const [formData, setFormData] = useState({
    nip: '',
    name: '',
    password: '',
    cabang: '',
    level: 'Security',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate a new ID based on timestamp
    const newSecurity = {
      id: Date.now(),
      ...formData,
    };
    onAddSecurity(newSecurity);
    
    // Reset form
    setFormData({
      nip: '',
      name: '',
      password: '',
      cabang: '',
      level: 'Security',
    });
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Security</h2>
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
            <button type="submit" className="submit-btn">Add Security</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSecurityModal;
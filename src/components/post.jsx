import React, { useState, useRef, useEffect } from 'react';
import '../styles/post.css';
import profileImage from '../img/profile.jpeg';

const Post = ({
  id,
  nama,
  nip,
  cabang,
  isi_laporan,
  jam,
  tanggal,
  foto,
  onDelete
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='post'>
      <div className="post-header">
        <div className="post-user">
          <img 
            src={profileImage} 
            alt="Profile" 
            className="post-avatar"
          />
          <div className="post-user-info">
            <span className='post-name'>{nama}</span>
            <span className='post-username'>• {nip}</span>
            <span className='post-location'>• {cabang}</span>
          </div>
        </div>

        <div className="post-menu" ref={menuRef}>
          <button className="menu-button" onClick={toggleMenu}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <g>
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </g>
            </svg>
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              <button onClick={handleDelete}>Delete Post</button>
            </div>
          )}
        </div>
      </div>
      
      <div className='post-content'>
        <p>{isi_laporan}</p>
        {foto && (
          <div className="post-image">
            <img src={`http://localhost:5000/uploads/${foto}`} alt="Foto Laporan" />
          </div>
        )}
      </div>
      
      <div className="post-footer">
        <span className='post-time'>
          {jam} - Jam Laporan • {tanggal} - Tanggal Laporan
        </span>
      </div>
    </div>
  );
};

export default Post;

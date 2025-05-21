import React, { useState, useRef, useEffect } from 'react';
import '../styles/post.css';
import profileImage from '../img/profile.jpeg'; // Proper image import

const Post = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleDelete = () => {
    console.log('Post deleted');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside
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
            <span className='post-name'>Security</span>
            <span className='post-username'>@Username</span>
            <span className='post-location'>• Jakarta Utara</span>
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
              <button>Edit Post</button>
              <button>Share Post</button>
            </div>
          )}
        </div>
      </div>
      
      <div className='post-content'>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis molestias ullam, nulla laborum blanditiis ducimus laudantium at vero. Alias officia, fuga maiores excepturi deleniti error accusantium a quae eveniet iure!</p>
      </div>
      
      <div className="post-footer">
        <span className='post-time'>09.20 • 19/02/2025</span>
      </div>
    </div>
  );
};

export default Post;
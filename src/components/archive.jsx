import React from 'react'
import ArcHeader from './arcHeader'
import Search from './search'
import Post from './post'
import '../styles/archive.css'

const archive = ({ pageName = "Archive" }) => {
  return (
    <div className="archive-page">
      <div className="archive-layout">
        <div className="archive-main">
          <ArcHeader title={pageName}/>
          <div className="posts-containerarc">
            <Post />
            <Post />
            <Post />
          </div>
        </div>
        <div className="archive-sidebar">
            <Search />
        </div>
      </div>
    </div>
  )
}

export default archive
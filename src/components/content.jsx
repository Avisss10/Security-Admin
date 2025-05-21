import React from 'react'
import ContentHeader from './contentHeader'
import Post from './post'
import "../styles/content.css"

const Content = ({ pageName = "Dashboard" }) => {
  return (
    <div className='content'>
      <ContentHeader title={pageName} />
      <Post />
      <Post />
      <Post />
      <Post />
    </div>
  )
}

export default Content
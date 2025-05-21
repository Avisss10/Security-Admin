import React from 'react'
import { BiSearch } from 'react-icons/bi'

const contentHeader = () => {
  return (
    <div className='content--header'>
      <h2 className="header--title">Dashboard</h2>
      <div className="header--activity">
        <div className="search-box">
          <input type="text" placeholder='Search Reporting here..' />
          <BiSearch className='icon' />
        </div>
      </div>
    </div>
  )
}

export default contentHeader
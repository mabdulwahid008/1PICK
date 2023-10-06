import React from 'react'
import './Loader.css'

function Loader() {
  return (
    <div className='loader'>
      <img src={require('../../assets/loader.gif')} alt='loading'/>
    </div>
  )
}

export default Loader

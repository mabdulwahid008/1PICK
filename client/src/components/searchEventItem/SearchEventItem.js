import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import './SearchEventItem.css'
import { Context } from '../../state/Provider'
import { AdminContext } from '../../state/AdminProvider'

function SearchEventItem({event}) {
    const { setSearchBox, setMobSearchBox } = useContext(window.location.pathname.startsWith('/admin')? AdminContext : Context)
  return (
    <Link to={`event-detail/${event._id}`} className='search-event' onClick={()=>{setSearchBox(false); setMobSearchBox(false)}}>
      <div className='search-event-image'>
        {/* {event.image_cid && <img src={`https://ipfs.io/ipfs/${event.image_cid}`} alt='event-image'/>} */}
        {event.image_cid && <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`} alt='event-image'/>}
      </div>
      <div className='search-event-metadata'>
            <h2>{event.title}</h2>
            <div className='search-event-stats'>
                <img src={require('../../assets/v_bars_grey.png')} alt='stats'/>
                <p>{event.total_volume} P</p>
            </div>
      </div>
    </Link>
  )
}

export default SearchEventItem

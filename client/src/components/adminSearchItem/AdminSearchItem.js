import React, { useContext, memo } from 'react'
import './AdminSearchItem.css'
import { AdminContext } from '../../state/AdminProvider'

function AdminSearchItem({ event }) {
    const { setEventPopup, setSearchbox } = useContext(AdminContext)
    
  return (
    <div className='admin-search-item' onClick={()=>{setEventPopup(event._id); setSearchbox(false)}}>
        {/* <img src={`https://ipfs.io/ipfs/${event.image_cid}`} alt='event'/> */}
        <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`} alt='event'/>
        <div>
            <h2>{event.title}</h2>
            <div>
                <p>{event.total_volume} Vol</p>
                {event.is_active === 0 && event.total_volume === 0 && <p><span style={{backgroundColor: '#50B5FF'}}></span>Need Approval</p>}
                {event.is_active === 0 && event.total_volume !== 0 && <p><span style={{backgroundColor: '#FFC542'}}></span>Deactive</p>}
                {event.is_active === 1 && <p><span style={{backgroundColor: '#00B66D'}}></span>Active</p>}
                {event.is_active === -1 && <p><span style={{backgroundColor: '#FF385C'}}></span>Executed</p>}
            </div>
        </div>
    </div>
  )
}

export default memo(AdminSearchItem)

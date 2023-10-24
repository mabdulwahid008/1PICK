import React, { useContext, useEffect, useState } from 'react'
import './AdminEvents.css'
import { AdminContext } from '../../state/AdminProvider'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { mobEventFilter } from '../../utills/selectStyles'
import ReactSelect from 'react-select'


const filters = [
    {value: 99, label: 'All'},
    {value: 1, label: 'Active'},
    {value: 0, label: 'Waiting'}, // is_active = 0 and reporeted by users
    {value: 4, label: 'Pending'}, // is_active = 0 and appealed by users
    {value: -1, label: 'Closed'},
    {value: -2, label: 'Canceled'},
    {value: 3, label: 'Hidden'},
]

function AdminEvents() {
    const { refresh, setGoStopPopup } = useContext(AdminContext)
   

    const [allEvents, setAllEvents] = useState(null)
    const [events, setEvents] = useState(null)
    const [filteredObj, setFilteredObj] = useState({value: 99, label: 'Active'})

    const fetchEvents = async() => {
        const responses = await fetch(`/event/admin/event-listing/${filteredObj.value}`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await responses.json()
        if(responses.status === 200){
            setEvents(res)
            setAllEvents(res)
        }
        else if (responses.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else{
            toast.error(res.message)
        }
    }


    useEffect(() => {
        setAllEvents(null)
        fetchEvents()
    }, [filteredObj])
   
     


    useEffect(()=>{
        fetchEvents()
    }, [refresh])
  return (
    <div className='admin-events'>
        <div className='admin-filter-events'>
        <ReactSelect isSearchable={ false } value={filteredObj} options={filters} styles={mobEventFilter} onChange={(option)=>setFilteredObj(option)}/>
        <a href={'http://localhost:5000/file/events'} target='_blank'><img src={require('../../assets/download.png')} /></a>
    </div>
      {events?.map((event, index) => {
          return <div className='event-item-mob' key={index}>
            <Link to={`/event-detail/${event._id}`} target='_blank' className='e-item-meta'>
              <Link to={`/event-detail/${event._id}`} target='_blank'>
                <h2>{event.title}</h2>
                <p>{event.e_start.replace('T', ' ')}</p>
              </Link>
              <div>
                {event.image_cid && <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`} alt='event-image' />}
              </div>
            </Link>

            <div>
              <h3 className='pick-val'>{event.pick ? event.pick : ' '}</h3>
              {event && <div className='yes-no-mob'>
                <p>YES &nbsp; {(100 - event.no_bet_percentage).toFixed(2)}%</p>
                <p>NO &nbsp; {event.no_bet_percentage?.toFixed(2)}%</p>
              </div>}
            </div>
           
            <div className='parcipated-footer'>
                <div className='event-views-bets'>
                    <span>
                        <img src={require('../../assets/eye.png')}/>
                        <p className='myselect'>{parseInt(event.views).toLocaleString()}</p>
                    </span>
                    <span>
                        <img src={require('../../assets/handshake.png')}/>
                        <p className='myselect'>{parseInt(event.responses).toLocaleString()}</p>
                    </span>
                </div>
                <p className='myselect'>
                    <span></span>
                    <span>Pool</span>
                    <span>{parseInt(event.bet_amount).toLocaleString()}P</span>
                </p>
            </div>

            {event.is_active == 1 && <button onClick={() => setGoStopPopup(event._id)}>Go / Stop</button>}
            {event.is_active == 0 && <button onClick={() => setGoStopPopup(event._id)}>Waiting</button>}
            {event.is_active == 4 && <button onClick={() => setGoStopPopup(event._id)}>Pending</button>}
            
          </div>
        })}
    </div>
  )
}

export default AdminEvents

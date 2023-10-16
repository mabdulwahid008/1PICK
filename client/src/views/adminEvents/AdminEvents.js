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
    {value: 2, label: 'Pending'},
    {value: 0, label: 'Inactive'},
    {value: -1, label: 'Terminated'},
    {value: -2, label: 'Canceled'},
    {value: 3, label: 'Hidden'},
]

function AdminEvents() {
    const { refresh } = useContext(AdminContext)

    const [allEvents, setAllEvents] = useState(null)
    const [events, setEvents] = useState(null)
    const [filteredObj, setFilteredObj] = useState({value: 99, label: 'Active'})

    const fetchEvents = async() => {
        const responses = await fetch('/event/admin/event-listing', {
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

    const filterEvents = (filter) => {
        if(filter === 0){
            setEvents(allEvents)
        }
        if(filter === 1){
            let filtered = []
            for (let i = 0; i < allEvents.length; i++) {
                if(allEvents[i].is_active === 0 && allEvents[i].bet_amount === 0)
                    filtered.push(allEvents[i])
                
            }
            setEvents(filtered)
        }
        if(filter === 2){
            let filtered = []
            for (let i = 0; i < allEvents.length; i++) {
                if(allEvents[i].is_active === 1)
                    filtered.push(allEvents[i])
                
            }
            setEvents(filtered)
        }
        if(filter === 3){
            let filtered = []
            for (let i = 0; i < allEvents.length; i++) {
                if(allEvents[i].is_active === 0 && allEvents[i].bet_amount !== 0)
                    filtered.push(allEvents[i])
                
            }
            setEvents(filtered)
        }
        if(filter === 4){
            let filtered = []
            for (let i = 0; i < allEvents.length; i++) {
                if(allEvents[i].is_active === -1)
                    filtered.push(allEvents[i])
                
            }
            setEvents(filtered)
        }

        // setFilterBox(false)
    }

    const downloadXlsx = async() => {

    }


    useEffect(()=>{
        fetchEvents()
    }, [refresh])
  return (
    <div className='admin-events'>
        <div className='admin-filter-events'>
        <ReactSelect isSearchable={ false } value={filteredObj}  options={filters} styles={mobEventFilter} onChange={(option)=>setFilteredObj(option)}/>
        <a href={'http://localhost:5000/file/users'} target='_blank'><img src={require('../../assets/download.png')} onClick={downloadXlsx}/></a>
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

            {event.is_active == 1 ?
             <button>Go / Stop</button>
            :
            <button>Pending</button>
            }
          </div>
        })}
    </div>
  )
}

export default AdminEvents

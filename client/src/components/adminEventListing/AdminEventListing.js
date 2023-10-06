import React, { useContext, useEffect, useState } from 'react'
import './AdminEventListing.css'
import { Link } from 'react-router-dom'
import { BsThreeDots } from 'react-icons/bs'
import { AdminContext } from '../../state/AdminProvider'
import { toast } from 'react-toastify'

function AdminEventListing() {
    const { setEventPopup, refresh } = useContext(AdminContext)

    const [allEvents, setAllEvents] = useState(null)
    const [events, setEvents] = useState(null)
    const [filterBox, setFilterBox] = useState(false)

 
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

        setFilterBox(false)
    }

    useEffect(()=>{
        fetchEvents()
    }, [refresh])

  return (
    <div className='event-listing-wrapper' id='events'>
        <div className='event-listing'>
            <div className='events-wrapper'>
                <div className='event-listing-head'>
                    <h3>Checkout Your Ongoing Events</h3>
                    <div>
                        <Link to='/create-event' target='_blank'>Create New Event</Link>
                        <a onClick={()=>setFilterBox(state=>!state)}>Filter Events</a>
                        {filterBox && <div className='filter-events-box'>
                            <div onClick={()=>filterEvents(0)}>
                                <span></span><p>All Events</p>
                            </div>
                            <div onClick={()=>filterEvents(1)}>
                                <span></span><p>Need Approval</p>
                            </div>
                            <div onClick={()=>filterEvents(2)}>
                                <span></span><p>Active</p>
                            </div>
                            <div onClick={()=>filterEvents(3)}>
                                <span></span><p>Deactive</p>
                            </div>
                            <div onClick={()=>filterEvents(4)}>
                                <span></span><p>Executed</p>
                            </div>
                        </div>}
                    </div>
                </div>



                <div class="event-list-container">
                    <table>
                    <tbody className='admin-event-lists'>
                    {events?.length === 0 && <p>No Events.</p>}
                    {events?.length > 0 && events?.map((event, index)=>{
                        return <tr>
                                    <td style={{width:'300px'}} className='event-meta-data'>
                                        
                                                {/* <img src={`https://ipfs.io/ipfs/${event.image_cid}`} alt='event'/> */}
                                                <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`} alt='event'/>
                                                <div className='event-list-title'>
                                                    <h4>{event.title}</h4>
                                                    <p>{event.e_start.replace('T', ' ')}</p>
                                                </div>
                                    </td>
                                    <td><p onClick={()=> setEventPopup(event._id)}>Visit Event</p></td>
                                    <td>
                                        {event.is_active === 0 && event.bet_amount === 0 && <><span style={{backgroundColor: '#50B5FF'}}></span> <p>Need Approval</p></>}
                                        {event.is_active === 0 && event.bet_amount !== 0 && <><span style={{backgroundColor: '#FFC542'}}></span> <p>Deactive</p> </>}
                                        {event.is_active === 1 && <><span style={{backgroundColor: '#00B66D'}}></span><p>Active</p></>}
                                        {event.is_active === -1 &&<> <span style={{backgroundColor: '#FF385C'}}></span> <p>Executed</p></>}
                                    </td>
                                    <td>{event.bet_amount}P</td>
                                    <td>{event.responses} Responses</td>
                                    <td><BsThreeDots onClick={()=> setEventPopup(event._id)}/></td>
                            </tr>
                    })}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminEventListing

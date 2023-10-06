import React, { useContext, useEffect } from 'react'
import './Home.css'
import { Context } from '../../state/Provider'
import CategoryCarosul from '../../components/categoryCarosul/CategoryCarosul'
import EventItem from '../../components/eventItem/EventItem'
import Loader from '../../components/loader/Loader'


function Home() {
  const { openSideBar, events, toatalEvents, setPageForEvent } = useContext(Context)

  let eventSytle = {}
  if(!openSideBar && window.innerWidth > 768)
      eventSytle = {
        width : '238px',
        fontSize: '10.6496px',
      }
  else if(openSideBar && window.innerWidth > 768)
      eventSytle = {
        width : '272px',
        fontSize: '12.6496px',
      }
  else if(window.innerWidth > 768)
      eventSytle = {
        width : '100%',
        fontSize: '12.6496px',
        padding: '',
      }

  useEffect(()=>{
  }, [events])
  
  return (
    <>
    <CategoryCarosul />
    {!events && <Loader />}
    {events?.length === 0 && <p className='no-results'>No results.</p>}
    {events && events?.length !== 0 && window.innerWidth < 768 && <p className='total-items'>{toatalEvents} Items</p>}
    {events && <div className='events'> 
      {events?.map((event, index)=>{
        return <EventItem eventSytle={eventSytle} event={event} key={index}/>
      })}
    </div>}
    </>
  )
}

export default Home

import React, { useContext, useEffect, useState } from 'react'
import './EventDetail.css'
import Bet from '../../components/bet/Bet'
import Graph from '../../components/graph/Graph'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Context } from '../../state/Provider'
import { minifyAddress2 } from '../../utills'

function EventDetail() {

    const { categoryIDforEventFiltering, setCategoryIDforEventFiltering, setPageForEvent, setEvents } = useContext(Context)
    const navigate = useNavigate()

    const filterByCategory = (_id) => {
        if(categoryIDforEventFiltering !== _id){
            setEvents(null)
            setPageForEvent(1)
            setCategoryIDforEventFiltering(_id)
         } 
        navigate('/')
    }
    
    const handleClick = () => {
        navigator.clipboard.writeText(window.location.href)
        .then(function() {
          toast.success('URL copied to clipboard!');
        })
      };

    const { refresh } = useContext(Context)

    const { id } = useParams()

    const [event, setEvent] = useState(null)

    const getEvent = async() => {
        const response = await fetch(`/event/single/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json'
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setEvent(res)
        }
        else if(response.status === 404){
            setEvent([])
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
    },[event])

    useEffect(()=>{
        getEvent()
    }, [id, refresh])

  return (
    <>
    {event?.length === 0 && <div className='event-not-found'>
        <h2>OOPS!</h2>
        <p>Event not found.</p>
        </div>}
    {event?._id && <div className='event-detail'>
        <div className='event-data'>
            <div className='event-data-head'>
                <img src={`https://ipfs.io/ipfs/${event?.image_cid}`} alt='event'/>
                <div className='event-data-head-metadata'>
                    <div>
                        <div>
                            <div className='e-category' onClick={()=>filterByCategory(event?.c_id)}><p>{event?.c_name}</p></div>
                         </div>
                        <a><img src={require('../../assets/e_link.png')} alt='link' onClick={handleClick}/></a>
                    </div>
                    <h1 className='e-title'>{event?.title}</h1>
                    <p>Expires On {event?.e_start.replace('T', ' ')}</p> 
                </div>
            </div> 

            <Graph event_id={id}/>

            <div className='event-about'>
                <h2>About</h2>
                <hr />
                {event?.description.split(/\n/g).map((line, index)=>{
                   return <div key={index}>
                            <p key={index}>{line}</p><br />
                         </div>
                })}
            </div>
            <div className='extra-cards'>
                <div className='e-card'>
                    <div>
                        <h3>IPFS</h3>
                        <a href={`////ipfs.io/ipfs/${event?.content_cid}`} target='_blank' rel='noopener noreferrer'>{minifyAddress2(event?.content_cid)}</a>
                    </div>
                </div>
                <div className='e-card'>
                    <div>
                        <h3>Resolver</h3>
                        <a href={`//etherscan.io/address/${event?.creator}`} target='_blank' rel='noopener noreferrer'>{minifyAddress2(event?.creator)}</a>
                    </div>
                </div>
                <div className='e-card'>
                    <div>
                        <h3>Resolution Source</h3>
                        <a href={`//${event?.resolution_url.replace('https://', '')}`} target='_blank' rel='noopener noreferrer'>{event?.resolution_url.substr(0, 20)}</a>
                    </div>
                </div>
            </div>
        </div>
        <div className='bet'>
            <Bet event_id={event._id} no_bet_percentage={event.no_bet_percentage} yes_bet_percentage={event.yes_bet_percentage} pick={event.pick}/>
        </div>
    </div>}
    </>
  )
}

export default EventDetail

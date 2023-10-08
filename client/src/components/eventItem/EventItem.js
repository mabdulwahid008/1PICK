import React, { useContext, useEffect } from 'react'
import './EventItem.css'
import { Link } from 'react-router-dom'
import { minifyAddress } from '../../utills/index'
import { toast } from 'react-toastify'
import { Context } from '../../state/Provider'

function EventItem({eventSytle, event}) {

    const { setAddress } = useContext(Context)

    console.log(event);

    const addToMyFavourite = async(event_id) => {
        const response = await fetch('/event/favourite', {
            method: 'POST',
            headers: {
                'Content-Type' : 'Application/json',
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({event_id})
        })
        const res  = await response.json()
        if(response.status === 200){
            toast.success(res.message)
        }
        else if(response.status === 401){
            setAddress(null)
            toast.error("You need to sign in.")
        }
        else
            toast.error(res.message)
    }

  return (
    <>
    {/* <div className='event-item' style={{width: eventSytle.width}}>
        <div className='event-header'>
            <Link to={`event-detail/${event._id}`} className='event-img'>
                {event.image_cid && <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`}  alt='event-image'/>}
            </Link> 
            <div className='event-metadata'> 
                <div className='event-metadata-top'>
                    <p className='event-cat'>{event.c_name}</p>
                    <div>
                        <div className='event-owner-add'>
                            <p>{minifyAddress(event.creator)}</p>
                        </div>
                        <img src={require('../../assets/thumb.png')} alt='like'/>
                    </div>
                </div>
                <Link to={`event-detail/${event._id}`} className='event-headline'>
                    <h4 style={{fontSize: eventSytle.fontSize}}>{event.title.length > 45? `${event.title.substr(0, 45)}...` : event.title}</h4>
                </Link>
                <div className='event-expiration'>
                    <img srcc={require('../../assets/calender.png')} alt='calender'/>
                    <p>Expires on {event.e_start.substr(0, 10)}</p>
                </div>
            </div>
        </div>
        <div className='event-stats'>
            <div className='stats'>
                <div style={{width: `${event.no_bet_percentage}%` }}></div>
            </div>
            <div className='yes-no'>
                <p>No</p>
                <p>Yes</p>
            </div>
        </div>
        <div className='event-footer'>
            <div>
                <img src={require('../../assets/bars.png')} alt='stats'/>
                <p>{event.total_volume} P</p>
            </div>
            <img src={require('../../assets/start.png')} onClick={()=>{addToMyFavourite(event._id)}} alt='favourite'/>
        </div>
    </div> */}

    <Link to={`event-detail/${event._id}`} className='event-item-mob'>
        <Link className='e-item-meta'>
                <Link to={`event-detail/${event._id}`}>
                    <h2>{event.title}</h2>
                    <p>{event.e_start.substr(0, 10)}</p>
                </Link>
                <div>
                        <div className='event-owner-add'>
                            <p>{minifyAddress(event.creator)}</p>
                        </div>
                        {/* {event.image_cid && <img src={`https://ipfs.io/ipfs/${event.image_cid}`}  alt='event-image'/>} */}
                        {event.image_cid && <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`}  alt='event-image'/>}
                </div>
        </Link>
        <div>
            <p className='pick-val'>{event.pick ? event.pick : ' '}</p>
            <div className='yes-no-mob'>
                <p>YES &nbsp; {(100-event.no_bet_percentage).toFixed(2)}%</p>
                <p>NO &nbsp; {event.no_bet_percentage.toFixed(2)}%</p>
            </div>
        </div> 
        <div>
            <p>OPEN</p>
            <p>Pool &nbsp; {event.total_volume}P</p>
        </div>
    </Link>
    </>
  )
}

export default EventItem

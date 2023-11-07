import React, { useContext, useEffect } from 'react'
import './EventItem.css'
import { Link } from 'react-router-dom'
import { minifyAddress } from '../../utills/index'
import { toast } from 'react-toastify'
import { Context } from '../../state/Provider'

function EventItem({event, useLink = true}) {


  return (
    <>
    <Link to={useLink? `event-detail/${event._id}`: ''} className='event-item-mob'>
        <Link className='e-item-meta'>
                <Link to={useLink? `event-detail/${event._id}`: ''}>
                    <h2>{event.title}</h2>
                    <p>{event.e_start.substr(0, 10)}</p>
                </Link>
                <div>
                        <div className='event-owner-add'>
                            <p>{minifyAddress(event.creator)}</p>
                        </div>
                        <Link to={useLink? `event-detail/${event._id}`: ''}>{event.image_cid && <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`}  alt='event-image'/>}</Link>
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
            <p>Pool &nbsp; {event.total_volume}P</p>
        </div>
    </Link>
    </>
  )
}

export default EventItem

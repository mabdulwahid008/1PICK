import React, { useContext, useEffect, useState } from 'react'
import './EventDetail2.css'
import { useNavigate, useParams } from 'react-router-dom'
import { Context } from '../../state/Provider'
import { toast } from 'react-toastify'
import Bet from '../../components/bet/Bet'
import { IoIosArrowUp } from 'react-icons/io'
import { BsLink45Deg } from 'react-icons/bs'
import { AiOutlineTwitter } from 'react-icons/ai'
import { minifyAddress, minifyAddress2 } from '../../utills'
import Graph from '../../components/graph/Graph'
import { FiArrowUpRight } from 'react-icons/fi'
import { addHours, format } from 'date-fns';
import Bet2 from '../../components/bet2/Bet2'
import Blockies from 'react-blockies';
import Loader from '../../components/loader/Loader'


function EventDetail2() {
    const { categoryIDforEventFiltering, setCategoryIDforEventFiltering, setPageForEvent, setEvents, setAddress, refresh } = useContext(Context)
    const navigate = useNavigate()

    const { id } = useParams()
    
    const [event, setEvent] = useState(null)
    const [timeline, setTimline] = useState(true)
    const [activity, setActivity] = useState(true)
    const [description, setDescription] = useState(true)
    const [details, setDetails] = useState(true)
    const [comments, setComments] = useState(true)
    const [stats, setStats] = useState(true)
    const [share, setShare] = useState(false)
    
    const addToMyFavourite = async() => {
        const response = await fetch('/event/favourite', {
            method: 'POST',
            headers: {
                'Content-Type' : 'Application/json',
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({event_id: id})
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

    const copyLink = () => {
        // navigator.clipboard.writeText(window.location.href)
        // .then(function() {
        //   toast.success('URL copied to clipboard!');
        // })
        let dummy = document.createElement('input')
        let text = window.location.href;

        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        toast.success('URL copied to clipboard!');
        document.body.removeChild(dummy);
    };
    
    const shareOnTwitter = (url, text)  => {
        const encodedUrl = encodeURIComponent(window.location.href);
        const encodedText = encodeURIComponent("Check this new event.");
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

        window.open(twitterUrl, '_blank');
    }

    const getTimePassedSince = (timestamp) => {
        const currentTime = new Date();
        const inputTime = new Date(timestamp);
        const timeDiff = currentTime - inputTime;
    
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
    
        if (days > 0) {
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else if (hours > 0) {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else if (minutes > 0) {
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else {
            return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
        }
    }
    
    
  
    const getEvent = async() => {
        const response = await fetch(`/event/single/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json'
            }
        })
        const res = await response.json()
        if(response.status === 200){
            const originalDate = new Date(res.e_start);
            const newDate = addHours(originalDate, 24);
            const formattedNewDate = format(newDate, 'yyyy-MM-dd HH:mm');
            res.payout = formattedNewDate
            setEvent(res)
        }
        else if(response.status === 404){
            setEvent([])
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
    },[])

    useEffect(()=>{
        getEvent()
    }, [id, refresh])
    
    return (
        <>
    {event?.length === 0 && <div className='event-not-found'>
        <h2>OOPS!</h2>
        <p>The event has been temporarily suspended due to a failure or has been canceled by rules.</p>
    </div>} 

    {!event && <Loader />}

    {event && event?.length !== 0 && <div className='event-page-2'>
        <Bet2 event_id={event._id} no_bet_percentage={event.no_bet_percentage} yes_bet_percentage={event.yes_bet_percentage} pick={event.pick} d_date={event.e_start.substr(0, 10)} p_date={event.e_end.substr(0,10)}/>
      <div className='event-page-left'>
            <h2>{event.title}</h2>
            <p>
                Created by:
                <a href={`//etherscan.io/address/${event?.creator}`} target='_blank' rel='noopener noreferrer'>
                        <Blockies
                        seed={event.creator} 
                        size={5} 
                        scale={3} 
                        color="#FF385C"
                        bgColor="#00B66D" 
                    />
                    {minifyAddress(event?.creator)}</a>
            </p>
            <div className='event2-metadata'>
                <div>
                    <div>
                        <img src={require('../../assets/eye.png')} />
                        <p>26 Views</p>
                    </div>
                    <div>
                        <img src={require('../../assets/favorite.png')} onClick={addToMyFavourite}/>
                        <img src={require('../../assets/share2.png')} onClick={()=>setShare(prev => !prev)}/>
                        {/* <AiOutlineStar onClick={addToMyFavourite}/>
                        <GoShare onClick={()=>setShare(prev => !prev)}/> */}
                        {share && <div className='e2-share' onClick={()=>setShare(false)}>
                            <div onClick={copyLink}>
                                <BsLink45Deg />
                                <p>Copy Link</p>
                            </div>
                            <div onClick={shareOnTwitter}>
                                <AiOutlineTwitter />
                                <p>Share on Twiter</p>
                            </div>
                        </div>}
                    </div>
                </div>
                <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`} alt='event'/>
            </div> 

            <div className='event2-box'>
                <div className='event2-box-head' onClick={()=>setTimline(prev => !prev)}>
                    <h2>Timeline</h2>
                    <IoIosArrowUp style={{transform: timeline? 'rotate(0deg)' : 'rotate(180deg)'}}/>
                </div>
                {timeline && <div className='timeline'>
                    <div>
                        <p>Event Participation End</p>
                        <p>{event?.e_end.replace('T', ' ')}</p>
                    </div>
                    <div>
                        <p>Event D-Date</p>
                        <p>{event?.e_start.substr(0, 10)}</p>
                    </div>
                    <div>
                        <p>Payout Date</p>
                        <p>{event?.payout.substr(0, 10)}</p>
                    </div>
                </div>}
            </div>


            {/* <div className='bet'>
                <Bet event_id={event._id} no_bet_percentage={event.no_bet_percentage} yes_bet_percentage={event.yes_bet_percentage} pick={event.pick}/>
            </div> */}
            
            <div className='event2-box'>
                <div className='event2-box-head' onClick={()=>setStats(prev => !prev)}>
                    <h2>Stats</h2>
                    <IoIosArrowUp style={{transform: stats? 'rotate(0deg)' : 'rotate(180deg)'}}/>
                </div>
                {stats && <div className='e2-stats'>
                <Graph event_id={id}/>
                </div>}
            </div>

            <div className='event2-box'>
                <div className='event2-box-head' onClick={()=>setActivity(prev => !prev)}>
                    <h2>Activity</h2>
                    <IoIosArrowUp style={{transform: activity? 'rotate(0deg)' : 'rotate(180deg)'}}/>
                </div>
                {activity && <div className='activity'>
                   <table>
                        <tbody>
                            {event?.bettors.map((bet, index)=> {
                                return <tr key={index}>
                                    <td style={{color: bet.is_yes ==1? '#00B66D': '#FF385C'}}>{bet.is_yes == 1? 'YES' : 'NO'}</td>
                                    <td>{bet.bet_amount}P</td>
                                    <td>{minifyAddress(bet.user)}</td>
                                    <td>{getTimePassedSince(bet.created_on)}</td>
                                </tr>
                            })}
                        </tbody>
                   </table>
                </div>}
            </div>
            
            <div className='event2-box'>
                <div className='event2-box-head' onClick={()=>setDescription(prev => !prev)}>
                    <h2>Description</h2>
                    <IoIosArrowUp style={{transform: description? 'rotate(0deg)' : 'rotate(180deg)'}}/>
                </div>
                {description && <div className='event2-description'>
                {event?.description.split(/\n/g).map((line, index)=>{
                   return <div key={index}>
                            <p key={index}>{line}</p><br />
                         </div>
                })}
                </div>}
            </div>
            <div className='event2-box'>
                <div className='event2-box-head' onClick={()=>setDetails(prev => !prev)}>
                    <h2>Details</h2>
                    <IoIosArrowUp style={{transform: details? 'rotate(0deg)' : 'rotate(180deg)'}}/>
                </div>
                {details && <div className='timeline details-box'>
                    <div>
                        <p>IPFS Address</p>
                        <a href={`////ipfs.io/ipfs/${event?.content_cid}`} target='_blank' rel='noopener noreferrer'>{minifyAddress(event?.content_cid)} <FiArrowUpRight /></a>
                    </div>
                    <div>
                        <p>Event ID</p>
                        <a>{id}</a>
                    </div>
                    <div>
                        <p>Resolution URL</p>
                        <a href={`//${event?.resolution_url.replace('https://', '')}`} target='_blank' rel='noopener noreferrer'>{minifyAddress(event?.resolution_url)} <FiArrowUpRight/></a>
                    </div>
                    <div>
                        <p>Creator</p>
                        <a href={`//etherscan.io/address/${event?.creator}`} target='_blank' rel='noopener noreferrer'>{minifyAddress(event?.creator)} <FiArrowUpRight/></a>
                    </div>
                </div>}
            </div>

            <div className='event2-box'>
                <div className='event2-box-head' onClick={()=>setComments(prev => !prev)}>
                    <h2>Comments</h2>
                    <IoIosArrowUp style={{transform: comments? 'rotate(0deg)' : 'rotate(180deg)'}}/>
                </div>
                {comments && <div className='timeline details-box'>
                    <div>
                        <p>IPFS Address</p>
                        <a href={`////ipfs.io/ipfs/${event?.content_cid}`} target='_blank' rel='noopener noreferrer'>{minifyAddress(event?.content_cid)} <FiArrowUpRight /></a>
                    </div>
                    <div>
                        <p>Event ID</p>
                        <a>{id}</a>
                    </div>
                    <div>
                        <p>Resolution URL</p>
                        <a href={`//${event?.resolution_url.replace('https://', '')}`} target='_blank' rel='noopener noreferrer'>{minifyAddress(event?.resolution_url)} <FiArrowUpRight/></a>
                    </div>
                    <div>
                        <p>Creator</p>
                        <a href={`//etherscan.io/address/${event?.creator}`} target='_blank' rel='noopener noreferrer'>{minifyAddress(event?.creator)} <FiArrowUpRight/></a>
                    </div>
                </div>}
            </div>

      </div>
      <div className='event-page-right'>
        <div className='bet'>
            <Bet event_id={event._id} no_bet_percentage={event.no_bet_percentage} yes_bet_percentage={event.yes_bet_percentage} pick={event.pick}/>
        </div>
      </div>
    </div>}
    </>
  )
}

export default EventDetail2

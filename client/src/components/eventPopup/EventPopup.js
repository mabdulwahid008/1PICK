import React, { useContext, useEffect, useState } from 'react'
import './EventPopup.css'
import { Link } from 'react-router-dom'
import { AdminContext } from '../../state/AdminProvider'
import { BiLinkExternal } from 'react-icons/bi'
import { FcCancel } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { minifyAddress2 } from '../../utills'

function EventPopup() {
    const { setEventPopup, eventPopup, setRefresh, setSearchbox } = useContext(AdminContext)

    setSearchbox(false)
    
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(false) 

    const fetchEvent = async() => {
        const response = await fetch(`/event/admin/single/${eventPopup}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
        })
        const res = await response.json()
        if(response.status === 200){
            setEvent(res)
        }
        else if (response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
    }

    const deleteEvent = async() => {
        setLoading(true)
        const confirm = window.confirm('Are you sure deleting this event?')
        if(!confirm){
            setLoading(false)
            return;
        }
        const response = await fetch(`/event/delete/${eventPopup}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setRefresh(state=>!state)
            setEventPopup(false)
        }
        else if (response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    const approveEvent = async() => {
        setLoading(true)
        const confirm = window.confirm('Are you sure approving this event?')
        if(!confirm){
            setLoading(false)
            return;
        }
        const response = await fetch(`/event/approve/${eventPopup}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setRefresh(state=>!state)
            setEventPopup(false)
        }
        else if (response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    const executeEvent = async(is_yes) => {
        setLoading(true)
        const confirm = window.confirm(`Are you sure executing this event as ${is_yes === 1 ? 'YES' : 'NO'}?`)
        if(!confirm){
            setLoading(false)
            return;
        }
        const response = await fetch(`/event/execute`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({event_id: eventPopup, is_yes})
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            setRefresh(state=>!state)
            setEventPopup(false)
        }
        else if (response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }
    
    const deactivateEvent = async() => {
        const response = await fetch(`/event/deactivate/${eventPopup}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            fetchEvent()
            setRefresh(state=>!state)
        }
        else if (response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    const activateEvent = async() => {
        const response = await fetch(`/event/activate/${eventPopup}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            fetchEvent()
            setRefresh(state=>!state)
        }
        else if (response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    const cancelEven = async() => {
        setLoading(true)
        const confirm = window.confirm('Are you sure canceling this event?')
        if(!confirm){
            setLoading(false)
            return;
        }
        const response = await fetch(`/event/admin/cancel/${eventPopup}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            fetchEvent()
            setRefresh(state=>!state)
            setEventPopup(false)
        }
        else if (response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }


    useEffect(()=>{
        fetchEvent()
    }, [])

  return (
    <div className='popup'>
        <div className='overlay' onClick={()=>setEventPopup(null)}></div>
        <div className='event-popup'>
            <div className='event-popup-header'>
                <h2>Event Detail</h2>
                {event && event?.is_active !== -1 && 
                    <> {event?.bet_amount !== 0 && <div>
                        <label class="switch">
                            <input type="checkbox" defaultChecked={event.is_active === 1? true: false} onClick={()=>{if(event.is_active === 1) deactivateEvent(); else activateEvent()}}/>
                            <span class="slider round"></span>
                        </label>
                        {event.is_active === 1 && <FcCancel onClick={cancelEven}/>}
                        {event.is_active === 1 && <Link to={`/event-detail/${event._id}`} target='_blank'><BiLinkExternal /></Link>}
                </div>}
                </>
                }
            </div>
            
            {!event && <div style={{height:200, display:'flex', justifyContent:'center', alignItems:'center'}}>
                <img src={require('../../assets/loading.gif')} style={{width:25, height:25}}/>
            </div>}

           {event && <>
                <div className='admin-event-detail'>
                        {/* <img src={`https://ipfs.io/ipfs/${event.image_cid}`} alt='event'/> */}
                        <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`} alt='event'/>
                        <div>
                            <div>
                                <div className='e-category'>{event.name}</div>
                                <a href={`//etherscan.io/address/${event?.address}`} target='_blank' rel='noopener noreferrer'><div className='e-category'>By: {minifyAddress2(event.address)}</div></a>
                            </div>
                            <h2 className='e-title'>{event.title}</h2>
                            <div>
                                <p>D-Date: {event.e_start.replace('T', ' ')}</p>
                                {event.pick && <p>Pick: {event.pick}</p>}
                            </div>
                        </div>
                </div>

                    <div className='event-about'>
                        {event.description.split(/\n/g).map((line, index)=>{
                            return <>
                                        <p key={index}>{line}</p><br />
                                    </>
                            })}
                    </div>

                    <div className='admin-event-data'>
                        <div>
                            <p>{event.bet_amount}P Vol</p>
                            <p>{event.responses} Responses</p>
                            {event.is_active === -1 && <p>Executed as {event.executed_as === 0 && 'NO'} {event.executed_as === 1 && 'YES'} </p>}
                        </div>
                        <a href={`////ipfs.io/ipfs/${event?.content_cid}`} target='_blank' rel='noopener noreferrer'><div className='e-category' style={{gap:10}}>IPFS: {minifyAddress2(event.content_cid)}</div></a>
                    </div>

                    {event.is_active >= 0 && <>{event.bet_amount == 0 ? <div className='control-btns'>
                        <button onClick={deleteEvent} disabled={loading}>Delete</button>
                        <button onClick={approveEvent} disabled={loading}>Approve</button>
                    </div>
                    :
                    <div className='control-bttns'>
                        <button onClick={() => executeEvent(1)}>Execute as YES<br/> {event.yes_bet_percentage.toFixed(2)}% now</button>
                        <button onClick={() => executeEvent(0)}>Execute as No<br/> {event.no_bet_percentage.toFixed(2)}% now</button>
                    </div>}
                    </>}
                    {event.is_active === -1 && <div className='control-btns'>
                        <button onClick={deleteEvent} disabled={loading} style={{width:'100%'}}>Delete</button>
                    </div>}
            </>}

        </div>
    </div>
  )
}

export default EventPopup

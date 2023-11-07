import React, { useContext, useState } from 'react'
import './GoStopPopup.css'
import { AdminContext } from '../../state/AdminProvider'
import { toast } from 'react-toastify'

function GoStopPopup() {
    const { goStopPopup, setGoStopPopup, setAddress, setRefresh } = useContext(AdminContext)
    const [loading, setLoading] = useState(false)

    const cancelEvent = async() => {
        const confirm = window.confirm("Cancellation refers to refund all bets and cancel the event before D-date. Are you sure cancelling this event.")
        if(!confirm)
            return;
        setLoading(true)
        const response = await fetch(`/event/admin/cancel/${goStopPopup.e_id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setRefresh(state => !state)
            setGoStopPopup(false)
            toast.success(res.message)
        }
        else if(response.status === 401){
            setAddress(null)
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
    setLoading(true)
    }

    const hideEvent = async() => {
        const confirm = window.confirm("Event will be deactivated, no bets, termination and cancellation will be considered. Are you sure?")
        if(!confirm)
            return;
        setLoading(true)
        const response = await fetch(`/event/admin/hide/${goStopPopup.e_id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setRefresh(state => !state)
            setGoStopPopup(false)
            toast.success(res.message)
        }
        else if(response.status === 401){
            setAddress(null)
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
    setLoading(true)
    }

    const activateEvent = async() => {
        const confirm = window.confirm("Are you sure about activating this event?")
        if(!confirm)
            return;
        setLoading(true)
        const response = await fetch(`/event/admin/approve/${goStopPopup.e_id}`,{
            method: 'PATCH',
            headers:{
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setRefresh(state => !state)
            setGoStopPopup(false)
            toast.success(res.message)
        }
        else if(response.status === 401){
            setAddress(null)
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
    setLoading(true)
    }


    


  return (
    <div className='popup'>
      <div className='overlay' onClick={()=>setGoStopPopup(false)}></div>
      <div className='card-popup go-stop'>
        <h4>Change event status</h4>
        <p>Make sure to choose the appropriate status for the event.</p>
        <div className='appeal-btns'>
            {goStopPopup.is_active != 1 ?
            <>
            <button disabled={loading} onClick={activateEvent}>Go</button>
            <button disabled={loading} onClick={cancelEvent}>Cancel</button>
            </>
            :
            <button disabled={loading} onClick={hideEvent}>Stop</button>
            }
        </div>
      </div>
    </div>
  )
}

export default GoStopPopup

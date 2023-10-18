import React, { useContext, useState } from 'react'
import './DecisionPopup.css'
import { Context } from '../../state/Provider'
import { toast } from 'react-toastify'

function DecisionPopup() {
    const { setDecisionPopup, decisionPopup, setAddress, setRefresh } = useContext(Context)
    const [decisionTaken, setDecisionTaken] = useState(false)
    const [loading, setLoading] = useState(false)

    const descision = async(will_exeute_as) => {
      setLoading(true)
      const response = await fetch('/event/decision',{
        method: 'POST',
        headers: {
          'Content-Type': 'Application/json',
          token: sessionStorage.getItem('token')
        },
        body: JSON.stringify({event_id:decisionPopup, will_exeute_as })
      })
      const res = await response.json()
      if(response.status === 200){
        setDecisionTaken(true)
        setRefresh(state => !state)
      }
      else if(response.status === 401){
        setAddress(null)
        setDecisionPopup(false)
      }
      else
        toast.error(res.message)
      
      setLoading(false)
    }

  return (
    <div className='popup'>
    <div className='overlay' onClick={()=>setDecisionPopup(false)}></div>
    <div className='card-popup decision-popup'>
       {!decisionTaken? <>
          <h4>Please select accurately based on actual results.</h4>
            <div className='decision-btns'>
                <button disabled={loading} onClick={()=>descision(1)}>YES</button>
                <button disabled={loading} onClick={()=>descision(0)}>NO</button>
            </div>  
        </>
        :
        <h4>After 72 hours of opinion collection, your decision will be confirmed and concluded.</h4>
        }
    </div>
  </div>
  )
}

export default DecisionPopup

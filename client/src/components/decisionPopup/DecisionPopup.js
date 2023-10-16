import React, { useContext, useState } from 'react'
import './DecisionPopup.css'
import { Context } from '../../state/Provider'

function DecisionPopup() {
    const { setDecisionPopup } = useContext(Context)
    const [decisionTaken, setDecisionTaken] = useState(false)

    const descision = () => {
        setDecisionTaken(true)
    }

  return (
    <div className='popup'>
    <div className='overlay' onClick={()=>setDecisionPopup(false)}></div>
    <div className='card-popup decision-popup'>
       {!decisionTaken? <>
          <h4>Please select accurately based on actual results.</h4>
            <div className='decision-btns'>
                <button onClick={descision}>YES</button>
                <button onClick={descision}>NO</button>
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

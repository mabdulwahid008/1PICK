import React, { useContext } from 'react'
import './CongratsPopup.css'
import { Context } from '../../state/Provider'

function CongratsPopup() {
    const { setCongratsPopup, numbers } = useContext(Context)
  return (
    <div className='popup'>
        <div className='overlay' onClick={()=>setCongratsPopup(false)}></div>
        <div className='card-popup congrats-popup'>
            <div className='popup-header'>
                <img src={require('../../assets/1pick_logo 1.png')} />
                <h3>1PICK<span>AI</span></h3>
            </div>
            <h1>Congratulations sign-up</h1>
            <h3>We will drop you {numbers.welcome}P</h3>
        </div>
    </div>
  )
}

export default CongratsPopup

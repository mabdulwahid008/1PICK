import React, { useContext } from 'react'
import './DepositPopup.css'
import { Context } from '../../state/Provider'
import { Link, useNavigate } from 'react-router-dom'

function DepositPopup() {
    const { setDepositPopup, numbers, address, setmobProfile } = useContext(Context)
    const navigate = useNavigate()

    const onClick = () => {
      localStorage.setItem('depo', 1);
      setDepositPopup(false)
      if(window.innerWidth <= 768 && address){
        setmobProfile(true)
      }
      else
        navigate('/withdraw-deposit')
    }
  return (
    <div className='popup'>
      <div className='overlay' onClick={()=>setDepositPopup(false)}></div>
      <div className='card-popup deposit-popup'>
            <h1>OOPS!</h1>
            <h3>For event creation, you must have {numbers.e_creation} PICKs in your service wallet. </h3>
            <button onClick={onClick}>Deposit</button>
      </div>
    </div>
  )
}

export default DepositPopup
 
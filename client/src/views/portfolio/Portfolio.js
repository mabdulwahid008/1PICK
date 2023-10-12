import React, { useContext } from 'react'
import './Portfolio.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UserParticipatedEvents from '../../components/userParticipatedEvents/UserParticipatedEvents'
import { Context } from '../../state/Provider'
import { toast } from 'react-toastify'
import Usermetadata from '../../components/userMetadata/Usermetadata'


function Portfolio() {
    const { balance, betAmount, numbers, setDepositPopup, address } = useContext(Context)
    const { addres } = useParams()
    const navigate = useNavigate()
  return (
    <div className='portfolio'>
        <div className='portfolio-heading'>
            <h1>My Page</h1>
            <p>Predict everything!</p>
        </div>
        <div className='withdraw-deposit'>
            <div className='balance-pick'>
                <div>
                    <h4>Portfolio</h4> 
                    <h1>{(betAmount)?.toLocaleString()} P</h1>
                </div>
                <div>
                    <h4>Funds</h4>
                    <h1>{(balance)?.toLocaleString()} P</h1>
                </div>
            </div>
            <div className='with-depo'>
                <Link to='/withdraw-deposit' onClick={()=>localStorage.setItem('depo', 0)}>Withdraw</Link>
                <Link to='/withdraw-deposit' onClick={()=>localStorage.setItem('depo', 1)}>Deposit</Link>
            </div>
        </div>
        {/* {window.innerWidth <= 768 && <div className='port-btn'>
            <p>You can create your own events.</p>
            <button onClick={()=>{
                if(balance < numbers.e_creation){
                    setDepositPopup(true)
                }
                else
                    navigate('/create-event')
            }}>Create Event</button>
            <p>1% commission on the event is yours.</p>
        </div>} */}

        <Usermetadata />
        {addres === address && <UserParticipatedEvents />}
    </div>
  )
}

export default Portfolio

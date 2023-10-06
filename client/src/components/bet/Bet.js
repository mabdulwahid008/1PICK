import React, { useContext, useEffect, useState } from 'react'
import './Bet.css'
import { Context } from '../../state/Provider'
import { toast } from 'react-toastify'
import Tooltip from '../toolTip/Tooltip'

function Bet({ event_id, no_bet_percentage, yes_bet_percentage, pick }) {
    const { address, setAddress, setWalletConnectPopup, numbers, setRefresh, balance, setEvents } = useContext(Context)
    const [bet, setBet] = useState(true)
    const [myBett, setMyBet] = useState(0)
    const [loading, setLoading] = useState(false)
    const [bet_amount, setBetAmount] = useState(null)
    const [returns, setReturns] = useState({yes: 0.00, no: 0.00})

    const myBet = async() => {
        const response = await fetch(`/event/my-bet/${event_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setMyBet(res);
        }
        else if(response.status === 401){
            setAddress(null)
        }
        else
            toast.error(res.message)

    }

    const getReturns = async(value) => {
        const response = await fetch(`/event/potential-return/${event_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
            },
            body: JSON.stringify({value: value})
        })
        const res = await response.json()
        if(response.status === 200){
            if(!res.yes){
                res.yes = 0
            }
            if(!res.no){
                res.no = 0
            }
            setReturns(res);
        }
        else
            toast.error(res.message)
    }

    const cancelBet = async() => {
        if(!address){
            toast.error('Please connect your wallet.')
            return
        }
        setLoading(true)

        if(myBett !== 0){
            const check = window.confirm('Do you want to cancel the bet?')
            if(!check){
                setLoading(false)
                return;
            }
        }

        const response = await fetch(`/event/bet/${event_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setEvents([])
            setRefresh((prevState)=> !prevState)
            toast.success(res.message)
            myBet()
        }
        else if(response.status === 401){
             setAddress(null)
             toast.error('Please login, your session has expired.')
         }
         else
             toast.error(res.message)
         setLoading(false)
    }

    const placeBet = async(is_yes) => {
        if(!bet_amount || bet_amount == ''){
            toast.warn('Input amount then click.')
            return;
        }
            
        if(!address){
            toast.error('Please connect your wallet.')
            return
        }

        setLoading(true)
       const response = await fetch('/event/bet',{
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({bet_amount, event_id, is_yes})
       })
       const res = await response.json()
       if(response.status === 200){
            setEvents([])
            setRefresh((prevState)=> !prevState)
            toast.success(res.message)
            setBetAmount(null)
            myBet()
            setReturns({yes: 0.00, no: 0.00})
            document.getElementById('bet-ammount').value = ''
       }
       else if(response.status === 401){
            setAddress(null)
            toast.error('Please login, your session has expired.')
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    useEffect(()=> {
        myBet()
        setReturns({yes: 0.00, no: 0.00})
        setTimeout(()=>{
            if(bet){
                document.getElementById('buy-tab').style.color = '#473BF0';
                document.getElementById('span1').style.display = 'block'
                document.getElementById('sell-tab').style.color = '#000';
                document.getElementById('span2').style.display = 'none'
            }
            else{
                document.getElementById('buy-tab').style.color = '#000';
                document.getElementById('span1').style.display = 'none'
                document.getElementById('sell-tab').style.color = '#473BF0';
                document.getElementById('span2').style.display = 'block'
            }
        }, 0)
    }, [bet])
  return (
    <>
        <div className='bet-head'>
            <div onClick={()=>setBet(true)}>
                <h4 id='buy-tab'>PICK</h4>    
                <span id='span1'></span>
            </div>   
            <div onClick={()=>setBet(false)}>
                <h4 id='sell-tab'>Cancel</h4>    
                <span id='span2'></span>
            </div>   
        </div> 
        <hr />

        <div className='bet-seaction'>
            {bet ? 
            <div>
                {pick && <h2 className='pick-value'>{pick}</h2>}
            <div className='form-group-bet'>
                <label>
                    <span style={{display:'flex', gap:5, alignItems:'center', justifyContent:'center'}}>
                        Amount <Tooltip  text={"After entering a number in Amount, press the YES or NO button.\n You can only bet once on an event.\n Also, you can cancel at any time before the deadline"}/>
                    </span> 
                    <span>MAX: {balance? balance.toLocaleString(): '0.00'}P</span></label>
                <div className='input-div' id='input-div' onClick={()=>document.getElementById('bet-ammount').click()}>
                    <p>P</p>
                    <input type='number' id='bet-ammount' min={1} max={1000} required onChange={(e)=>{
                            const input = e.target.value;
                            const sanitizedInput = input.replace(/[^0-9]/g, ""); 
                            if(e.target.value.startsWith(0)){
                                document.getElementById('bet-ammount').value = ''
                            }
                            if(e.target.value.includes("+") || e.target.value.includes("-") || e.target.value.includes(".") || e.target.value.includes(",")) {
                                return;
                            }
                            if(e.target.value > numbers.max_bet){
                                document.getElementById('bet-ammount').value = numbers.max_bet
                                return;
                            }
                        
                            getReturns(sanitizedInput); 
                            setBetAmount(sanitizedInput)
                        }}/>
                </div>
            </div>
            <div className='bet-btns'>
                <button onClick={()=>placeBet(1)} disabled={loading? true : false}><span>YES</span> <br/> <span>{yes_bet_percentage? yes_bet_percentage.toFixed(1) : 0}% now</span></button>
                <button onClick={()=>placeBet(0)} disabled={loading? true : false}><span>NO</span> <br/> <span>{no_bet_percentage? no_bet_percentage.toFixed(1) : 0}% now</span></button>
            </div>
            <div className='potential'>
                <p>Potential return (with AI)</p>
                <div>
                    <p>Yes: {returns.yes.toFixed(2)}</p>
                    <p>No: {returns.no.toFixed(2)}</p>
                </div>
            </div>
            </div>
            :
            <>
                <div className='cancel-bet'>
                    <div className='input-div-cancel'>
                        <p>P</p>
                        <input type='number' readOnly value={myBett}/>
                    </div>
                    <button onClick={cancelBet} disabled={loading? true : false}>CANCEL</button>
                </div>
            </>
            }
        </div>
    </>
  )
}

export default Bet

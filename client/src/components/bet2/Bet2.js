import React, { useContext, useEffect, useState } from 'react'
import './Bet2.css'
import { Context } from '../../state/Provider'
import { toast } from 'react-toastify'

function Bet2({ event_id, no_bet_percentage, yes_bet_percentage, pick, d_date, p_date }) {
    const { address, setAddress, numbers, setRefresh, balance, setEvents } = useContext(Context)
    // const [bet, setBet] = useState(true)
    const [myBett, setMyBet] = useState(0)
    const [loading, setLoading] = useState(false)
    const [bet_amount, setBetAmount] = useState(null)
    const [returns, setReturns] = useState({ yes: 0.00, no: 0.00 })

    const mybet = async () => {
        if(!address)
            return;
        const response = await fetch(`/event/my-bet/${event_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if (response.status === 200) {
            if(parseInt(res) <= 0){
                document.getElementById('bet-ammount').value = ''
                document.getElementById('bet-ammount').focus = false
            }
            setMyBet(res);
        }
        else if (response.status === 401) {
            setAddress(null)
        }
        else
            toast.error(res.message)

    }

    const getReturns = async (value) => {
        const response = await fetch(`/event/potential-return/${event_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
            },
            body: JSON.stringify({ value: value })
        })
        const res = await response.json()
        if (response.status === 200) {
            if (!res.yes) {
                res.yes = 0
            }
            if (!res.no) {
                res.no = 0
            }
            setReturns(res);
        }
        else
            toast.error(res.message)
    }

    const cancelBet = async () => {
        if (!address) {
            toast.error('Please connect your wallet.')
            return
        }
        setLoading(true)

        if (myBett !== 0) {
            const check = window.confirm('Do you want to cancel the bet?')
            if (!check) {
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
        if (response.status === 200) {
            setEvents([])
            mybet()
            setRefresh((prevState) => !prevState)
            toast.success(res.message)
        }
        else if (response.status === 401) {
            setAddress(null)
            toast.error('Please login, your session has expired.')
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    const placeBet = async (is_yes) => {
        if (!bet_amount || bet_amount == '') {
            toast.warn('Input amount then click.')
            return;
        }

        if (!address) {
            toast.error('Please connect your wallet.')
            return
        }

        setLoading(true)
        const response = await fetch('/event/bet', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({ bet_amount, event_id, is_yes })
        })
        const res = await response.json()
        if (response.status === 200) {
            setEvents([])
            setRefresh((prevState) => !prevState)
            toast.success(res.message)
            setBetAmount(null)
            mybet()
            setReturns({ yes: 0.00, no: 0.00 })
            document.getElementById('bet-ammount').value = ''
        }
        else if (response.status === 401) {
            setAddress(null)
            toast.error('Please login, your session has expired.')
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    useEffect(()=>{
        if(!address)
            setMyBet(0)
        else
            mybet()
    }, [myBett, address])
    useEffect(() => {
        mybet()
        setReturns({ yes: 0.00, no: 0.00 })
    }, [])
    return (
        <div className='bet-2-wrapper'>
            <div className='bet-2'>
                <div>
                    <h2>{pick}</h2>
                    <p>{d_date}</p>
                </div>
                <span></span>
                {myBett == 0 ? <>
                    <div className='place-bet'>
                        <div className='input-div' id='input-div' onClick={() => document.getElementById('bet-ammount').click()}>
                            <p>P</p>
                            <input type='number' id='bet-ammount' min={1} max={1000} required onChange={(e) => {
                                const input = e.target.value;
                                console.log(input);
                                const sanitizedInput = input.replace(/[^0-9]/g, "");
                                if (e.target.value.startsWith(0)) {
                                    document.getElementById('bet-ammount').value = ''
                                }
                                if (e.target.value.includes("+") || e.target.value.includes("-") || e.target.value.includes(".") || e.target.value.includes(",")) {
                                    return;
                                }
                                // if (e.target.value > numbers.max_bet) {
                                //     document.getElementById('bet-ammount').value = numbers.max_bet
                                //     return;
                                // }

                                getReturns(sanitizedInput);
                                setBetAmount(sanitizedInput)
                            }} />
                        </div>
                        <button onClick={() => placeBet(1)} disabled={loading ? true : false}><span>YES</span> <br /> <span>{yes_bet_percentage ? yes_bet_percentage.toFixed(1) : 0}% now</span></button>
                        <button onClick={() => placeBet(0)} disabled={loading ? true : false}><span>NO</span> <br /> <span>{no_bet_percentage ? no_bet_percentage.toFixed(1) : 0}% now</span></button>
                    </div>
                    <div className='potential'>
                        <p>Potential return (with AI)</p>
                        <div>
                            <p>Yes: {returns.yes.toFixed(2)}</p>
                            <p>No: {returns.no.toFixed(2)}</p>
                        </div>
                    </div>
                        </>
                        :
                        <>
                            <div className='cancel-bet'>
                                <div className='input-div-cancel'>
                                    <p>P</p>
                                    <input type='number' readOnly value={myBett}/>
                                </div>
                                <button onClick={cancelBet} disabled={loading? true : false}>CANCEL</button>
                            </div>
                            <p>Cancellation possible until {p_date}</p>
                        </>
                        }
            </div>
        </div>
    )
}

export default Bet2

import React, { useContext, useEffect, useState } from 'react'
import './NumbersSet.css'
import { AdminContext } from '../../state/AdminProvider'
import { toast } from 'react-toastify'
import AdminAnnouncement from '../adminAnnouncement/AdminAnnouncement'

function NumbersSet() {
    const { setNumberPopup } = useContext(AdminContext)
    const [numbers, setNumbers] = useState({welcome : 0, min_bet : 0, max_bet : 0, per_day_event_creation : 0, min_withdraw : 0})

    const fetchNumbers = async() => {
        const response = await fetch(`/stats/numbers`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json'
            }
        })
        const res = await response.json()

        if(response.status === 200){
            setNumbers(res)
        }
        else{
            toast.error(res.message)
        }
    }

    const onChnage = (e) => {
        setNumbers({...numbers, [e.target.name] : e.target.value})
    }

    useEffect(()=>{

    }, [numbers])

    const onSubmit = async(e) => {
        e.preventDefault()
        const response = await fetch(`/stats/numbers`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify(numbers)
        })
        const res = await response.json()

        if(response.status === 200){
            toast.success(res.message)
            setNumberPopup(false)
        }
        else{
            toast.error(res.message)
        }
    }

    useEffect(()=>{
        fetchNumbers()
    }, [])
  return (
    <>
    <AdminAnnouncement />
        <div className='number-set'>
            <h2>Update Service Amounts</h2>
            <form onSubmit={onSubmit}>
                <div className='form-group'>
                    <label>Welcome Amount</label>
                    <input type='number' name='welcome' value={numbers.welcome} required onChange={onChnage}/>
                </div>
                <div className='form-group'>
                    <label>Minimum Bet Amount</label>
                    <input type='number' name='min_bet' value={numbers.min_bet} required onChange={onChnage}/>
                </div>
                <div className='form-group'>
                    <label>Maximum Bet Amount</label>
                    <input type='number' name='max_bet' value={numbers.max_bet} required onChange={onChnage}/>
                </div>
                <div className='form-group'>
                    <label>Daily Events Creation Limit </label>
                    <input type='number' name='per_day_event_creation' value={numbers.per_day_event_creation} required onChange={onChnage}/>
                </div>
                <div className='form-group'>
                    <label>Minimum Withdrawl Amount</label>
                    <input type='number' name='min_withdraw' value={numbers.min_withdraw} required onChange={onChnage}/>
                </div>
                <button>Update</button>
            </form>
        </div>
    </>
  )
}

export default NumbersSet

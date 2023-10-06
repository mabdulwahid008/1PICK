import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../state/AdminProvider'
import './UserDetailPopup.css'
import { toast } from 'react-toastify'
import { minifyAddress2 } from '../../utills'

function UserDetailPopup() {
    const { setUserPopup, userPopup, setRefresh } = useContext(AdminContext)

    const [tranfer, setTransfer] = useState(false)
    const [user, setUser] = useState(false)
    const [balance, setBalance] = useState(null)
    const [loading, setLoading] = useState(false)


    const fetchUser = async() => {
        const response = await fetch(`/user/single/${userPopup}`,{
            method:'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setUser(res)
        }
        else if(response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
    }

    const transferBalance = async(e) => {
        e.preventDefault()

        const response = await fetch(`/user/transfer-balance`,{
            method:'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({balance, user_id: userPopup})
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            fetchUser()
            document.getElementById('input-balance').value = ''
            setTransfer(false)
            setRefresh((state) => !state)
        }
        else if(response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
    }

    const activateUser = async() => {
        setLoading(true)
        const response = await fetch(`/user/activate/${userPopup}`,{
            method:'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            fetchUser()
            setRefresh((state) => !state)
        }
        else if(response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }

    const deactivateUser = async() => {
        setLoading(true)
        const response = await fetch(`/user/deactivate/${userPopup}`,{
            method:'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            toast.success(res.message)
            fetchUser()
            setRefresh((state) => !state)
        }
        else if(response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
        setLoading(false)
    }


    useEffect(()=>{
        fetchUser()
    }, [])
  return (
    <div className='popup'>
        <div className='overlay' onClick={()=>setUserPopup(null)}></div>
        <div className='user-popup'>
            <div className='user-popup-header'>
                <h2>User Detail</h2>
                {user && <div>
                    <label class="switch">
                        <input type="checkbox" disabled={loading} defaultChecked={user.is_active? true: false} onChange={()=>{if(user.is_active == 1) deactivateUser(); else activateUser()}}/>
                        <span class="slider round"></span>
                    </label>
                </div>}
            </div>

            {!user && <img src={require('../../assets/loading.gif')}/>}

           {user && <>
            <div className='user-detail'>
                    <div>
                        <p>User Address</p>
                        <p>{minifyAddress2(user?.address)}</p>
                    </div>
                    <div>
                        <p>Participated Events</p>
                        <p>{user.paricipatedEvents}</p>
                    </div>
                    <div>
                        <p>Created Events</p>
                        <p>{user.createdEvents}</p>
                    </div>
                    <div>
                        <p>Bet Amount</p>
                        <p>{user.bet_amount}P</p>
                    </div>
                    <div>
                        <p>Balance</p>
                        <p>{user.balance}P</p>
                    </div>
                    <div>
                        <p>Lost Amount</p>
                        <p>{user.lost_amount}P</p>
                    </div>
                    <div>
                        <p>Earned Amount</p>
                        <p>{user.earned_amount}P</p>
                    </div>
                    <div>
                        <p>Withdrawn Amount</p>
                        <p>{user.withdrawn_amount}P</p>
                    </div>
                    <div>
                        <p>Deposit Amount</p>
                        <p>{user.deposited_amount}P</p>
                    </div>
            </div>

            <p onClick={()=>setTransfer((state)=>!state)}>Transfer Balance</p>

            <div className='tranfer-balance' style={{display:`${tranfer? 'block': 'none'}`}}>
                <form onSubmit={transferBalance}>
                    <div className='form-group'>
                        <label>Enter Amount</label>
                        <input id='input-balance' type='number' required onChange={(e)=>setBalance(e.target.value)}/>
                    </div>
                    <button>Transfer</button>
                </form>
            </div>
            </>}
        </div>
    </div>
  )
}

export default UserDetailPopup

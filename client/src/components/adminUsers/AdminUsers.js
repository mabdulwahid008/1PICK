import React, { useContext, useEffect, useState } from 'react'
import './AdminUsers.css'
import { toast } from 'react-toastify'
import { minifyAddress } from '../../utills'
import { BsThreeDots } from 'react-icons/bs'
import { PiCopy } from 'react-icons/pi'
import { AdminContext } from '../../state/AdminProvider'

function AdminUsers() {
    const { setUserPopup, refresh } = useContext(AdminContext)
    const [users, setUsers] = useState(null)

    const fetchUsers = async() => {
        const response = await fetch('/user/lisiting',{
            method:'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setUsers(res)
        }
        else if(response.status === 401){
            toast.error('Please login, your session has expired.')
            sessionStorage.clear()
            window.location.reload(true)
        }
        else
            toast.error(res.message)
    }

    useEffect(()=>{
        fetchUsers()
    }, [refresh])
  return (
    <div className='user-table-wrapper'>
    <div className='users-table'>
        <table>
            <thead>
                <tr>
                    <th style={{width:'2%'}}>#</th>
                    <th style={{width:'15%'}}>User Address</th>
                    <th style={{width:'15%'}}>Signup Date</th>
                    <th style={{width:'15%'}}>Active</th>
                    <th style={{width:'10%'}}>Bet Amount</th>
                    <th style={{width:'10%'}}>Cash</th>
                    <th style={{width:'5%'}}>View</th>
                </tr>
            </thead>
            <tbody>
                {!users && <img src={require('../../assets/loading.gif')}/>}
                {users?.length === 0 && <p>No User yet.</p>}
                {users?.length !== 0 && users?.map((user, index) => {
                    return <tr key={index}>
                            <td style={{width:'2%'}}>{index+1}</td>
                            <td style={{width:'15%'}}>{minifyAddress(user.address)} <img src={require('../../assets/copy.png')} onClick={()=>{navigator.clipboard.writeText(user.address); toast.success('Address copied.')}}/></td>
                            <td style={{width:'15%'}}>{user.created_on.substr(0,16).replace('T', ' ')}</td>
                            <td style={{width:'15%'}}><span style={{backgroundColor: `${user.is_active == 1 ? '#00B66D' : '#FF385C' }`}}></span>{user.is_active == 1 ? 'Active' : 'Deactive'}</td>
                            <td style={{width:'10%'}}>{user.bet_amount}P</td>
                            <td style={{width:'10%'}}>{user.balance}P</td>
                            <td style={{width:'5%'}}>
                                <BsThreeDots onClick={()=>setUserPopup(user._id)}/>
                            </td>
                        </tr>
                })}
            </tbody>
        </table>
    </div>
    </div>
  )
}

export default AdminUsers

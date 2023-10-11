import React, { useContext, useEffect, useState } from 'react'
import './AdminUsers.css'
import { toast } from 'react-toastify'
import { minifyAddress } from '../../utills'
import { BsThreeDots } from 'react-icons/bs'
import { PiCopy } from 'react-icons/pi'
import { AdminContext } from '../../state/AdminProvider'
import { BiLinkExternal } from 'react-icons/bi'

function AdminUsers() {
    const { setUserPopup, refresh } = useContext(AdminContext)
    const [users, setUsers] = useState(null)

    const [filteredUsers, setFilteredUsers] = useState(0)
    let [searchAddress, setSearchAddress] = useState('x')

    const fetchUsers = async() => {
        if(searchAddress.length !== 42){
            return
        }
        
        setUsers(null)
        const response = await fetch(`/user/lisiting/${filteredUsers}/${searchAddress}`,{
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
    }, [refresh, filteredUsers, searchAddress])
  return (
    <div className='user-table-wrapper'>
        <div className='search-user'>
            <input type='text'placeholder='Search user' onChange={(e) => setSearchAddress(e.target.value)}/>
            <button><img src={require('../../assets/download.png')}/></button>
        </div> 
    <div className='users-table'>
        <table>
            <thead>
                <tr>
                    <th >#</th>
                    <th >Address</th>
                    <th >Bet <img src={require('../../assets/sort.png')} onClick={()=>{setFilteredUsers(1)}}/></th>
                    <th >Funds <img src={require('../../assets/sort.png')} onClick={()=>{setFilteredUsers(2)}}/></th>
                    <th >Score <img src={require('../../assets/sort.png')} onClick={()=>{setFilteredUsers(3)}}/></th>
                </tr>
            </thead>
            <tbody>
                {!users && <img src={require('../../assets/loading.gif')}/>}
                {users?.length === 0 && <p>No User yet.</p>}
                {users?.length !== 0 && users?.map((user, index) => {
                    return <tr key={index}>
                            <td >{index+1}</td>
                            <td >{minifyAddress(user.address)} <BiLinkExternal onClick={()=>{setUserPopup(user._id)}}/></td>
                            <td >{user.bet_amount}P</td>
                            <td>{user.balance}P</td>
                            <td>{"Score"}</td>
                        </tr>
                })}
            </tbody>
        </table>
    </div>
    </div>
  )
}

export default AdminUsers

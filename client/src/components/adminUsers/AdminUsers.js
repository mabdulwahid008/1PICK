import React, { useContext, useEffect, useState } from 'react'
import './AdminUsers.css'
import { toast } from 'react-toastify'
import { minifyAddress } from '../../utills'
import { BsThreeDots } from 'react-icons/bs'
import { PiCopy } from 'react-icons/pi'
import { AdminContext } from '../../state/AdminProvider'
import { BiLinkExternal } from 'react-icons/bi'
import { Link } from 'react-router-dom'

function AdminUsers() {
    const { setUserPopup, refresh } = useContext(AdminContext)
    const [users, setUsers] = useState(null)

    const [filteredUsers, setFilteredUsers] = useState(0)

    const search = (e) => {
        if(e.target.value.length === 42){
            setUsers(null)
            fetchUsers(e.target.value)
        }
        else
            fetchUsers('x')
    }

    const fetchUsers = async(searchAddress) => { 
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

    const downloadXlsx = async() => {
        const response = await fetch('/file/users', {
            method:'GET',
        })

    }
    

    useEffect(()=>{
        setUsers(null)
        fetchUsers('x')
    }, [refresh, filteredUsers])
  return (
    <div className='user-table-wrapper'>
        <div className='search-user'>
            <input type='text'placeholder='Search user' onChange={search}/>
            <Link to='/file/users' target='_blank'><img src={require('../../assets/download.png')} onClick={downloadXlsx}/></Link>
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
                            <td>{user.balance.toFixed(0)}P</td>
                            <td>{user.score}</td>
                        </tr>
                })}
            </tbody>
        </table>
    </div>
    </div>
  )
}

export default AdminUsers

import React, { useContext, useEffect, useState } from 'react'
import './AdminStats.css'
import { toast } from 'react-toastify'
import { AdminContext } from '../../state/AdminProvider'
import { LuUsers } from 'react-icons/lu'
import { AiOutlineEye } from 'react-icons/ai'
import { FaWallet } from 'react-icons/fa'
import { BsGraphUpArrow } from 'react-icons/bs'

function AdminDashboardStats() {
  const { refresh } = useContext(AdminContext)
  const [stats, setStats] = useState(null)

  const fetchStats = async() => {
    const responses = await fetch('/stats/dashboard/cards', {
      method: 'GET',
      headers: {
          'Content-Type' : 'Application/json',
          token: sessionStorage.getItem('token')
      }
    })
    const res = await responses.json()
    if(responses.status === 200){
        setStats(res)
    }
    else if (responses.status === 401){
        toast.error('Please login, your session has expired.')
        sessionStorage.clear()
        window.location.reload(true)
    }
    else{
        toast.error(res.message)
    }
  }
  
  useEffect(()=>{
    fetchStats()
  }, [refresh])
  return (
    <div className='admin-stats' id='overview'>
      <h1>Checkout Overview</h1>
      <p>Your wallet is entirely non-custodial and only you have access to the key</p>
      <div>
            <div className='stats-card'>
                <AiOutlineEye />
                <p>Site Visitor</p>
                <h3>{stats?.vistors? stats?.vistors.toLocaleString(): 0}</h3>
            </div>
            <div className='stats-card'>
                <LuUsers />
                <p>Members</p>
                <h3>{stats?.total_users? stats?.total_users.toLocaleString() : 0}</h3>
            </div>
            <div className='stats-card'>
                <span><BsGraphUpArrow /></span>
                <p>Bet Amount</p>
                <h3>{stats?.bet_amount? stats?.bet_amount.toLocaleString(): 0}</h3>
            </div>
            <div className='stats-card'>
                <span><FaWallet /></span>
                <p>User Amount</p>
                <h3>{stats?.user_amount? stats?.user_amount.toLocaleString() : 0}</h3>
            </div>
      </div>
    </div>
  )
}

export default AdminDashboardStats

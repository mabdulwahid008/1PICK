import React, { useContext, useEffect, useState } from 'react'
import './AdminStats.css'
import { toast } from 'react-toastify'
import { AdminContext } from '../../state/AdminProvider'
import { TbUsersPlus, TbUserShield } from 'react-icons/tb'
import { LuUsers } from 'react-icons/lu'
import { RiUserStarLine } from 'react-icons/ri'

function AdminMemberStats() {
  const { refresh } = useContext(AdminContext)
  const [stats, setStats] = useState(null)

  const fetchStats = async() => {
    const responses = await fetch('/stats/member/cards', {
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
      <h1>Members Overview</h1>
      <p>Your wallet is entirely non-custodial and only you have access to the key</p>
      <div>
          <div>
              <div className='stats-card'>
                  <TbUsersPlus />
                  <p>Registered Today</p>
                  <h3>{stats?.new_registered? stats?.new_registered.toLocaleString(): 0}</h3>
              </div>
              <div className='stats-card'>
                  <LuUsers />
                  <p>Total Members</p>
                  <h3>{stats?.total_users? stats?.total_users.toLocaleString() : 0}</h3>
              </div>
          </div>
          <div>
              <div className='stats-card'>
                  <TbUserShield />
                  <p>Active Members</p>
                  <h3>{stats?.active_users? stats?.active_users.toLocaleString(): 0}</h3>
              </div>
              <div className='stats-card'>
                  <RiUserStarLine />
                  <p>Event Creators</p>
                  <h3>{stats?.creators? stats?.creators.toLocaleString() : 0}</h3>
              </div>
          </div>
      </div>
    </div>
  )
}


export default AdminMemberStats

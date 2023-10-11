import React, { useEffect } from 'react'
import './AdminMembers..css'
import AdminUsers from '../../components/adminUsers/AdminUsers'
import AdminMemberStats from '../../components/adminStats/AdminMemberStats'

function AdminMembers() {

    useEffect(()=>{
        window.scrollTo(0,0)
      }, [])

  return (
    <div className='admin-members'>
        {/* <AdminMemberStats /> */}
        <div className='admin-stats' id='admin-stats'>
            <h1>Member Details</h1>
            <p>Your wallet is entirely non-custodial and only you have access to the key</p>
        </div>
        <AdminUsers/>
    </div>
  )
}

export default AdminMembers

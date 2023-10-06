import React, { useContext, useState } from 'react'
import './AdminSideBar.css'
import { Link } from 'react-router-dom'
import { BiHomeAlt } from 'react-icons/bi'
import { PiUserLight } from 'react-icons/pi'
import { GiNetworkBars } from 'react-icons/gi'
import { AiOutlineUnlock } from 'react-icons/ai'
import { TfiViewGrid } from 'react-icons/tfi'
import MobSidebarBtns from '../mobSidebarBtns/MobSidebarBtns'
import { AdminContext } from '../../state/AdminProvider'

function AdminSideBar() {
  const { setmobOpenSideBar } = useContext(AdminContext)
    const [state, setState] = useState(0)
  return (
    <div className='admin-sidebar'> 
      <div className='admin-logo'>
            <img src={require('../../assets/1pick_logo 1.png')} alt='logo'/>
            <h3>1PICK<span>AI</span></h3>
      </div>
      <ul className='admin-nav'>
        <li>
            <Link to='/admin/dashboard/#overview' onClick={()=>{setState(0); setmobOpenSideBar(false)}} className={`${state === 0 ? 'active' : ''}`}>
                <BiHomeAlt />
                Overview
            </Link>
            <Link to='/admin/dashboard/#traffic'  onClick={()=>{setState(1); setmobOpenSideBar(false)} } className={`${state === 1 ? 'active' : ''}`}>
                <GiNetworkBars />
                Traffic
            </Link>
            <Link to='/admin/members'  onClick={()=>{setState(2); setmobOpenSideBar(false)}} className={`${state === 2 ? 'active' : ''}`}>
                <PiUserLight />
                Member
            </Link>
            <Link to='/admin/dashboard/#events'  onClick={()=>{setState(3); setmobOpenSideBar(false)}} className={`${state === 3 ? 'active' : ''}`}>
                <TfiViewGrid />
                Events
            </Link>
            <Link to='/admin/category'  onClick={()=>{setState(4); setmobOpenSideBar(false)}} className={`${state === 4 ? 'active' : ''}`}>
                <AiOutlineUnlock />
                Category
            </Link>
        </li>
      </ul>
      <div>
         <MobSidebarBtns />
      </div>
      <button className='log-out-btn' onClick={()=>{sessionStorage.clear(); window.location.reload(true)}}><img src={require('../../assets/logout.PNG')} />Logout</button>
    </div>
  )
}

export default AdminSideBar

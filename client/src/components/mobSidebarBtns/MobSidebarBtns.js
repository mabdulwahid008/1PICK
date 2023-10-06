import React, { useContext } from 'react'
import './MobSidebarBtns.css'
import { Link } from 'react-router-dom'
import { Context } from '../../state/Provider'
import { AdminContext } from '../../state/AdminProvider'

function MobSidebarBtns() {
    const { setmobOpenSideBar, balance, numbers } = useContext(window.location.pathname.startsWith('/admin')? AdminContext :Context)
  return (
    <div className='mob-sidebar-btns'>
          <Link to='/portfolio' target={window.location.pathname.startsWith('/admin')? '_blank': ''}><button onClick={()=>setmobOpenSideBar(false)}>My Page</button></Link>
          {window.location.pathname.startsWith('/admin')?
          <Link to='/create-event' target={window.location.pathname.startsWith('/admin') && '_blank'}><button onClick={()=>setmobOpenSideBar(false)}>Create</button></Link>
          :
          <>
          {balance >= numbers.e_creation && <Link to='/create-event'><button onClick={()=>setmobOpenSideBar(false)}>Create</button></Link>}
          </>
          }
    </div>
  )
}

export default MobSidebarBtns

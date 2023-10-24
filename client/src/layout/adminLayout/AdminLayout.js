import React, { useContext } from 'react'
import './AdminLayout.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import AdminSideBar from '../../components/adminSideBar/AdminSideBar'
import AdminNavbar from '../../components/adminNavbar/AdminNavbar'
import AdminDashboard from '../../views/adminDashboard/AdminDashboard'
import EventPopup from '../../components/eventPopup/EventPopup'
import { AdminContext } from '../../state/AdminProvider'
import AdminMembers from '../../views/adminMembers/AdminMembers'
import UserDetailPopup from '../../components/userDetailPopup/UserDetailPopup'
import CategoryPage from '../../views/categoryPage/CategoryPage'
import NumbersSet from '../../components/numbersSet/NumbersSet'
import AdminDashboardStats from '../../components/adminStats/AdminDashboardStats'
import AdminGraph from '../../components/adminGraph/AdminGraph'
import AdminEvents from '../../views/adminEvents/AdminEvents'
import GoStopPopup from '../../components/goStop/GoStopPopup'


function AdminLayout() {
  const { eventPopup, userPopup, goStopPopup, numberPopup, setSearchbox, setmobOpenSideBar } = useContext(AdminContext)


  return (
    <>
      <div className='admin-layout'>
        <div className='admin-sidebar-wrapper' onClick={()=>setSearchbox(false)}>
          <AdminSideBar />
        </div>
        <div className='admin-content'>
          <AdminNavbar />
          <div onClick={()=>{setSearchbox(false); setmobOpenSideBar(false)}}>
            {/* <Routes>
              <Route path='/admin' element={<Navigate to='/admin/dashboard' />} />
              <Route path='/admin/dashboard' element={<AdminDashboard />} />
              <Route path='/admin/members' element={<AdminMembers/>} />
              <Route path='/admin/category' element={<CategoryPage/>} />
              <Route path='*' element={<Navigate to='/admin' />}/>
            </Routes> */}
            <Routes>
              <Route path='/admin' element={<Navigate to='/admin/dashboard' />} />
              <Route path='/admin/dashboard' element={<AdminDashboardStats />} />
              <Route path='/admin/members' element={<AdminMembers/>} />
              <Route path='/admin/category' element={<CategoryPage/>} />
              <Route path='/admin/traffic' element={<AdminGraph/>} />
              <Route path='/admin/events' element={<AdminEvents/>} />
              <Route path='*' element={<Navigate to='/admin' />}/>
            </Routes>
          </div>
        </div>
        {eventPopup && <EventPopup />}
        {userPopup && <UserDetailPopup />}
        {numberPopup && <NumbersSet />}
        {goStopPopup && <GoStopPopup />}
      </div>
    </>
  )
}

export default AdminLayout

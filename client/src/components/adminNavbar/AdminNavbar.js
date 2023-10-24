import React, { useContext, useEffect, useRef, useState } from 'react'
import { AdminContext } from '../../state/AdminProvider'
import './AdminNavbar.css'
import { BsArrowDownCircle, BsBell } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import AdminSearchItem from '../adminSearchItem/AdminSearchItem'
import { getEventsAPI } from '../../utills/apiRequest'
import { toast } from 'react-toastify'
import MobSidebarHeader from '../mobSidebarHeader/MobSidebarHeader'
import AdminSideBar from '../adminSideBar/AdminSideBar'
import { AiOutlineSetting } from 'react-icons/ai'

function AdminNavbar() {
  const { betAmount, balance, setEventPopup, searchbox, setSearchbox, mobOpenSideBar, setmobOpenSideBar, mobSearchBox, setMobSearchBox, setNumberPopup } = useContext(AdminContext)

  const [notificationOpen, setNotificationOpen] = useState(false)
  const [trendingEvents, setTrendingEvents] = useState(null)
  const [searchEvents, setSearchEvents] = useState(null)
  const [searchBoxText, setSearchBoxText] = useState('Trending')
  const [notificationItem, setNotificationItem] = useState(null)
  const [notificationCount, setNotificationCount] = useState(0)

  const inputRef = useRef()
  useEffect(() => {
    if (mobSearchBox) {
      inputRef.current.focus();
    }
  }, [mobSearchBox])

  
  const gettrendingEvents = async() => {
    const { response, res } = await getEventsAPI(1, 0, 0 , '1,2,3')
    if(response.status === 200){
      setTrendingEvents(res.events)
      setSearchEvents(res.events)
    }
    else{
      toast.error(res.message)
    }
  }

  const handleOnChangeSearch = async(e) => {
    if(e.target.value.length === 0){
      setSearchBoxText('Trending')
      setSearchEvents(trendingEvents)
      return; 
    }
    setSearchEvents(null)

    const response = await fetch(`/event/admin/search/${e.target.value}`,{
      method: 'GET',
      headers:{
        'Content-Type': 'Application/json'
      }
    })

    const res = await response.json()
    if(response.status === 200){
      setSearchEvents(res)
    }
    else{
      console.error(res.message);
      setSearchEvents([])
    }
    setSearchBoxText('Result')
  } 
 
  // const notification = async() => {
  //   const response = await fetch(`/stats/notification`,{
  //     method: 'GET',
  //     headers:{
  //       'Content-Type': 'Application/json'
  //     }
  //   })

  //   const res = await response.json()
  //   if(response.status === 200){
  //     setNotificationItem(res.events)
  //     setNotificationCount(res.need_approval)
  //   }
  //   else{
  //     toast.error(res.message);
  //   }
  // }

  useEffect(()=> {
    gettrendingEvents()

    // setInterval(()=>notification(), 1000)

  }, [])

  return (
    
    <>
    <div className='admin-navbar-wrapper'>
      <div className='admin-navbar'>
        <div className='admin-search-bar' onClick={()=>setSearchbox(true)}>
            <img src={require('../../assets/search_grey.png')} alt='search'/>
            <input type='text' placeholder='Search...' onChange={handleOnChangeSearch}/>

            {searchbox && <div className='admin-search-b0x'>
              <div className='admin-search-wrapper'>
                <h2>{searchBoxText}</h2>
                {!searchEvents && <img src={require('../../assets/loading.gif')} alt='loading'/>}
                {searchEvents?.length === 0 && <p>No events found.</p>}
                {searchEvents?.map((event, index)=>{
                      if(index > 3)
                        return
                      return <AdminSearchItem key={index} event={event}/>
                    })}
              </div>
            </div>
}
        </div>
        <div className='account' onClick={()=>setSearchbox(false)}>
            <div> 
                <p>{(betAmount)?.toLocaleString()}P</p>
                <p>Portfolio</p> 
            </div>
            <div>
                <p>{(balance)?.toLocaleString()}P</p>
                <p>Funds</p>
            </div> 
            <div>
            <Link to='/create-event' target='_blank'><button>Create</button></Link>
            </div>
            <span></span>
            <div>
              <AiOutlineSetting  onClick={()=>setNumberPopup(true)}/>
            </div>
            <div>
              {notificationCount !== 0 && <span>{notificationCount}</span>}
              <BsBell onClick={()=>setNotificationOpen(state=>!state)}/>
            </div>
        </div>
            <div className='notification-wrapper' style={{ top: notificationOpen? '80px': '-400px', opacity: notificationOpen? 1 : 0}}>
                <h2>Notification</h2>
                <div>
               {notificationItem?.map((event, index) => {
                return <div className='notification' key={index} style={{backgroundColor: event.needapproval? '#F4F4F4' : '#fff'}} onClick={()=>{setNotificationOpen(false); setEventPopup(event._id)}}>
                            {/* <img src={`https://ipfs.io/ipfs/${event.image_cid}`} alt='event'/> */}
                            <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`} alt='event'/>
                            <div>
                                <h1>{event.title}</h1>
                                <p>Expires on {event.e_end}</p>
                            </div>
                        </div>})}
                </div>
            </div>
      </div>
    </div>


    {/* Navbar Mobile */}
    <div className='navabr-wrapper'>
    <div className='navbar-mobile'>
            {/* <img src={require('../../assets/Vector.png')} alt='toggle'  onClick={()=>setmobOpenSideBar(true)}/>
            <div className='sidebar-mob' style={{left: mobOpenSideBar? '0px': '-300px'}}>
                <MobSidebarHeader />
                <AdminSideBar />
            </div> */}

        {/* <Link to='/admin/dashboard/#overview' className='logo'>
            <img src={require('../../assets/1pick_logo 1.png')} alt='logo'/>
            <h1>1PICK<span>AI</span></h1> 
        </Link> */}

          {/* <img src={require('../../assets/search_grey.png')} alt='seaarch' onClick={()=>setMobSearchBox(true)}/>
          <div className='search-mob'  style={{top: mobSearchBox? '-10px': '-2010px'}}>
            <div>
                  <div className='search-bar' onSubmit={(e)=>e.preventDefault()}>
                      <input type='text' ref={inputRef} placeholder='Search' id='search-bar' onChange={handleOnChangeSearch} />
                      <button className='search-btn'>
                          <img src={require('../../assets/search.png')} alt='search'/>
                      </button>
                  </div>
                  <div onClick={()=>setMobSearchBox(false)}>
                      <h3>{searchBoxText}</h3>
                      {!searchEvents && <img src={require('../../assets/loading.gif')} alt='loading'/>}
                      {searchEvents?.length === 0 && <p>No events found.</p>}
                      {searchEvents?.map((event, index)=>{
                          if(index > 4)
                            return
                          return <AdminSearchItem key={index} event={event}/>
                        })}
                    </div>
                </div>

        </div> */}

        <Link to='/admin/dashboard'> <img src={require('../../assets/overview.png')}/></Link>
        <Link to='/admin/traffic'> <img src={require('../../assets/monitoring.png')}/></Link>
        <Link to='/admin/members'> <img src={require('../../assets/person.png')}/></Link>
        <Link to='/admin/events'> <img src={require('../../assets/event_list.png')}/></Link>
        <Link to='/admin/category'> <img src={require('../../assets/category.png')}/></Link>
        <Link to='/admin/setting'> <img src={require('../../assets/setting.png')}/></Link>
      </div>
      </div>
    </>
  )
}

export default AdminNavbar

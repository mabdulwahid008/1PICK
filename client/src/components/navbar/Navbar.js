import React, { useContext, useEffect, useRef, useState } from 'react'
import './Navbar.css'
import WalletConnect from '../walletConnect/WalletConnect'
import { Link } from 'react-router-dom'
import { Context } from '../../state/Provider'
import Sidebar from '../sidebar/Sidebar'
import SearchEventItem from '../searchEventItem/SearchEventItem'
import MobSidebarHeader from '../mobSidebarHeader/MobSidebarHeader'
import MobSidebarBtns from '../mobSidebarBtns/MobSidebarBtns'
import { BsArrowDownCircle, BsSearch } from 'react-icons/bs';
import { BiMessageSquare } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { PiSuitcaseSimpleDuotone } from 'react-icons/pi';
import { GrCheckbox } from 'react-icons/gr';
import { getEventsAPI } from '../../utills/apiRequest'
import { toast } from 'react-toastify'
import { ConnectWallet } from '@thirdweb-dev/react'
import AnnouncementBar from '../announcementBar/AnnouncementBar'

function Navbar() {
  const { openSideBar, address, setOpenSideBar, searchBox, setSearchBox, setmobProfile, walletAddress, mobOpenSideBar, setmobOpenSideBar, mobSearchBox, setMobSearchBox } = useContext(Context)
 
  const [trendingEvents, setTrendingEvents] = useState(null)
  const [searchEvents, setSearchEvents] = useState(null)
  const [searchBoxText, setSearchBoxText] = useState('Trending')
  const [searchText, setSearchText] = useState(0)

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

  const inputRef = useRef()




  const handleOnChangeSearch = async(e) => {
    setSearchText(e.target.value.length);
    await new Promise((r) => setTimeout(r, 500))
    if(e.target.value.length === 0){
      setSearchBoxText('Trending')
      setSearchEvents(trendingEvents)
      return; 
    }
    setSearchEvents(null)

    const response = await fetch(`/event/search/${e.target.value}`,{
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

  useEffect(()=>{
    if(inputRef.current.value.length == 0 ){
      setSearchBoxText('Trending')
      setSearchEvents(trendingEvents)
    }
  }, [searchText])

  useEffect(()=> {}, [searchEvents, address])

  useEffect(() => {
    if (mobSearchBox) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }, [mobSearchBox])


  useEffect(()=>{
      setSearchEvents(trendingEvents)
      setSearchBoxText('Trending')
      if(inputRef.current.value == ''){
        setSearchEvents(trendingEvents)
        setSearchBoxText('Trending')
      }
  }, [mobSearchBox])

  useEffect(()=> {
    gettrendingEvents()

  }, [])

  return ( 
    <div className='navabr-wrapper'>
      {/* Navbar PC  */}
      <div className='navbar'>

            <div onClick={()=>setSearchBox(false)}>
                <img src={require('../../assets/Vector.png')} alt='toggle' className='toggle-button' onClick={()=>setOpenSideBar(!openSideBar)}/>
                <Link to='/' className='logo'>
                    <img src={require('../../assets/1pick_logo 1.png')} alt='logo'/>
                    <h1 >1PICK<span>AI</span></h1>
                </Link>
            </div>

            <form className='search-bar' onSubmit={(e)=>e.preventDefault()}>
                <input type='text' placeholder='Search' id='search-bar' onChange={handleOnChangeSearch} onClick={()=>setSearchBox(true)}/>
                <button className='search-btn'>
                    <img src={require('../../assets/search.png')} alt='search'/>
                </button>
                {searchBox && <div className='search-items'>
                  <div>
                    <h3>{searchBoxText}</h3>
                    {!searchEvents && <img src={require('../../assets/loading.gif')} alt='loading'/>}
                    {searchEvents?.length === 0 && <p>No events found.</p>}
                    {searchEvents?.map((event, index)=>{
                      if(index > 3)
                        return
                      return <SearchEventItem key={index} event={event}/>
                    })}
                  </div>
                </div>}
            </form>

            <WalletConnect />
      </div>
      
      <AnnouncementBar />
      <div className='mobile-nav'>
       <Link to='/' className='logo'  onClick={()=>setmobOpenSideBar(true)}>
            <img src={require('../../assets/1pick-logo-200200.png')} alt='logo'/>
            <h1>1PICK<span>AI</span></h1> 
        </Link>
        
        <div className='mobile-nav-icon'>
        <Link to='/users-ranking'><img src={require('../../assets/trophy.png')} style={{marginRight:-5}}/></Link>
            <img src={require('../../assets/search_FILL0_wght400_GRAD0_opsz24.png')} onClick={()=>setMobSearchBox(true)}/>
            <div className='search-mob'  style={{top: mobSearchBox? '-10px': '-2010px'}}>
                <div>
                    <img src={require('../../assets/arr_back.png')} onClick={()=>setMobSearchBox(false)}/>
                    <div className='search-bar' onSubmit={(e)=>e.preventDefault()}>
                          <input type='text' ref={inputRef} placeholder='Search' id='search-bar' onChange={handleOnChangeSearch} onClick={()=>setSearchBox(true)}/>
                          <button className='search-btn'>
                              <img src={require('../../assets/search.png')} alt='search'/>
                          </button>
                      </div> 
                      <div onClick={()=>setMobSearchBox(false)} className='mob-search-items'>
                        <h3>{searchBoxText}</h3>
                        {!searchEvents && <img src={require('../../assets/loading.gif')} alt='loading'/>}
                        {searchEvents?.length === 0 && <p>No events found.</p>}
                        {searchEvents?.map((event, index)=>{
                            if(index > 4)
                              return
                            return <SearchEventItem key={index} event={event}/>
                          })}
                      </div>
                </div>
             </div>
            {address && walletAddress ? 
              <>
              <Link to='/create-event'><img src={require('../../assets/edit_square_FILL0_wght400_GRAD0_opsz24.png')} /></Link>
              <Link to={`/portfolio/${address}`}><img src={require('../../assets/event_note_FILL0_wght400_GRAD0_opsz24.png')} /></Link>
              <img src={require('../../assets/face_5_FILL0_wght400_GRAD0_opsz24.png')} className='cg-profile' onClick={()=>{setmobProfile(true)}}/>
              </>
              :
              <ConnectWallet className="third-web-btn" theme='light' btnTitle="Connect" detailsBtn={()=> {return}}/>
            }
        </div>
    </div>

      {/* Navbar Mobile */}
      {/* <div className='navbar-mobile'>
            <img src={require('../../assets/Vector.png')} alt='toggle'  onClick={()=>setmobOpenSideBar(true)}/>
            <div className='sidebar-mob' style={{left: mobOpenSideBar? '0px': '-300px'}}>
                <MobSidebarHeader/>
                <Sidebar />
                {address && <MobSidebarBtns />}
            </div>

        <Link to='/' className='logo'>
            <img src={require('../../assets/1pick_logo 1.png')} alt='logo'/>
            <h1>1PICK<span>AI</span></h1> 
        </Link>

          <img src={require('../../assets/search_grey.png')} alt='seaarch' onClick={()=>setMobSearchBox(true)}/>
          <div className='search-mob'  style={{top: mobSearchBox? '-10px': '-2010px'}} onClick={()=>setMobSearchBox(false)}>
            <div>
                <div className='search-bar' onSubmit={(e)=>e.preventDefault()}>
                      <input type='gsearch' placeholder='Search' id='search-bar' onChange={handleOnChangeSearch} onClick={()=>setSearchBox(true)}/>
                      <button className='search-btn'>
                          <img src={require('../../assets/search.png')} alt='search'/>
                      </button>
                  </div>
                  <h3>{searchBoxText}</h3>
                  {!searchEvents && <img src={require('../../assets/loading.gif')} alt='loading'/>}
                  {searchEvents?.length === 0 && <p>No events found.</p>}
                  {searchEvents?.map((event, index)=>{
                      if(index > 4)
                        return
                      return <SearchEventItem key={index} event={event}/>
                    })}
  
                    <BsArrowDownCircle onClick={()=> setMobSearchBox(false)}/>
            </div>
          </div>
      </div> */}
    </div>
  )
}

export default Navbar

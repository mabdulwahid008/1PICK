import React, { useContext, useEffect } from 'react'
import './UserLaout.css'
import { Context } from '../../state/Provider'
import Sidebar from '../../components/sidebar/Sidebar'
import Home from '../../views/home/Home'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import CreateEvent from '../../components/createEvent/CreateEvent'
import Portfolio from '../../views/portfolio/Portfolio'
import With_Depo from '../../views/with-depo/With_Depo'
import EventDetail from '../../views/eventDetail/EventDetail'
import EventDetail2 from '../../views/eventDetail2/EventDetail2'
import Navbar from '../../components/navbar/Navbar'
import Footer from '../../components/footer/Footer'
import WalletConnectPopup from '../../components/walletConnectPopup/WalletConnectPopup'
import DepositPopup from '../../components/depositPopup/DepositPopup'
import CongratsPopup from '../../components/congratsPopup/CongratsPopup'
import MobProfile from '../../components/mobProfile/MobProfile'
import UsersRanking from '../../views/usersRanking/UsersRanking'
import DecisionPopup from '../../components/decisionPopup/DecisionPopup'

function UserLaout() {
    const { openSideBar, setOpenSideBar, setSearchBox, mobProfile, setmobOpenSideBar, decisionPopup, setMobSearchBox, walletConnectPopup, depositPopup, congratsPopup } = useContext(Context)
    const location = useLocation()

    window.onpopstate = function(event) {
        setSearchBox(false); 
        setmobOpenSideBar(false)
        setMobSearchBox(false);
      };

    const vistor = async() => {
        const alreadyVisited = localStorage.getItem('visited')
        if(alreadyVisited)
            return;
        const response  = await fetch('/stats',{
            method:'POST',
            headers: {
                'Content-Type':'Application/json'
            }
        })
        const res = await response.json()
        if(response.status !== 200)
            console.error('Visitor', res.message);
        
        localStorage.setItem('visited', true)
    }

    useEffect(()=>{
        if(location.pathname !== '/')
            setOpenSideBar(false)
        else
            setOpenSideBar(true)

        vistor()
    }, [location])
  return (
    <>
        <Navbar />
        <div className='userlaout' onClick={()=>{setSearchBox(false); setmobOpenSideBar(false); setMobSearchBox(false)}}>
            <div className='side-bar' style={{width:`${openSideBar? '224px': '0px'}`}}>
                <Sidebar />
            </div>
            <div className='content' id='content' style={{width:`${openSideBar? '100%-224px': '100%'}`}}>
                <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path='/create-event' element={<CreateEvent />}/>
                    <Route path='/portfolio/:addres' element={<Portfolio />}/>
                    <Route path='/withdraw-deposit' element={<With_Depo />}/>
                    <Route path='/user/:addres' element={<Portfolio />}/>
                    <Route path='users-ranking' element={<UsersRanking/>} />
                    <Route path='/event-detail/:id' element={<EventDetail2 />}/>
                    <Route path='*' element={<Navigate to='/'/>}/>
                </Routes>
            </div>
        </div>
        <Footer />

        {/* {walletConnectPopup && <WalletConnectPopup />} */}
        {depositPopup && <DepositPopup />}
        {congratsPopup && <CongratsPopup />}
        {mobProfile && <MobProfile />}
        {decisionPopup && <DecisionPopup />}
    </>
  )
}

export default UserLaout

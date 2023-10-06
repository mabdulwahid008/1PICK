import React, { useContext } from 'react'
import './MobSidebarHeader.css'
import { Context } from '../../state/Provider'
import { Link } from 'react-router-dom'
import { AdminContext } from '../../state/AdminProvider'

function MobSidebarHeader() {
    const { address, setWalletConnectPopup, balance, betAmount, setmobOpenSideBar, pickBalance } = useContext(window.location.pathname.startsWith('/admin')? AdminContext :Context)
    
    return (
    <div className='mob-sidebar-header'>
        <Link to='/' target={window.location.pathname.startsWith('/admin') && '_blank'} className='logo mob-logo' onClick={()=>setmobOpenSideBar(false)}>
            <img src={require('../../assets/1pick_logo 1.png')} alt='logo'/>
            <h1>1PICK</h1>
        </Link> 
        {/* {address ? <div className='account mob-account'>
             <div>
                 <p>{(betAmount).toLocaleString()}P</p>
                 <p>Portfolio</p>
             </div>
             <div>
                 <p>{(balance).toLocaleString()}P</p>
                 <p>Funds</p>
             </div>
             <span onClick={()=>{sessionStorage.clear(); window.location.pathname = '/'}}>
               <div>
                   <p>{address.substr(0, 9)}</p>
                   <p>{parseInt(pickBalance).toLocaleString()}P</p>
               </div>
               <div>
                   <img src={require('../../assets/wallet_white.png')} alt='wallet'/>
               </div>
             </span>
         </div>
        :
        <button className='connect-wallet mob-connect-wallet' onClick={()=>{setWalletConnectPopup(true); setmobOpenSideBar(false)}}>
            <img src={require('../../assets/wallet.png')} alt='wallet'/>
            <h3>Connect wallet</h3>
            <span>|</span>
            <img src={require('../../assets/profile.png')} alt='profile' />
        </button>} */}

   </div>

  )
}

export default MobSidebarHeader

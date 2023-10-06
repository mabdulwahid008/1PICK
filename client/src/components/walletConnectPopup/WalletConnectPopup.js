import React, { useContext } from 'react'
import './WalletConnectPopup.css'
import { Context } from '../../state/Provider'

function WalletConnectPopup() {
    const { setWalletConnectPopup, connectWallet, loading } = useContext(Context)
  return (
    <div className='popup'>
      <div className='overlay' onClick={()=>{if(loading) return; setWalletConnectPopup(false)}}></div>
      <div className='card-popup'>
        <div>
            <div className='popup-header'>
                <img src={require('../../assets/1pick_logo 1.png')} />
                <h3>1PICK<span>AI</span></h3>
            </div>
            <p>Connect Your Wallet</p>
            <div className='metamask-icon'>
                <img src={require('../../assets/metamask.png')} onClick={()=>{if(loading) return; connectWallet()}}/>
            </div>
            {loading && <img src={require('../../assets/loading.gif')} />}
            <a href='//1pick.gitbook.io/home/terms-and-policy/privacy-policy' onClick={()=>setWalletConnectPopup(false)}>Privacy Policy</a>
        </div>
      </div>
    </div>
  ) 
}

export default WalletConnectPopup

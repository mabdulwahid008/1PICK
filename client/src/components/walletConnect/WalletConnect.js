import React, { useContext } from 'react'
import './WalletConnect.css'
import { Context } from '../../state/Provider'
import { Link } from 'react-router-dom'
import { ConnectWallet } from '@thirdweb-dev/react'
function WalletConnect() {
  const { setWalletConnectPopup, logOut, address, numbers, balance, betAmount, setSearchBox, pickBalance } = useContext(Context)
  return (
    <div className='account-wrapper' onClick={()=>setSearchBox(false)}>
      {address ? <div className='account'>
        <div>
            <p>{(betAmount)?.toLocaleString()}P</p>
            <p>Portfolio</p> 
        </div>
        <div>
            <p>{(balance)?.toLocaleString()}P</p>
            <p>Funds</p>
        </div>
        <div>
          <Link to='/portfolio'><button>My Page</button></Link>
          {balance >= numbers.e_creation && <Link to='/create-event'><button>Create</button></Link>}
        </div>
        <span onClick={()=>{logOut()}}>
          <div>
              <p>{address.substr(0, 12)}</p>
              <p>{Math.round(pickBalance).toLocaleString()}P</p>
          </div>
          <div>
              <img src={require('../../assets/wallet_white.png')} alt='wallet'/>
          </div>
        </span>
      </div>
      :
      <ConnectWallet className='custome-waller-connet-btn' theme='light' detailsBtn={()=> {
       return;
      }}/>
      // <button className='connect-wallet' onClick={()=>setWalletConnectPopup(true)}>
      //   <img src={require('../../assets/wallet.png')} alt='wallet'/>
      //   <h3>Connect wallet</h3>
      //   <span>|</span>
      //   <img src={require('../../assets/profile.png')} alt='profile' />
      // </button>
      }
    </div>
  )
}

export default WalletConnect

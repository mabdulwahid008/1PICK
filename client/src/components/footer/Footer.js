import React, { useContext } from 'react'
import './Footer.css'
import { FaTelegramPlane } from 'react-icons/fa'
import { BsTwitter } from 'react-icons/bs'
import { PICK_TOKEN_CONTRACT_ADDRESS } from '../../constants'
import { toast } from 'react-toastify'

function Footer() {

  const register = async() => {


      const tokenAddress = '0x1250c8f5099902ddfb574474612436b0b5Db0a15';
      const tokenSymbol = 'PICK';
      const tokenDecimals = 18;
      const tokenImage = 'https://1pick.xyz/logo.png';

        try {
          // wasAdded is a boolean. Like any RPC method, an error may be thrown.
          const wasAdded = await window.ethereum?.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC20', // Initially only supports ERC20, but eventually more!
              options: {
                address: tokenAddress, // The address that the token is at.
                symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                decimals: tokenDecimals, // The number of decimals in the token
                image: tokenImage, // A string url of the token logo
              },
            },
          });

          if (wasAdded) {
            console.log('Thanks for your interest!');
          } else {
            console.log('Your loss!');
          }
        } catch (error) {
          console.log(error);
    }

  }

  
  return (
    <div className='footer'>
      <div className='footer-top'> 
 
         <div>
            <div className='f-logo'>
                 <img src={require('../../assets/1pick_logo 1.png')}/>
                 <h3>1PICK</h3>
            </div>
            <div className='powered-by'>
                <a href='https://etherscan.io/token/0x1250c8f5099902ddfb574474612436b0b5Db0a15' target='_blank'>
                    {/* <img src={require('../../assets/eth.png')} alt='UMA'/> */}
                    <h4>0x1250c8f5099902ddfb574474612436b0b5Db0a15</h4>
                </a>
            </div>
         </div>

         <div className='mobile-stuff'>
              <div>
                <a href="https://etherscan.io/token/0x1250c8f5099902ddfb574474612436b0b5Db0a15"><h4 style={{fontSize: 12}}>0x1250c8f5099902ddfb574474612436b0b5Db0a15</h4></a>
                {/* <a href="https://etherscan.io/token/0x1250c8f5099902ddfb574474612436b0b5Db0a15"><h3>Pick Token Address</h3></a> */}
                {/* <img src={require('../../assets/copy.png')} onClick={()=>{         
                      let dummy = document.createElement('input')
                      let text = "0x1250c8f5099902ddfb574474612436b0b5Db0a15";    
                      document.body.appendChild(dummy);
                      dummy.value = text;
                      dummy.select();
                      document.execCommand('copy');
                      toast.success('Address copied to clipboard!');
                      document.body.removeChild(dummy);
                }}/> */}
              </div>
                
              <a href="https://vittominacori.github.io/watch-token/page/?hash=0x7b2261646472657373223a22307831323530633866353039393930326464666235373434373436313234333662306235446230613135222c226c6f676f223a22227d&network=mainnet" target="_blank">
                <h3>Register Token to Wallet</h3>
              </a>
                
                <a  target='_blank' href="https://app.uniswap.org/#/swap?exactField=output&exactAmount=1000000&outputCurrency=0x1250c8f5099902ddfb574474612436b0b5Db0a15&inputCurrency=ETH" >Buy Token</a>
                <hr />
         </div>

         <div className='marketplace'>
            <h3>Marketplace</h3>
            <nav>
              <a href='//1pick.gitbook.io/home/service-guide/how-it-works' target='_blank'>How it works</a>
              <a href='//1pick.gitbook.io/home/information/faqs' target='_blank'>FAQs</a>
              <a href='//1pick.gitbook.io/home/overview/roadmap' target='_blank'>Roadmap</a>
              <a href='//1pick.gitbook.io/home/overview/contact' target='_blank'>Contact</a>
              {window.innerWidth <= 768 &&<>
                <a href='//1pick.gitbook.io/home/terms-and-policy/privacy-policy' target='_blank'>Privacy Policy</a>
                <a href='//1pick.gitbook.io/home/terms-and-policy/terms-of-service' target='_blank'>Terms Of Service</a>
              </>}
            </nav>
         </div>

         <div className='join-community'>
            <h3>Join the community</h3>
            <div>
              <a href='https://twitter.com/1PICK_xyz'><BsTwitter /></a>
              <a href='https://t.me/pick1xyz'><FaTelegramPlane /></a>
            </div>
         </div>
      </div>

      <div className='footer-bottom'>
        <hr />
        <div className='f-bottom'>
            <div>
              <p>B1 lnc. @{new Date().getFullYear()}</p>
            </div>
            <div>
              <a href='//1pick.gitbook.io/home/terms-and-policy/privacy-policy' target='_blank'>Privacy Policy</a>
              <a href='//1pick.gitbook.io/home/terms-and-policy/terms-of-service' target='_blank'>Terms Of Service</a>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

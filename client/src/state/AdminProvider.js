import React, { createContext, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { Contract, providers, utils } from 'ethers'
import { verifyToken } from '../utills/apiRequest'
import { PICK_TOKEN_CONTRACT_ABI, PICK_TOKEN_CONTRACT_ADDRESS } from '../constants'
import { useAddress, useContract } from '@thirdweb-dev/react'


export const AdminContext = createContext()

function AdminProvider(props) {

    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState(null)
    const [signer, setSigner] = useState(null)
    const [balance, setBalance] = useState(null)
    const [betAmount, setBetAmount] = useState(null)

    
    const [pickBalance, setPickBalance] = useState(0)

    const [eventPopup, setEventPopup] = useState(null)
    const [userPopup, setUserPopup] = useState(false)
    const [searchbox, setSearchbox] = useState(false)
    const [numberPopup, setNumberPopup] = useState(false)

    const [refresh, setRefresh] = useState(false)

    const [mobOpenSideBar, setmobOpenSideBar] = useState(false)
    const [mobSearchBox, setMobSearchBox] = useState(false)

    const walletAddress = useAddress()
    const { contract } = useContract(PICK_TOKEN_CONTRACT_ADDRESS, PICK_TOKEN_CONTRACT_ABI)

     // for token verification
    const tokenVerification = async(token) => {
      const { response , res } = await verifyToken(token)
      if(response.status === 200){
        setBalance(res.balance)
        setBetAmount(res.betting_ammount)
        setAddress(res.address)
      }
      else {
          sessionStorage.clear()
          window.location.reload(true)
        }
    }

    const getPickBalance = async() => {
      try {
        const balanace = await contract.call(`balanceOf`, [walletAddress])
        setPickBalance(utils.formatEther(balanace))
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(()=>{
      if(walletAddress){
        getPickBalance()
        setAddress(walletAddress)
      }
    }, [walletAddress])

    useEffect(()=>{
      const token = sessionStorage.getItem('token')
        if(token)
          tokenVerification(token)
        if(walletAddress){
          getPickBalance()
        }
    }, [refresh, address])


    const contextValues = {
        loading,
        address,
        setAddress,
        betAmount,
        balance,
        eventPopup, 
        setEventPopup,
        userPopup, 
        setUserPopup,
        refresh,
        setRefresh,
        searchbox, 
        setSearchbox, 
        pickBalance,
        numberPopup, setNumberPopup,
        mobOpenSideBar, setmobOpenSideBar, mobSearchBox, setMobSearchBox
    }

    useEffect(()=>{
      const token = sessionStorage.getItem('token')
        if(token)
          tokenVerification(token)
    }, [refresh])

  return (
    <AdminContext.Provider value={contextValues}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminProvider

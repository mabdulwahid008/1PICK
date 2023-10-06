import React, { createContext, useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import { Contract, ethers, providers, utils } from 'ethers'
import { getEventsAPI, loginAPI, verifyToken } from '../utills/apiRequest'
import { toast } from 'react-toastify'
import { PICK_TOKEN_CONTRACT_ABI, PICK_TOKEN_CONTRACT_ADDRESS, PICK_WITHDRAW_CONTRACT_ABI, PICK_WITHDRAW_CONTRACT_ADDRESS } from '../constants'
import { metamaskWallet, useAddress, useChainId, useConnect, useContract, useContractRead, useDisconnect, useNetwork, walletConnect } from '@thirdweb-dev/react'



export const Context = createContext()

function Provider(props) {
    
    const [openSideBar, setOpenSideBar] = useState(true)
    const [mobOpenSideBar, setmobOpenSideBar] = useState(false)
    const [searchBox, setSearchBox] = useState(false)
    const [mobSearchBox, setMobSearchBox] = useState(false)
    const [walletConnectPopup, setWalletConnectPopup] = useState(false)
    const [depositPopup, setDepositPopup] = useState(false)
    const [congratsPopup, setCongratsPopup] = useState(false)
    
    const [mobProfile, setmobProfile] = useState(false)
    
    
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState(null)
    const [balance, setBalance] = useState(null)
    const [betAmount, setBetAmount] = useState(null)

    const [pickBalance, setPickBalance] = useState(0)

    
    const [events, setEvents] = useState(null)
    const [numbers, setNumbers] = useState({welcome : 0, min_bet : 0, max_bet : 0, e_creation : 0, min_withdraw : 0})
    const [toatalEvents, setTotalEvents] = useState(0)
    const [categoryIDforEventFiltering, setCategoryIDforEventFiltering] = useState(0)
    const [pageForEvent, setPageForEvent] = useState(1)
    const [sidetop, setSidetop] = useState(0)
    const [userTypeEvents, setUserTypeEvents] = useState('1,2,3,')


    const [refresh, setRefresh] = useState(false)
  
    const walletAddress = useAddress()
    const disconnect = useDisconnect()
    const { contract } = useContract(PICK_TOKEN_CONTRACT_ADDRESS, PICK_TOKEN_CONTRACT_ABI)

    const login = async() => {
      if(!walletAddress){
          setAddress(null)
          return;
        }
        const { response, res } = await loginAPI(walletAddress)
        if(response.status === 200){
              sessionStorage.setItem('token', res.token)
              setBalance(res.balance)
              setBetAmount(res.betting_ammount)
              setAddress(walletAddress)
            }
          else{
            disconnect()
            toast.error(res.message)
            setWalletConnectPopup(false)
            return;
          }

          if(res.newUser){
            setCongratsPopup(true)
          }
    }

    const fetchNumbers = async() => {
      const response = await fetch('/stats/numbers', {
        method:'GET',
        headers: {
          'Content-Type': 'Application/json'
        }
      })
      const res = await response.json()
      if(response.status === 200){
        setNumbers(res);

      }
    }
    const logOut = async() => {
      sessionStorage.clear()
      disconnect()
    }

    const tokenVerification = async(token) => {
      const { response , res } = await verifyToken(token)
      if(response.status === 200){
        setBalance(res.balance)
        setBetAmount(res.betting_ammount)
        setAddress(res.address)
      }
      else{
        disconnect()
        setAddress(null)
      }
        return;
    }

    const getPickBalance = async() => {
      try {
        const balanace = await contract.call(`balanceOf`, [walletAddress])
        setPickBalance(utils.formatEther(balanace))
      } catch (error) {
        console.error(error);
      }
    }

    const fetchEvents = async() => {
      const { response, res } = await getEventsAPI(pageForEvent, categoryIDforEventFiltering, sidetop, userTypeEvents)
      if(response.status === 200){
        setTotalEvents(res.totalEvents)
        setEvents(res.events)
      }
      else
        toast.error(res.message)
    }

    useEffect(()=>{
      const token = sessionStorage.getItem('token')
        if(token)
          tokenVerification(token)
        if(walletAddress){
          getPickBalance()
        }
    }, [refresh, address])

    const chain = useChainId()
    const [{ data, error }, switchNetwork] = useNetwork();
    const Change = async() => {
      try {
        if(chain !== 1)
            await switchNetwork(1)
      } catch (error) {
        console.log("here");
        disconnect()
        sessionStorage.clear()
        setAddress(null)
      }
    }

    useEffect(()=>{
      Change()
      if(chain && chain !== 1){
        disconnect()
        alert('Change network to mainnet.')
      }
      else{
        login()
        if(walletAddress){
          getPickBalance()
        }
      }
    }, [walletAddress, chain])

  
    useEffect(()=>{
      fetchNumbers()
      fetchEvents()
    }, [refresh, pageForEvent, categoryIDforEventFiltering, sidetop, userTypeEvents])


        

    const contextValues = {
        walletConnectPopup, 
        walletAddress,
        setWalletConnectPopup,
        logOut,
        loading,
        openSideBar, 
        setOpenSideBar,
        address,
        events,
        searchBox, 
        setSearchBox,
        mobOpenSideBar, 
        setmobOpenSideBar,
        depositPopup, 
        setDepositPopup,
        mobSearchBox, 
        setMobSearchBox,
        balance, 
        betAmount,
        setAddress,
        refresh,
        setRefresh,
        toatalEvents,
        setPageForEvent,
        categoryIDforEventFiltering,
        setCategoryIDforEventFiltering,
        setEvents, 
        sidetop, 
        setSidetop,
        userTypeEvents, 
        setUserTypeEvents,
        congratsPopup, 
        setCongratsPopup,
        pickBalance,
        numbers,
        mobProfile, setmobProfile
    }

  return (
    <Context.Provider value={contextValues}>
      {props.children}
    </Context.Provider>
  )
}

export default Provider

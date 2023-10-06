import React, { useContext, useEffect, useRef, useState } from 'react'
import './MobProfile.css'
import { Context } from '../../state/Provider'
import { useContract, useContractRead, useDisconnect } from '@thirdweb-dev/react'
import { BiLogIn } from 'react-icons/bi'
import { minifyAddress } from '../../utills'
import Blockies from 'react-blockies';
import { toast } from 'react-toastify'
import { Contract, utils, providers } from 'ethers'
import { PICK_TOKEN_CONTRACT_ABI, PICK_TOKEN_CONTRACT_ADDRESS, PICK_WITHDRAW_CONTRACT_ABI, PICK_WITHDRAW_CONTRACT_ADDRESS } from '../../constants'
import Web3Modal from 'web3modal'
 

function MobProfile() {
    const disconnect = useDisconnect()
    const { setmobProfile, address, numbers, setRefresh, setAddress, betAmount, pickBalance, balance } = useContext(Context)
  
    const [state, setState] = useState(0)
    const [loading, setLoading] = useState(false)
    const [amount, setAmount] = useState('')
    const [calulatedFee, setCalulatedFee] = useState(0.00)
    const [transferFee, setTranseferFee] = useState(0)

    const withDrawContract = useContract(PICK_WITHDRAW_CONTRACT_ADDRESS, PICK_WITHDRAW_CONTRACT_ABI)

    const {data} = useContractRead(withDrawContract?.contract, "fee")

    const tokenContract = useContract(PICK_TOKEN_CONTRACT_ADDRESS, PICK_TOKEN_CONTRACT_ABI)

    const deposit = async() => {
      const { contract } = tokenContract
      try {
        const userbalance = await contract.call('balanceOf', [address])
        if(parseInt(utils.formatEther(userbalance)) < parseInt(amount)){
            toast.error('Insufficient funds.')
            return;
        }
        const tx = await contract.call('transfer', [PICK_WITHDRAW_CONTRACT_ADDRESS, utils.parseEther(amount)])
   
        const response = await fetch('/user/deposit',{
            method: 'PATCH',
            headers:{
              'Content-Type': 'Application/json',
              token: sessionStorage.getItem('token')
            },
            body: JSON.stringify({deposit_amount: amount})
          })

          const res = await response.json()
          if(response.status === 200){
            toast.success(res.message)
            setAmount('')
            setCalulatedFee(0.00)
          }
          else{
            toast.error(res.message)
          }
          
          setRefresh(state => !state)
        
      } catch (error) {
        toast.error("Check your funds and balance, and try again")
        console.log(error);
      }
    }

    const onChange = (e) => {
      const input = e.target.value;
      const sanitizedInput = input.replace(/[^0-9]/g, ""); 
  
        if(e.target.value.includes("+") || e.target.value.includes("-") || e.target.value.includes(".") || e.target.value.includes(",")) {
          return;
        }
        setAmount(sanitizedInput)
        let fee = transferFee * parseInt(e.target.value);
        setCalulatedFee(fee)
    }

    const withDraw = async() => {
      try {

        const { contract } = withDrawContract
        const fee = await contract.call('fee')

        await contract.call('withdraw', [amount], {value:  fee.mul(amount)})

        const response = await fetch('/user/withdraw',{
          method: 'PATCH',
          headers:{
            'Content-Type': 'Application/json',
            token: sessionStorage.getItem('token')
          },
          body: JSON.stringify({withdraw_amount: amount})
        })

        const res = await response.json()
        if(response.status === 200){
          toast.success(res.message)
          setAmount('')
          setCalulatedFee(0.00)
        }
        else{
          toast.error(res.message)
        }

        setRefresh(state => !state)
       
      } catch (error) {
        toast.error("Check your funds and balance, and try again")
        console.log(error);
      }
    }

    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        setRefresh(state => !state) // it is to check the user has not expired token

        if(amount <= 0){
          toast.error("Amount should be greater than 0.")
          setLoading(false)
          return;
        }

        if(state === 0 && balance < amount){
            toast.error('Insufficient funds.')
            setLoading(false)
            return;
        }
        else if(state === 0 && amount < numbers.min_withdraw){
            toast.error(`Minimum withdrawal amount is ${numbers.min_withdraw}P.`)
            setLoading(false)
            return;
          }
        else if(state === 0 && amount >= numbers.min_withdraw){
            await withDraw()
          }
        else if(state === 1){
          await deposit()
        }
        else{

        }
    
        setLoading(false)
    }

    const getFee = async() => {
      if(data)
      setTranseferFee(utils.formatEther(data))
        // const { contract } = withDrawContract
        // try {
        //     const x = await contract?.call('fee')
        //     setTranseferFee(utils.formatEther(x))
        // } catch (error) {
        //     console.log(error);
        // }
    }

    useEffect(()=>{
      setInterval(() => {
        if(transferFee === 0)
            getFee()
    }, 500);
    }, [data])

    useEffect(()=>{
      setAmount('')
      setCalulatedFee(0.00)
    }, [state])
  
    return (
    <div className='modal'>
        <div className='overlay' onClick={()=>setmobProfile(false)}></div>
      
      <div className='modal-body'>
        <div className='modal-head'>
            <div>
            <Blockies
                seed={address} 
                size={14} 
                scale={3} 
                color="#FF385C"
                bgColor="#00B66D" 
            />
                <div>
                    <h2>{minifyAddress(address)}</h2>
                    <p>{parseInt(pickBalance).toLocaleString()} P</p>
                </div>
            </div> 

            <img src={require('../../assets/log.png')} onClick={()=>{
                disconnect();
                sessionStorage.clear()
                setAddress(null)
                setmobProfile(false)
            }}/>
        </div>
        <div className='user-balances'>
            <p>Funds</p>
            <p>{balance.toLocaleString()}P</p>
        </div>
        <div className='user-balances'>
            <p>Portfolio</p>
            <p>{(betAmount).toLocaleString()}P</p>
        </div>

        <div className='depo-with depo-with-profile'>
            <div className='box'>
                <div className='dep-with-btn'>
                    <button onClick={()=>setState(1)} className={state === 1 ? 'with-depo-activa' : ''}>Deposit</button>
                    <button onClick={()=>setState(0)} className={state === 0 ? 'with-depo-activa' : ''}>Withdraw</button>
                </div>

                <form onSubmit={onSubmit}>
                    <div>
                        {state === 0 ?
                         <label><span>Withdraw Amount</span> <span>MAX {balance? balance.toLocaleString() : 0.00}P </span></label> 
                        :
                        <label><span>Deposit Amount</span> <span>{parseInt(pickBalance).toFixed(0)}P MAX</span></label>}
                        <div className='ammmount'id='with-amount'>
                          <p>P</p>
                          <input id='amount-transfer' value={amount} type='text' required onChange={onChange}/>
                        </div>
                       {state === 0 && <p>Transfer fee : {calulatedFee? calulatedFee.toFixed(8) : 0.00} ETH</p>}
                    </div>
                    <button className='approve-btn' disabled={loading? true: false}>{loading? <img  src={require('../../assets/loading.gif')}/> : 'Approve'}</button>
                </form>
            </div>
        </div>

      </div>
    </div>
  )
}

export default MobProfile

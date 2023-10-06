import React, { useContext, useEffect, useRef, useState } from 'react'
import './With_Depo.css'
import { Context } from '../../state/Provider'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Contract, utils, providers } from 'ethers'
import { PICK_TOKEN_CONTRACT_ABI, PICK_TOKEN_CONTRACT_ADDRESS, PICK_WITHDRAW_CONTRACT_ABI, PICK_WITHDRAW_CONTRACT_ADDRESS } from '../../constants'
import Web3Modal from 'web3modal'
import { useContract, useContractRead } from '@thirdweb-dev/react'




function With_Depo() {
  const  { address, balance, betAmount, setRefresh, pickBalance, numbers } = useContext(Context)
  const depo = localStorage.getItem('depo')
  const [state, setState] = useState(depo == 0 ? 0 : 1)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [calulatedFee, setCalulatedFee] = useState(0.00)
  const [transferFee, setTranseferFee] = useState(0)
  
  const withDrawContract = useContract(PICK_WITHDRAW_CONTRACT_ADDRESS, PICK_WITHDRAW_CONTRACT_ABI)
  const tokenContract = useContract(PICK_TOKEN_CONTRACT_ADDRESS, PICK_TOKEN_CONTRACT_ABI)

    const {data} = useContractRead(withDrawContract?.contract, "fee")

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
        setLoading(false)
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

        const tx = await contract.call('withdraw', [amount], {value:  fee.mul(amount)})
        if(!tx){
          setLoading(false)
          return;
        }

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
        setLoading(false)
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

    const navigate = useNavigate()
    
    useEffect(()=>{
      if(!address){
        toast.error('Please login, your session has expired.')
        sessionStorage.clear()
        navigate('/')
      }

      setTimeout(()=>{
        if(window.location.pathname === '/withdraw-deposit'){
            setAmount('')
            setCalulatedFee(0.00)
      }
      }, 100)
    }, [state])

  return (
    <div className='with-dep'>
      <div className='with-dep-head'>
        <div className='portfolio-heading'>
                <h1>Deposit / Withdraw</h1>
                <p>Your wallet is entirely non-custodial and only you have access to the key</p>
        </div>
        <div className='user-balance'> 
            <h4>Total Balance</h4>
            <h1>{balance? (parseInt(balance.toFixed(0)) + parseInt(betAmount.toFixed(0))).toLocaleString() : 0.00} P</h1>
        </div>
      </div>

      <div className='depo-with'>
            <div className='box'>
                <div className='dep-with-btn'>
                    <button onClick={()=>setState(1)} className={state === 1 ? 'with-depo-activa' : ''}>Deposit</button>
                    <button onClick={()=>setState(0)} className={state === 0 ? 'with-depo-activa' : ''}>Withdraw</button>
                </div>

                <form onSubmit={onSubmit}>
                    <div>
                        <label>Wallet Address</label>
                        <input type='text' readOnly value={address}/>
                    </div>
                    <div>
                        {state === 0 ?
                         <label><span>Withdraw Amount</span> <span>{balance? balance.toFixed(0) : 0.00} PICK MAX</span></label> 
                        :
                        <label><span>Deposit Amount</span> <span>{parseInt(pickBalance).toFixed(0)} PICK MAX</span></label>}
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
  )
}
 
export default With_Depo

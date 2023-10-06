import React, { useContext, useEffect, useState } from 'react'
import './AdminLogin.css'
import { AdminContext } from '../../state/AdminProvider'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ConnectWallet, useDisconnect } from '@thirdweb-dev/react'

function AdminLogin() {
    const { loading, connectWallet, address, setAddress } = useContext(AdminContext)

    const [loadingg, setLoadingg] = useState(false)
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const login = async(e) => {
        e.preventDefault()
        setLoadingg(true)
        const response = await fetch('/user/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({address, password})
        })
        const res = await response.json()
        if(response.status === 200){
            sessionStorage.setItem('token', res.token)
            sessionStorage.setItem('adminLogedIn', true)
            window.location.reload(true)
        }
        else
            toast.error(res.message)
        setLoadingg(false)
    }

    const disconnect = useDisconnect()
    useEffect(()=>{
        if(window.location.pathname !== '/admin')
            navigate('/admin')

        disconnect()
        setAddress(null)
    }, [])
  return (
    <div className='admin-login-wrapper'>
      <div className='admin-login'>
            <div className='admin-login-header'>
                <img src={require('../../assets/1pick_logo 1.png')} />
                <h3>1PICK<span>AI</span>  — Login </h3>
            </div>
            {!address? <ConnectWallet theme='light' detailsBtn={()=>{return}}/>
                :
                <form onSubmit={login}>
                    <div className='form-group'>
                        <label>Address</label>
                        <input type="text" readOnly value={address}/>
                    </div>
                    <div className='form-group'>
                        <label>Password</label>
                        <input type="password" onChange={(e)=>{setPassword(e.target.value)}} required/>
                    </div>
                    <button className='admin-login-btn' disabled={loadingg}>{loadingg? <img src={require('../../assets/loading.gif')}/> :'Login'}</button>
                </form>
            }
      </div>
    </div>
  )
}

export default AdminLogin
 
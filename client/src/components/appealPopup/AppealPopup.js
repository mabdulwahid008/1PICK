import React, { useContext, useState } from 'react'
import { Context } from '../../state/Provider'
import './AppealPopup.css'
import { toast } from 'react-toastify'

function AppealPopup() {
    const { setAppealPopup, appealPopup, setAddress, setRefresh } = useContext(Context)
    const [appealed, setAppealed] = useState(false)
    const [loading, setLoading] = useState(false)

    const checkAlreadyAppealed = async() => {
        const response = await fetch(`/event/already-appealed/${appealPopup}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
          })
        const res = await response.json()
        if (response.status === 200) {
            if(res.appealed == true)
                setAppealed(true)
            else
                setAppealed(false)        
        }
        else if (response.status === 401) {
            setAddress(null)
            setAppealPopup(false)
        }
        else
            toast.error(res.message)
    }
    checkAlreadyAppealed()

    const appeal = async () => {
        setLoading(true)
        const response = await fetch(`/event/appeal/${appealPopup}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'Application/json',
                token: sessionStorage.getItem('token')
            },
          })
        const res = await response.json()
        if (response.status === 200) {
            setAppealed(true)
            setRefresh(state => !state)
        }
        else if (response.status === 401) {
            setAddress(null)
            setAppealPopup(false)
        }
        else
            toast.error(res.message)

        setLoading(false)
    }

    return (
        <div className='popup'>
            <div className='overlay' onClick={() => setAppealPopup(false)}></div>
            <div className='card-popup appeal-popup'>
                {!appealed ? <>
                    <h4>If you think the result is incorrect, please press the button.</h4>
                    <div className='appeal-btns'>
                        <button disabled={loading} onClick={appeal}>Appeal</button>
                    </div>
                </>
                    :
                    <h4>Your comment has been forwarded to the administrator. If the results are incorrect, all money will be refunded.</h4>
                }
            </div>
        </div>
    )
}

export default AppealPopup

import React, { useEffect, useState } from 'react'
import './Usermetadata.css'
import { Link, useParams } from 'react-router-dom'
import Blockies from 'react-blockies';
import { minifyAddress } from '../../utills';
import { toast } from 'react-toastify';

function Usermetadata() {
    const { addres } = useParams()
    const [metadata, setMetadata] = useState(null)

    const fetchMetadata = async() => {
        const response = await fetch(`/user/user-metadata/${addres}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json'
            }
        })
        const res = await response.json()
        if(response.status === 200){
            setMetadata(res)
        }
        else
            toast.error(res.message)
    }

    useEffect(()=> {fetchMetadata()}, [])

  return (
    <div className='usermetadata'>
        <Blockies
            seed={addres}
            size={10}
            scale={3}
            color="#FF385C"
            bgColor="#00B66D"
        />
        <a href={`//etherscan.io/address/${addres}`} target='_blank' rel='noopener noreferrer'>{minifyAddress(addres)}</a>

        <div className='user-data'>
            <div>
                <h3>Joined</h3>
                <h3>{metadata?.joined_events? metadata?.joined_events : 0}</h3>
            </div>
            <span></span>
            <div>
                <h3>Created</h3>
                <h3>{metadata?.created_events? metadata?.created_events : 0}</h3>
            </div>
            <span></span>
            <div>
                <div>
                    <Link to='/users-ranking'><img src={require('../../assets/trophy.png')}/></Link>
                    <h3>Score</h3>
                </div>
                <div>
                    <p>#{metadata?.rank? metadata?.rank : 0}</p>
                    <h3>{metadata?.score? metadata?.score : 0}</h3>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Usermetadata

import React from 'react'
import './Usermetadata.css'
import { useParams } from 'react-router-dom'
import Blockies from 'react-blockies';
import { minifyAddress } from '../../utills';

function Usermetadata() {
    const { addres } = useParams()
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
                <h3>45</h3>
            </div>
            <span></span>
            <div>
                <h3>Created</h3>
                <h3>45</h3>
            </div>
            <span></span>
            <div>
                <h3>Score</h3>
                <div>
                    <p>#123</p>
                    <h3>45</h3>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Usermetadata

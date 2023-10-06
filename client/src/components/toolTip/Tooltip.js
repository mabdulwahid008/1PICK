import React from 'react'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import './Tooltip.css'

function Tooltip({text}) {
  return (
    <div className='tool-tip-container'>
      <AiOutlineInfoCircle />
      <div>
        {text.split(/\n/g).map((line, index)=>{
                   return <div key={index}>
                            <p key={index}>{line}</p>
                         </div>
                })}
      </div>
    </div>
  )
} 

export default Tooltip

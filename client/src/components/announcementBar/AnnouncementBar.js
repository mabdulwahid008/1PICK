import React, { useState } from 'react'
import './AnnouncementBar.css'
import { motion } from 'framer-motion'

function AnnouncementBar() {
    const [current, setCurrent] = useState(0);
    let announcements = [
        {text : "Your opinion will be more valuable than it is now"},
        // {text : "gjsnnjj"},
    ]

    const next = () =>{
        setCurrent(current === announcements.length - 1 ? 0 : current + 1)
    }

    setTimeout(()=>{
        next()
    }, 4000)

  return (
    <div className='announcement-bar'>
        {announcements.map((slide, index) => {
            if(index === current)
                return <motion.p 
                        initial={{marginTop: -10}} 
                        whileInView={{marginTop: 0}} 
                        transition={{type: 'spring', duration:0.5}}>
                        {slide.text}
                    </motion.p>
        })}
      <p></p>
    </div>
  )
}

export default AnnouncementBar

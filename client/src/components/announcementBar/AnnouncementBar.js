import React, { useState } from 'react'
import './AnnouncementBar.css'
import { motion } from 'framer-motion'

function AnnouncementBar() {
    const [current, setCurrent] = useState(0);
    let announcements = [
        {text : "Your opinion will be more valuable than it is now"},
    ]

    const fetchAnnouncements = async() => {
      const response = await fetch('/notifications', {
        method:'GET',
        headers:{
          'Content-Type': 'Application/json'
        }
      })
      const res = await response.json()
      if(response.status === 200){
        announcements.concat(res)
      }
      else
        console.log(res.message);
    }

    const next = () =>{
        setCurrent(current === announcements.length - 1 ? 0 : current + 1)
    }

    setTimeout(()=>{
        next()
    }, 4000)

    setTimeout(()=>{
      fetchAnnouncements()
    }, 1000 * 60 * 5)

  return (
    <div className='announcement-bar'>
        {announcements.map((slide, index) => {
            if(index === current)
                return <motion.p 
                        initial={{marginTop: -20}} 
                        whileInView={{marginTop: 0}} 
                        transition={{type: 'spring', duration:1}}>
                        {slide.text}
                    </motion.p>
        })}
      <p></p>
    </div>
  )
}

export default AnnouncementBar

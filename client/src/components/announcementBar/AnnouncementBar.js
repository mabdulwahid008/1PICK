import React, { useEffect, useState } from 'react'
import './AnnouncementBar.css'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

function AnnouncementBar() {
    const [current, setCurrent] = useState(0);
    let x = [
      {text : "Your opinion will be more valuable than it is now"},
      {text : "Your opinion will be more valuable than it is now"},
  ]
    const [announcements, setAnnouncements] = useState(x);

    // const fetchAnnouncements = async() => {
    //   const response = await fetch('/notifications', {
    //     method:'GET',
    //     headers:{
    //       'Content-Type': 'Application/json'
    //     }
    //   })
    //   const res = await response.json()
    //   if(response.status === 200){
    //         let xx = x.concat(res)
    //         setAnnouncements(xx)
    //   }
    //   else
    //     toast.error(res.message);
    // }

    // const next = () =>{
    //     setCurrent(current === announcements.length - 1 ? 0 : current + 1)
    // }

    // setTimeout(()=>{
    //     next()
    // }, 4000)

    // setTimeout(()=>{
    //   fetchAnnouncements()
    // }, 5000)


    useEffect(() => {
      const fetchAnnouncements = async() => {
        const response = await fetch('/notifications', {
          method:'GET',
          headers:{
            'Content-Type': 'Application/json'
          }
        })
        const res = await response.json()
        if(response.status === 200){
              let xx = x.concat(res)
              setAnnouncements(xx)
        }
        else
          toast.error(res.message);
      }

      const interval1 = setInterval(() => {
          setCurrent(prev => (prev === announcements.length - 1 ? 0 : prev + 1));
      }, 4000);

      const interval2 = setInterval(() => {
          fetchAnnouncements();
      }, 5000);

      return () => {
          clearInterval(interval1);
          clearInterval(interval2);
      };
  }, [announcements]);


  return (
    <div className='announcement-bar'>
        {announcements.map((slide, index) => {
            if(index === current)
                return <motion.p 
                        initial={{marginTop: -20}} 
                        whileInView={{marginTop: 0}} 
                        transition={{type: 'spring', duration:0.5}}>
                          {slide.is_yes && <span style={{color: slide.is_yes == 'YES'? "#00B66D" : "#FF385C"}}>{slide.is_yes == 'YES'? 'YES ' : 'NO '}</span>}
                          {slide.bet_amount && <span style={{fontWeight: 600}}>{slide.bet_amount}P </span>}
                        {slide.text}
                    </motion.p>
        })}
      <p></p>
    </div>
  )
}

export default AnnouncementBar

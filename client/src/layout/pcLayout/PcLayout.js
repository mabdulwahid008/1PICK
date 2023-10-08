import React, { useContext, useState } from 'react'
import './PcLayout.css'
import EventItem from '../../components/eventItem/EventItem'
import { Context } from '../../state/Provider'
import { AnimatePresence, motion } from 'framer-motion'

function PcLayout({ url }) {
    const { events } = useContext(Context)
    const [current, setCurrent] = useState(0)

    const trending_5_events = events?.slice(0, 5)

    const next = () =>{
        setCurrent(current === trending_5_events?.length - 1 ? 0 : current + 1)
    }
    const prev = () =>{
        setCurrent(current === 0 ? trending_5_events?.length - 1 : current - 1)
    }

    // setTimeout(()=>{
    //     next()
    // }, 4000)


    return (
        <div className="pc-layout">
            <div className="section-1">
                <div className="contentt">
                    <h3>1PICK.xyz</h3>
                    <h3>Get Reward!</h3>
                    <h1>Predict Everything!</h1>
                    <p>You can know in advance today what will happen tomorrow.</p>

                    <div className='event-slider'>
                        <AnimatePresence>
                        {trending_5_events?.map((event, index) => {
                            if (index === current)
                                return <motion.div
                                        key={index}
                                        initial={{right: -400}}
                                        whileInView={{right: 23}}
                                        exit={{ left: -500 }}
                                        transition={{type: 'easeInOut', duration:1}}>
                                    <EventItem event={event}/>
                                </motion.div>
                        })}
                        </AnimatePresence>
                    </div>
                    <div className='event-slider-btns'>
                        <p>{current+1} / 5</p>
                        <span onClick={prev}>&lt;</span>
                        <span onClick={next}>&gt;</span>
                    </div>
                </div>
            </div>
            <div className='express-opinion'>
                <span>
                    <h3>Express your opinion<br/> <span>on mobile</span></h3>
                    <div className='qr-icons'>
                        <div>
                            <img src={require('../../assets/play.png')}/>
                            <h5>Google Store</h5>
                        </div>
                        <span></span>
                        <div>
                            <img src={require('../../assets/apple.png')}/>
                            <h5>App Store</h5>
                        </div>
                    </div>
                </span>
                <div className='qr_code'>
                    <img src={require('../../assets/qr_code.png')} alt='qr_code'/>
                </div>
            </div>
            <iframe src={url} width="420" height="700"></iframe>
        </div>
    )
}

export default PcLayout

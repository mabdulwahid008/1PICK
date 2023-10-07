import React from 'react'
import './PcLayout.css'

function PcLayout({ url }) {
    return (
        <div className="pc-layout">
            <div className="section-1">
                <div className="content">
                    <h3>1PICK.xyz</h3>
                    <h3>Get Reward!</h3>
                    <h1>Predict Everything!</h1>
                    <p>You can know in advance todaywhat will happen tomorrow.</p>
                </div>
            </div>
            <div className='express-opinion'>

            </div>
            <iframe src={url} width="420" height="700"></iframe>
        </div>
    )
}

export default PcLayout

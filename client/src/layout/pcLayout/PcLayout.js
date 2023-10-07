import React from 'react'
import './PcLayout.css'

function PcLayout({ url }) {
    return (
        <div className="pc-layout">
            <div className="section-1">
                <div className="content">
          // content here
                </div>
            </div>
            <iframe src={url} width="420" height="700"></iframe>
        </div>
    )
}

export default PcLayout

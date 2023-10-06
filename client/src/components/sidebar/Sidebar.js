import React, { memo, useContext } from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import { Context } from '../../state/Provider'

function Sidebar() {
    const { setEvents, sidetop, setSidetop, setPageForEvent, userTypeEvents, setUserTypeEvents, setmobOpenSideBar } = useContext(Context)

    const filterSideTop = (value) => {
        if(sidetop !== value){
            setEvents(null)
            setPageForEvent(1)
            setSidetop(value)
        }
    }
    
    const userTypeFilter = (type) => {
        if(userTypeEvents.includes(type)){
            setEvents(null) 
            setPageForEvent(1)
            setUserTypeEvents((state) => state.replace(type, ''))
        }
        else{
            setEvents(null)
            setPageForEvent(1)
            setUserTypeEvents((state) => state.concat(type))
        }
        setmobOpenSideBar(false)
    }

  return (
    <div className='sidebar'>  
      <nav>
        <Link to='/'>
           <div style={{backgroundColor: sidetop === 0 ? '#F0F0F0' : 'transparent'}} onClick={()=> {filterSideTop(0); setmobOpenSideBar(false)}}>
                <span style={{borderColor: sidetop === 0 ? "#00B66D" : "#0062FF"}}>
                    {sidetop === 0 && <span></span>}
                </span>
                 <p>Trending</p>
            </div>
        </Link>
        <Link to='/'>
            <div style={{backgroundColor: sidetop === 1 ? '#F0F0F0' : 'transparent'}} onClick={()=>{filterSideTop(1); setmobOpenSideBar(false)}}>
                <span style={{borderColor: sidetop === 1 ? "#00B66D" : "#0062FF"}}>
                    {sidetop === 1 && <span></span>}
                </span>
                <p>New</p>
            </div>
        </Link>
        <Link to='/'>
            <div style={{backgroundColor: sidetop === 2 ? '#F0F0F0' : 'transparent'}} onClick={()=>{filterSideTop(2); setmobOpenSideBar(false)}}>
                <span style={{borderColor: sidetop === 2 ? "#00B66D" : "#0062FF"}}>
                    {sidetop === 2 && <span></span>}
                </span>
                <p>Ending Soon</p>
            </div>
        </Link>
        <Link to='/'>
            <div style={{backgroundColor: sidetop === 3 ? '#F0F0F0' : 'transparent'}} onClick={()=>{filterSideTop(3); setmobOpenSideBar(false)}}>
                <span style={{borderColor: sidetop === 3 ? "#00B66D" : "#0062FF"}}>
                    {sidetop === 3 && <span></span>}
                </span>
                <p>Volume</p>
            </div>
        </Link>
      </nav>
      <hr />
    <div className='filter'>
        <h4>Filter</h4>
        <nav>
            <div>
                <input type="checkbox" defaultChecked onChange={()=>userTypeFilter('3,')}/>
                <p>Diamond</p>
            </div>
            <div>
                <input type="checkbox" defaultChecked onChange={()=>userTypeFilter('2,')}/>
                <p>Gold</p>
            </div>
            <div>
                <input type="checkbox" defaultChecked onChange={()=>userTypeFilter('1,')}/>
                <p>Silver</p>
            </div>
        </nav>
    </div>
    <hr />
    </div>
  )
}

export default memo(Sidebar)

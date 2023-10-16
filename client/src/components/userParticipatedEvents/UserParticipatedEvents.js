import React, { useContext, useEffect, useState } from 'react'
import './UserParticipatedEvents.css'
import Select from 'react-select'
import { mobEventFilter, portfolioMobStyles, portfolioStyles } from '../../utills/selectStyles'
import { toast } from 'react-toastify'
import { Context } from '../../state/Provider'
import { Link, useNavigate } from "react-router-dom";
import { getCategoriesAPI } from '../../utills/apiRequest'

const options = [
  { value: '2', label: 'All' },
  { value: '0', label: 'Approving' },
  { value: '1', label: 'Open' },
  { value: '-1', label: 'Close' }
]



function UserParticipatedEvents() {

  const { setAddress, address } = useContext(Context)

  const [events, setEvents] = useState(null)
  const [allevents, setALLEvents] = useState(null)
  const [categoryOption, setCategoryOption] = useState([])

  const [defaultValueStatus, setDefaultValueStatus] = useState({ value: 2, label: 'All' })
  const [defaultValueMarket, setDefaultValueMarket] = useState({ value: 0, label: 'All' })
  const [searchTitle, setSearchTitle] = useState("null")

  const navigate = useNavigate()

  const getGateories = async () => {
    const { response, res } = await getCategoriesAPI()
    if (response.status === 200) {
      let options = [{ value: 0, label: 'All' }]
      for (let i = 0; i < res.length; i++) {
        let obj = {
          value: res[i]._id,
          label: res[i].name
        }
        options.push(obj)
      }
      setCategoryOption(options)
    }
    else
      toast.error(res.message)
  }

  const getEvents = async () => {
    const response = await fetch(`/event/participated?title=${searchTitle}&status=${defaultValueStatus.value}&category=${defaultValueMarket.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        token: sessionStorage.getItem('token')
      }
    })
    const res = await response.json()
    if (response.status === 200) {
      setEvents(res)
      setALLEvents(res)
    }
    else if (response.status === 401) {
      setAddress(null)
    }
    else
      toast.error(res.message)
  }

  const showALL = () => {
    setDefaultValueStatus({ value: 2, label: 'Status' })
    setDefaultValueMarket({ value: 0, label: 'Market' })
    setSearchTitle("null")
  }

  const titleSearch = (e) => {
    setDefaultValueStatus({ value: 2, label: 'Status' })
    setDefaultValueMarket({ value: 0, label: 'Market' })

    setSearchTitle(e.target.value)
  }


  useEffect(() => {
    setEvents(null)
    getEvents()
  }, [defaultValueStatus, defaultValueMarket, searchTitle])



  useEffect(() => {
  }, [events, window.innerWidth])

  useEffect(() => {
    getGateories()
  }, [])

  return (
    <div className='user-particiaptedd-events'>
      <div>
        <h3>Portfolio</h3>

      </div>
      <div className='divider'>
        <hr />
      </div>

      {<div className='participated-event-filteration'>
        <form onSubmit={(e) => e.preventDefault()} className='participated-event-search'>
          <img src={require('../../assets/search_grey.png')} alt='search' />
          <input type='text' placeholder='Search title' id='search-participated-events' onChange={titleSearch} />
        </form>

        <div>
          <Select value={defaultValueStatus} isSearchable={false} options={options} styles={window.innerWidth > 768 ? portfolioStyles : mobEventFilter} onChange={(opt) => { setDefaultValueMarket({ value: 2, label: 'All' }); setDefaultValueStatus(opt); }} />
        </div>
        <div>
          <Select value={defaultValueMarket} isSearchable={false} options={categoryOption} styles={window.innerWidth > 768 ? portfolioStyles : mobEventFilter} onChange={(opt) => { setDefaultValueStatus({ value: 0, label: 'All' }); setDefaultValueMarket(opt); }} />
        </div>
        {window.innerWidth > 768 && <button className='show-all' onClick={showALL}>Show All</button>}
      </div>}

      <div className='participated-event'>
        <table responsive={true}>
          <thead>
            <tr>
              <th style={{ width: '8%' }}>Market</th>
              <th style={{ width: window.innerWidth < 768 ? '40%' : '50%' }}>Title</th>
              <th style={{ width: '10%' }}>Type</th>
              <th style={{ width: window.innerWidth < 768 ? '50%' : '10%' }}>My Pick</th>
              <th style={{ width: '10%' }}>Outcome</th>
              <th style={{ width: '10%' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {events?.map((event, index) => {
              return <tr key={index}>
                <td>{event.market}</td>
                <td><Link to={`/event-detail/${event._id}`} target='_blank'>{event.title}</Link></td>
                {event.is_favourite ? <td>Favorite</td>
                  :
                  <td>{event.bet_amount ? `Bet ${event.is_yes == 1 ? '(Yes)' : '(No)'}` : 'Creation'}</td>
                }
                <td style={{ color: (event.is_yes == 1 && '#00B66D') || (event.is_yes == 0 && '#FF385C') }}>{event.bet_amount ? `${event.bet_amount}P` : '---'}</td>
                <td>{event.outcome ? `${parseFloat(event.outcome).toFixed(2)}P` : '---'}</td>
                <td>{event.is_active == 1 && 'Open' || event.is_active == -1 && 'Closed' || event.is_active == 0 && 'Approving'}</td>
              </tr>
            })}
          </tbody>
          <tbody>
          </tbody>
        </table>

        {events?.map((event, index) => {
          return <div className='event-item-mob' key={index}>
            <Link to={`/event-detail/${event._id}`} className='e-item-meta'>
              <Link to={`/event-detail/${event._id}`}>
                <h2>{event.title}</h2>
                <p>{event.e_start.replace('T', ' ')}</p>
              </Link>
              <div>
                {event.image_cid && <img src={`${process.env.REACT_APP_URL}/${event.image_cid}`} alt='event-image' />}
              </div>
            </Link>

            <div>
              <h3 className='pick-val'>{event.pick ? event.pick : ' '}</h3>
              {event && <div className='yes-no-mob'>
                <p>YES &nbsp; {(100 - event.no_bet_percentage).toFixed(2)}%</p>
                <p>NO &nbsp; {event.no_bet_percentage?.toFixed(2)}%</p>
              </div>}
            </div>


            <div className='parcipated-footer'>
              <div>
                {address === event.creator? 
                  <>
                  <button>Decision <br /> <span>YES or NO</span></button>
                  </>
                  :
                  <>
                  <p className='myselect'>{event.bet_amount != 0 ? 'Bet' : 'Favorite'}</p>
                  <p className='myselect'>Hello</p>
                  </>
                }
              </div>
              <div>
                <p className='myselect'>
                  <span>MySelect</span>
                  <span>{event.bet_amount != 0? `${event.is_yes == 1 ? 'YES' : 'NO'}` : ' '}</span>
                  <span>{event.bet_amount != 0? `${event.bet_amount}P` : '---'}</span>
                </p>
                <p className='myselect'>
                  <span>Outcome</span>
                  {event.is_active == -1 ? <>
                    <span>{event.bet_outcome ? `${event.is_yes == 1 ? 'YES' : 'NO'}` : ' '}</span>
                    <span>{event.outcome != 0 ? `${parseFloat(event.outcome).toFixed(2)}P` : '---'}</span>
                  </>
                    :
                    <>
                      <span> </span><span>---</span>
                    </>
                  }
                </p>
                {/* <span>
                              <p>Outcome</p>
                              <p>{event.bet_outcome > 0? (event.created_outcome > 0? parseInt(event.bet_outcome) + parseInt(event.created_outcome) : '----') : '----'}</p>
                            </span> */}
              </div>
            </div>

            {/* {event.is_favourite ? 
                      <div>
                        <p>Favorite</p>
                      </div>
                      :
                      <div>
                        <p>{event.bet_amount? `Bet`: 'Creation'}</p>
                        <p className='myselect'>
                              <span>MySelect</span> 
                              <span>{event.bet_amount? `${event.is_yes == 1? 'YES' : 'NO'}`: ' '}</span>  
                              <span>{event.bet_amount? `${event.bet_amount}P` : '---'}</span>
                        </p>
                      </div>} */}

            {/* <div>
                        <p>{event.is_active == 1 && 'Open' || event.is_active == -1 && 'Closed' || event.is_active == 0 && 'Approving'}</p>
                        <p className='myselect'>
                            <span>Outcome</span> 
                            {event.is_active == -1 ?<>
                            <span>{event.bet_amount? `${event.is_yes == 1? 'YES' : 'NO'}`: ' '}</span> 
                            <span>{event.outcome? `${parseFloat(event.outcome).toFixed(2)}P`: '---'}</span> 
                            </>
                            :
                            <>
                            <span> </span><span>---</span>
                            </>
                            }
                        </p>
                      </div> */}
          </div>
        })}
      </div>
    </div>
  )
}

export default UserParticipatedEvents

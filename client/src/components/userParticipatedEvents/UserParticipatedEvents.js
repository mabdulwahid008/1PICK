import React, { useContext, useEffect, useState } from 'react'
import './UserParticipatedEvents.css'
import Select from 'react-select'
import { mobEventFilter, portfolioMobStyles, portfolioStyles } from '../../utills/selectStyles'
import { toast } from 'react-toastify'
import { Context } from '../../state/Provider'
import { Link, useNavigate } from "react-router-dom";
import { getCategoriesAPI } from '../../utills/apiRequest'

const status = [
  { value: '99', label: 'All' },
  { value: '1', label: 'Open' },
  { value: '0', label: 'Pending' },
  { value: '-1', label: 'Closeed' },
]
const Filters = [
  { value: '99', label: 'All' },
  { value: '1', label: 'Created' },
  { value: '2', label: 'Participated' },
  { value: '3', label: 'Favorite' },
]



function UserParticipatedEvents() {

  const { setAddress, address, setDecisionPopup, refresh, setAppealPopup } = useContext(Context)

  const [events, setEvents] = useState(null)
  const [allevents, setALLEvents] = useState(null)
  const [categoryOption, setCategoryOption] = useState([])

  const [defaultValueStatus, setDefaultValueStatus] = useState({ value: 2, label: 'All' })
  const [defaultValueMarket, setDefaultValueMarket] = useState({ value: 0, label: 'All' })
  const [searchTitle, setSearchTitle] = useState("null")

  const navigate = useNavigate()



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
  }, [defaultValueStatus, defaultValueMarket, searchTitle, refresh])



  useEffect(() => {
  }, [events, window.innerWidth])

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
          <Select value={defaultValueStatus} isSearchable={false} options={status} styles={window.innerWidth > 768 ? portfolioStyles : mobEventFilter} onChange={(opt) => { setDefaultValueMarket({ value: 2, label: 'All' }); setDefaultValueStatus(opt); }} />
        </div>
        <div>
          <Select value={defaultValueMarket} isSearchable={false} options={Filters} styles={window.innerWidth > 768 ? portfolioStyles : mobEventFilter} onChange={(opt) => { setDefaultValueStatus({ value: 0, label: 'All' }); setDefaultValueMarket(opt); }} />
        </div>
        {window.innerWidth > 768 && <button className='show-all' onClick={showALL}>Show All</button>}
      </div>}

      <div className='participated-event'>
        {/* <table responsive={true}>
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
        </table> */}

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
                {address === event.creator ?
                  <>
                    {event.is_active == -2 ?
                      <>
                        <p className='myselect'>Created</p>
                        <p className='myselect'>Canceled</p>
                      </>
                      :
                      <>
                        {event.is_active == 0 ?
                          <>
                            <p className='myselect'>Created</p>
                            <p className='myselect'>Pending</p>
                          </>
                          :
                          <>
                            {event.is_active == -1 ?
                              <>
                                <p className='myselect'>Created</p>
                                <p className='myselect'>Closed</p>
                              </>
                              :
                              <>
                                {event.result_decided ?
                                  <>
                                    <p className='myselect'>Termination: {(event.will_exeute_as == 1 && 'YES') || (event.will_exeute_as == 0 && 'NO')}</p>
                                    <button onClick={() => setAppealPopup(event._id)}>Appeal</button>
                                  </>
                                  :
                                  <button onClick={() => setDecisionPopup(event._id)}>Decision <br /> <span>YES or NO</span></button>
                                }
                              </>
                            }
                          </>
                        }
                      </>

                    }
                  </>
                  :
                  <>  {event.is_active == -2 ?
                    <>
                      <p className='myselect'>{event.bet_amount != 0 ? 'Bet (withdrawn)' : 'Favorite'}</p>
                      <p className='myselect'>Canceled</p>
                    </>
                    :
                    <>
                      {event.is_active == 0 ?
                        <>
                          <p className='myselect'>Bet</p>
                          <p className='myselect'>Pending</p>
                        </>
                        :
                        <>
                          {event.is_active == -1 ?
                            <>
                              <p className='myselect'>{event.bet_amount != 0 ? 'Bet' : 'Favorite'}</p>
                              <p className='myselect'>Closed</p>
                            </>
                            :
                            <>
                              {event.result_decided ?
                                <>
                                  <p className='myselect'>Termination: {(event.will_exeute_as == 1 && 'YES') || (event.will_exeute_as == 0 && 'NO')}</p>
                                  {event.is_betted ?
                                    <button onClick={() => setAppealPopup(event._id)}>Appeal</button>
                                    :
                                    <p className='myselect'>Favorite</p>
                                  }
                                </>
                                :
                                <>
                                  <p className='myselect'>{event.bet_amount != 0 ? 'Bet' : 'Favorite'}</p>
                                  <p className='myselect'>{(event.executed_as == -1 && 'Active') || (event.executed_as == 0 && 'Waiting') || (event.executed_as == -2 && 'Canceled')}</p>
                                </>
                              }
                            </>}

                        </>

                      }

                    </>}
                  </>
                }
              </div>
              <div>
                <p className='myselect'>
                  <span>MySelect</span>
                  <span>{event.bet_amount != 0 ? `${event.is_yes == 1 ? 'YES' : 'NO'}` : ' '}</span>
                  <span>{event.bet_amount != 0 ? `${event.bet_amount}P` : '---'}</span>
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

              </div>
            </div>

          </div>
        })}
      </div>
    </div>
  )
}

export default UserParticipatedEvents

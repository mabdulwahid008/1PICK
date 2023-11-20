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
  { value: '1', label: 'Active' },
  { value: '0', label: 'Waiting' }, // events which are is_active = 0 by 5 reports  
  { value: '4', label: 'Pending' }, // events  which are is_active = 0 by 10 appeals
  { value: '-1', label: 'Closeed' },
]
const Filters = [
  { value: '99', label: 'All' },
  { value: '1', label: 'Created' },
  { value: '2', label: 'Joined' },
  { value: '3', label: 'Favorite' },
]



function UserParticipatedEvents() {

  const { setAddress, address, setDecisionPopup, refresh, setAppealPopup } = useContext(Context)

  const [events, setEvents] = useState(null)
  const [allevents, setALLEvents] = useState(null)

  const [defaultstatus, setDefaultStatus] = useState({ value: 99, label: 'All' })
  const [defaultFilters, setDefaulFilters] = useState({ value: 99, label: 'All' })
  const [searchTitle, setSearchTitle] = useState("null")

  const navigate = useNavigate()



  const getEvents = async () => {
    const response = await fetch(`/event/participated?title=${searchTitle}&status=${defaultstatus.value}&filter=${defaultFilters.value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        token: sessionStorage.getItem('token')
      }
    })
    const res = await response.json()
    if (response.ok) {
      setEvents(res)
      setALLEvents(res)
    }
    else if (response.status === 401) {
      setAddress(null)
    }
    else
      toast.error(res.message)
  }



  const titleSearch = (e) => {
    setDefaultStatus({ value: 99, label: 'All' })
    setDefaulFilters({ value: 99, label: 'All' })

    setSearchTitle(e.target.value)
  }


  useEffect(() => {
    if(events)
    events.portfolio_events = null
    getEvents()
  }, [defaultstatus, defaultFilters, searchTitle, refresh])



  useEffect(() => {
  }, [events])

  return (
    <div className='user-particiaptedd-events'>

     {events?.action_required_events && events?.action_required_events?.length > 0 && 
     <>
          <div>
            <h3>Action Required</h3>

          </div>
          <div className='divider'>
            <hr />
          </div>

          <div className='participated-event'>
            <Events events={events?.action_required_events} />
          </div>
      </>
      }

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
          <Select value={defaultstatus} isSearchable={false} options={status} styles={window.innerWidth > 768 ? portfolioStyles : mobEventFilter} onChange={(opt) => { setDefaulFilters({ value: 99, label: 'All' }); setDefaultStatus(opt); }} />
        </div>
        <div>
          <Select value={defaultFilters} isSearchable={false} options={Filters} styles={window.innerWidth > 768 ? portfolioStyles : mobEventFilter} onChange={(opt) => { setDefaultStatus({ value: 99, label: 'All' }); setDefaulFilters(opt); }} />
        </div>
      </div>}

      <div className='participated-event'>
        {events?.action_required_events && events?.action_required_events?.length > 0 ?
        <Events events={events?.portfolio_events} />
        :
        <p>No Activity Found.</p>
        }
      </div>
    </div>
  )
}

const Events = ({events}) =>{
  console.log(events);
  const {  address, setDecisionPopup, setAppealPopup } = useContext(Context)
  return (
    <>
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
                            <p className='myselect'>Waiting</p>
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
                                {event.is_active == 4 ?
                                  <>
                                   <p className='myselect'>Created</p>
                                   <p className='myselect'>Pending</p>
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
                          <p className='myselect'>Waiting</p>
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
                            {event.is_active == 4?
                              <>
                                <p className='myselect'>{event.bet_amount != 0 ? 'Bet' : 'Favorite'}</p>
                                <p className='myselect'>Pending</p>
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
                                    <p className='myselect'>{(event.executed_as == -1 && 'Active') || (event.executed_as == 0 && 'Closed') || (event.executed_as == 1 && 'Closed')}</p>
                                  </>
                                }
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
    </>
  )
}

export default UserParticipatedEvents

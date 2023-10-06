import React, { useContext, useEffect, useState } from 'react'
import './AdminGraph.css'
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Legend,  Tooltip } from 'chart.js';
import { toast } from 'react-toastify'
import { AdminContext } from '../../state/AdminProvider';

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
  );

function AdminGraph() {

  const { refresh } = useContext(AdminContext)

  const [vistors , setVistors] = useState([0,0,0,0,0,0,0])
  const [betAmount , setBetAmount] = useState([0,0,0,0,0,0,0])
  const [events , setEvents] = useState([0,0,0,0,0,0,0])
  const [registeredusers , setRegisteredUsers] = useState([0,0,0,0,0,0,0])

  const fetcStats = async(state) => {
    const response = await fetch(`/stats/graph/${state}`, {
      method : 'GET',
      headers: {
        'Content-Type' : 'Application/json',
        token: sessionStorage.getItem('token')
      }
    })

    const res = await response.json()
    if(response.status === 200){
      setBetAmount(res.bet_amount)
      setEvents(res.events)
      setRegisteredUsers(res.regitered_users)
      setVistors(res.visitor)
    }
    else
      toast.error(res.message)
  }

  function getPreviousDates(param) {
    let dates = [];
    const currentDate = new Date();
  
    switch (param) {
      case 0:
        for (let i = 6; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setDate(currentDate.getDate() - i);
          const dayName = date.toLocaleString('default', { weekday: 'long' });
          if (!dates.includes(dayName)) {
            dates.push(dayName);
          }
        }
        break;
      case 1:
        for (let i = 7; i > 0; i--) {
          dates.push('Week ' + i);
        }
        break;
      case 2:
        for (var i = 6; i >= 0; i--) {
          var previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          var monthName = previousMonth.toLocaleString('default', { month: 'long' });
      
          if (!dates.includes(monthName)) {
            dates.push(monthName);
          }
        }
        break;
      case 3:
        for (let i = 6; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setFullYear(currentDate.getFullYear() - i);
          dates.push(date.getFullYear());
        }
        break;
      default:
        console.log('Invalid parameter');
        break;
    }
  
    return dates
  }
  const [state, setState] = useState(3)

    const data = {
        // labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        labels: getPreviousDates(state),
        datasets: [
            {
                label: 'Site Visitor',
                data: vistors,
                backgroundColor: '#50B5FF',
                borderColor: '#50B5FF',
                borderWidth: 1,
                borderRadius: 10,
                barPercentage: 0.40,
                categoryPercentage: 0.6
                
            },
            {
                label: 'Bet Amount',
                data: betAmount,
                backgroundColor: '#00B66D',
                borderColor: '#00B66D',
                borderRadius: 10,
                borderWidth: 1,
                barPercentage: 0.40,
                categoryPercentage: 0.6
            },
            {
                label: 'Events',
                data: events,
                backgroundColor: '#FF974A',
                borderColor: '#FF974A',
                borderRadius: 10,
                borderWidth: 1,
                barPercentage: 0.40,
                categoryPercentage: 0.6
            },
            {
                label: 'Members Registered',
                data: registeredusers,
                backgroundColor: '#FFC542',
                borderColor: '#FFC542',
                borderRadius: 10,
                borderWidth: 1,
                barPercentage: 0.40,
                categoryPercentage: 0.6
            }
        ] 
    }

    const options = {
        plugins: {
            legend: {
              position: 'bottom', // Display the legend (dataset labels) below the chart
              labels: {
                  usePointStyle: true, // Use circular markers instead of legend boxes
                  pointStyle: 'circle',
                  padding: window.innerWidth <= 768? 10 : 40,
                  font: {
                    size: window.innerWidth <= 768? 7 : 14
                }
                },
            },
          },
        scales: {
            x: {
              display: true,
              grid: {
                display: false,
                drawBorder: true,
              },
            },
            y: {
              display: true,
              grid: {
                display: false,
                drawBorder: true,
              }
            }
        }
    }
      


    useEffect(()=>{
      fetcStats(state)
    }, [state, refresh])
    
  return (
    <div className='admin-graph-wrapper' id="traffic">
      <div className='admin-graph'>
            <div className='admin-grapgh-head'>
                <h3>Site Traffic Statistics</h3>
                <div className='graph-button'>
                    <button onClick={()=> setState(0)} className={state === 0 ? 'active-graph' : ''}>Daily</button>
                    <button onClick={()=> setState(1)} className={state === 1 ? 'active-graph' : ''}>Weekly</button>
                    <button onClick={()=> setState(2)} className={state === 2 ? 'active-graph' : ''}>Monthly</button>
                    <button onClick={()=> setState(3)} className={state === 3 ? 'active-graph' : ''}>Yearly</button>
                </div>
            </div>

            <Bar data={data} height={window.innerWidth <= 768? 250 : 130} options={options}></Bar>
      </div>
    </div>
  )
}

export default AdminGraph

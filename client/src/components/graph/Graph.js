import React, { useContext, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import './Graph.css'
import { Context } from '../../state/Provider';
import { toast } from 'react-toastify';


ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);


const options = {
  plugins:{
    legend: {
      display: false,
    }
  },
  maintainAspectRatio: false,
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
      min: 0, // Set the minimum value for the y-axis to 0
      max: 100,
      grid: {
        display: false,
        drawBorder: true,
      },
      ticks: {
        callback: function (value) {
          // Show the label only for non-negative values
          return value >= 0 ? value + " %" : "";
        },
      },
    },
  },
  elements: {
    line: {
      borderWidth: 2,
    },
  },
};



  
  


function Graph({ event_id }) {
  const {openSideBar, refresh } = useContext(Context)
  const [graphRefresh, setGraphRefresh] = useState(false)
  const [yes_stats, setYes_stats] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0])
  const [no_stats, setNo_stats] = useState([0,0,0,0,0,0,0,0,0,0,0,0,0])
  const [data, setData] = useState(null)
  
  const generateLabels = () => {
    const labels = [];
    const currentTime = new Date();
  
    // Calculate starting time as 12 hours before the current time
    const startingTime = new Date(currentTime.getTime() - 12 * 60 * 60 * 1000);
  
    for (let i = 0; i <= 12; i++) { // 12 intervals of 1 hour in 12 hours
      const labelTime = new Date(startingTime.getTime() + i * 60 * 60 * 1000);
      const label = labelTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric'
      });
      labels.push(label);
    }
  
    return labels;
  };

  const getStats = async() => {
    const response = await fetch(`/event/stats/${event_id}`, {
      method: 'GET',
      headers:{
        'Content-Type': 'Application/json'
      }
    })
    const res = await response.json()
    if(response.status === 200){
      setData(res.data)
      setYes_stats(res.yes_stats)
      setNo_stats(res.no_stats)
    }
    else
      toast.error(res.message)
  }
  
  const stats = {
    labels: generateLabels(),
    datasets: [
      {
        data: yes_stats,
        label: 'Yes',
        fill: false,
        borderColor: "#00B66D",
        backgroundColor: "transparent",
        pointBorderColor: "#00B66D",
        pointRadius: 1,
        pointHoverRadius: 1,
        pointBorderWidth: 3,
        tension: 0.2
      },
      {
        data: no_stats,
        label: 'No',
        fill: false,
        borderColor: "#FF385C",
        backgroundColor: "transparent",
        pointBorderColor: "#FF385C",
        pointRadius: 1,
        pointHoverRadius: 1,
        pointBorderWidth: 3,
        tension: 0.2
      },
    ]
  };

  useEffect(()=>{
    getStats()
  }, [graphRefresh, event_id, refresh])

  useEffect(()=>{
  }, [openSideBar, yes_stats, no_stats])
  return (
    <div className='graph'>
      <div className='graph-stats'>
          {/* <div className='yes-stats'>
            <p>{data?.is_yes == 1 ? 'YES' : 'NO'}</p>
            <h2>{data?.total_amount ?data?.total_amount: 0}P</h2>
            <p>+{data?.hourly_amount? data?.hourly_amount: 0}P ({data?.percentage? data?.percentage?.toFixed(2): 0}%) <span>1Hour Before</span></p>
          </div>
          <div onClick={()=>setGraphRefresh(!graphRefresh)}>
            <img src={require('../../assets/refresh.png')} alt='graphRefresh'/>
          </div> */}
          <p><span>YES {data?.yes}P</span> / <span>NO {data?.no}P</span> (Total {data?.total}P)</p>
      </div>
        <div className='chart' >
          <Line data={stats} options={options} width={600}/>
        </div>
    </div>
  );
}

export default Graph;

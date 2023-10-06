import React, { useEffect } from 'react'
import AdminGraph from '../../components/adminGraph/AdminGraph'
import AdminDashboardStats from '../../components/adminStats/AdminDashboardStats'
import { useLocation } from 'react-router-dom'
import AdminEventListing from '../../components/adminEventListing/AdminEventListing'

function AdminDashboard() {
    const location = useLocation()
    useEffect(() => {
        if (location.hash === '#traffic') {
          const trafficElement = document.getElementById('traffic');
          if (trafficElement) {
            trafficElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
        if (location.hash === '#overview') {
          const overviewElement = document.getElementById('overview');
          if (overviewElement) {
            overviewElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
        if (location.hash === '#events') {
          const eventsElement = document.getElementById('events');
          if (eventsElement) {
            eventsElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, [location.hash]);
  return (
    <div>
        <AdminDashboardStats />
        <AdminGraph />
        <AdminEventListing />
    </div>
  )
}

export default AdminDashboard

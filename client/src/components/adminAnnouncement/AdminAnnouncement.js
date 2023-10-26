import React, { useEffect, useState } from 'react'
import './AdminAnnouncement.css'
import { toast } from 'react-toastify'
import { BsTrash3Fill } from 'react-icons/bs'


function AdminAnnouncement() {
  const [announcement, setAnnouncement] = useState(null)
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')

  const fetchAnnouncements = async() => {
    const response = await fetch('/notifications/admin', {
      method:'GET',
      headers:{
        'Content-Type': 'Application/json'
      }
    })
    const res = await response.json()
    if(response.status === 200){
      setAnnouncement(res)
    }
    else
      toast.error(res.message);
  }

  const onSubmit = async(e) => {
    e.preventDefault()
    setLoading(true)
    const response = await fetch('/notifications', {
      method:'POST',
      headers:{
        'Content-Type': 'Application/json'
      },
      body: JSON.stringify({text})
    })
    const res = await response.json()
    if(response.status === 200){
     setText('')
     document.getElementById('text').value = ''
     fetchAnnouncements()
     toast.success(res.message)
    }
    else
      toast.error(res.message);
    
    setLoading(false)
  }

  const deleteAnnouncement = async(id) => {
    setLoading(true)
    const response = await fetch(`/notifications/${id}`, {
      method:'DELETE',
      headers:{
        'Content-Type': 'Application/json'
      },
    })
    const res = await response.json()
    if(response.status === 200){
     fetchAnnouncements()
     toast.success(res.message)
    }
    else
      toast.error(res.message);
    
    setLoading(false)
  }

  useEffect(()=>{

  }, [announcement])

  useEffect(()=>{
    fetchAnnouncements()
  }, [  ])
  return (
    <div className='admin-announcement'> 
       <h2>Announcements</h2>
       <form onSubmit={onSubmit}>
        <input type='text' id='text' defaultValue={text} required placeholder='Create announcement (max: 50)' onChange={(e)=>{
          document.getElementById('text').value = e.target.value.slice(0, 50); 
          if(e.target.value.length <= 50) 
            setText(e.target.value)
        }}/>
        <button disabled={loading}>Submit</button>
       </form>
       <div>
        {!announcement || announcement?.length == 0 && <span>No Announcement created.</span>}
        {announcement?.map((ann, index) =>{
          return <span>
                    <p>{ann.text}</p>
                    <BsTrash3Fill onClick={()=> deleteAnnouncement(ann._id)}/>
                </span>
        })}
       </div>
    </div>
  )
}

export default AdminAnnouncement

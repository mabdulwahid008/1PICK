import React, { useContext, useState } from 'react'
import './CreateCategory.css'
import { toast } from 'react-toastify'
import { AdminContext } from '../../state/AdminProvider'

function CreateCategory() {
  const { setRefresh } = useContext(AdminContext)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async(e) => {
    e.preventDefault()
    setLoading(true)
    const response = await fetch('/category', {
      method:'POST',
      headers: {
        'Content-Type':'Application/json',
        token: sessionStorage.getItem('token')
      },
      body: JSON.stringify({name})
    })
    const res = await response.json()
    if(response.status === 200){
      toast.success(res.message)
      setRefresh(state => !state)
      document.getElementById('category-input').value = ''
    }
    else if(response.status === 401){
        toast.error('Please login, your session has expired.')
        sessionStorage.clear()
        window.location.reload(true)
    }
    else
        toast.error(res.message)
    setLoading(false)
  }


  return (
    <div className='create-category'>
        <h2>Create New Category</h2>
        <form onSubmit={onSubmit}>
            <div className='form-group'>
                <label>Name</label>
                <input type='text' id='category-input' placeholder='Name your category' required onChange={(e)=>setName(e.target.value)}/>
            </div>
            <button disabled={loading}>Create</button>
        </form>
    </div>
  )
}

export default CreateCategory

import React, { useContext, useEffect, useState } from 'react'
import './CategoryListing.css'
import { getCategoriesAPI } from '../../utills/apiRequest'
import { toast } from 'react-toastify'
import { BsTrash } from 'react-icons/bs'
import { RxCross1 } from 'react-icons/rx'
import { FiEdit } from 'react-icons/fi'
import { AdminContext } from '../../state/AdminProvider'


function CategoryListing() {
  const { refresh } = useContext(AdminContext)
  const [categories, setCategories] = useState(null)

  const fetchCategories = async() => {
    const { response, res } = await getCategoriesAPI()
    if(response.status === 200){
      setCategories(res)
    }
    else if(response.status === 401){
      toast.error('Please login, your session has expired.')
      sessionStorage.clear()
      window.location.reload(true)
    }
    else
        toast.error(res.message)
  }


  useEffect(()=>{
    fetchCategories()
  }, [refresh])

  return (
    <div className='category-lisiting'> 
        <h2>All Categories</h2>
        <div className='category-lists'>
          <table>
            <thead>
              <tr>
                <th >#</th>
                <th >Name</th>
                <th >Event Count</th>
                <th >Order</th>
                <th >Added On</th>
                <th >Actions</th>
              </tr>
            </thead>
          <tbody>
          {categories?.map((cat, index) => {
            return <CategoryRow cat={cat} index={index} fetchCategories={fetchCategories}/>
          })}
          </tbody>
          </table>
        </div>
    </div>
  )
}

export default CategoryListing


const CategoryRow = ({cat, index, fetchCategories}) => {
  
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState(null)
  const [order, setOrder] = useState(null)
  
  const deleteCategory = async(id) => {
    const check = window.confirm('Are you sure deleting this category?')
    if(!check)
      return;
    const response = await fetch(`/category/${id}`, {
      method: 'DELETE',
      headers:{
        'Content-Type': 'Application/json',
        token: sessionStorage.getItem('token')
      }
    })
    const res = await response.json()
    if(response.status === 200){
      toast.success(res.message)
      fetchCategories()
    }
    else if(response.status === 401){
      toast.error('Please login, your session has expired.')
      sessionStorage.clear()
      window.location.reload(true)
    }
    else
        toast.error(res.message)
  }

  const updateCategory = async(_id) => {
    if(name === '' || !name)
      return;
    const response = await fetch(`/category`, {
      method: 'PATCH',
      headers:{
        'Content-Type': 'Application/json',
        token: sessionStorage.getItem('token')
      },
      body: JSON.stringify({_id, name})
    })
    const res = await response.json()
    if(response.status === 200){
      toast.success(res.message)
      fetchCategories()
      setEdit(false)
    }
    else if(response.status === 401){
      toast.error('Please login, your session has expired.')
      sessionStorage.clear()
      window.location.reload(true)
    }
    else
        toast.error(res.message)
  }
  
  return <> 
      <tr key={index}>
          <td >{index+1}</td>
          <td >{cat.name}</td>
          <td >{cat.eventCount}</td>
          <td >{cat.order? cat.order : cat._id }</td>
          <td >{cat.created_on.substr(0,16).replace('T', ' ')}</td>
          <td >
            <FiEdit onClick={()=>setEdit(true)}/>
            {cat.eventCount == 0 && <BsTrash onClick={() => deleteCategory(cat._id)}/>}
          </td>
        {edit && <span className='edit-cate'>
          <input defaultValue={cat.name} required onChange={(e)=>setName(e.target.value)} placeholder='Category Name'/>
          <input defaultValue={cat.order? cat.order : cat._id} type='number' required onChange={(e)=>setOrder(e.target.value)} placeholder='Category Order'/>
          <button onClick={()=>updateCategory(cat._id)}>Update</button>
          <RxCross1 onClick={()=>setEdit(false)}/>
        </span>}
        </tr>
    </>
}
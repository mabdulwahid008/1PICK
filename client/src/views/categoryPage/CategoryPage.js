import React, { useEffect } from 'react'
import './CategoryPage.css'
import CreateCategory from '../../components/createCategory/CreateCategory'
import CategoryListing from '../../components/categoryListing/CategoryListing'

function CategoryPage() {
    useEffect(()=>{
        window.scrollTo(0, 0)
    }, [])
  return (
    <div className='category-page-wrapper'> 
     <div className='category-page'>
        <div>
            <CategoryListing />
        </div>
        <div>
            <CreateCategory />
        </div>
     </div>
    </div>
  )
}

export default CategoryPage

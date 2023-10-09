import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import './CategoryCarosul.css';
import { toast } from 'react-toastify';
import { getCategoriesAPI } from '../../utills/apiRequest';
import { Context } from '../../state/Provider';
import ReactSelect from 'react-select'
import { createMobEvent, mobEventFilter, portfolioStyles } from '../../utills/selectStyles';


const CategoryCarosul = () => {

  const { categoryIDforEventFiltering, setCategoryIDforEventFiltering, setPageForEvent, sidetop, setEvents, setSidetop } = useContext(Context)

  const [carouselData, setCarouselData] = useState([{_id: 0, name: 'All'}])
  const [categoryFilter, setCategoryFilter] = useState(null)

  const [defaultFilterOption, setDefaultFiterOption] = useState({value:0, label:'Trending'})
  const [defaultCategoryOption, setDefaultCategoryOption] = useState({value:0, label:'All'})
  
  let touchStartX = 0;
  let touchEndX = 0;

  let filters = [
    {value : 0, label: 'Trending'},
    {value : 1, label: 'New'},
    {value : 2, label: 'Ending Soon'},
    {value : 3, label: 'Volume'},
  ]

  const filterByCategory = (_id) => {
    if(categoryIDforEventFiltering !== _id){
      setEvents(null)
      setPageForEvent(1)
      setCategoryIDforEventFiltering(_id)
    } 
  }
 
  const getCategories = async() => {
    const { response, res } = await getCategoriesAPI()
    if(response.status === 200){
      setCarouselData((state)=> state.concat(res))
      let options = [{value: 0, label: 'All'}]
      for (let i = 0; i < res.length; i++) {
        let option = {
          value: res[i]._id,
          label: res[i].name,
        }
        options.push(option)
      }
      setCategoryFilter(options)
    }
    else
      toast.error(res.message)
  }
  
  const handlePrevClick = () => {
    let box = document.getElementById('carousel-items')
    let width = box.offsetWidth
    box.scrollLeft = box.scrollLeft - width
    handleBtns()
  };
  
  const handleNextClick = () => {
    let box = document.getElementById('carousel-items')
    let width = box.offsetWidth
    box.scrollLeft = box.scrollLeft + width
    handleBtns()
  };

  const handleTouchStart = (event) => {
    touchStartX = event.touches[0].clientX;
  };

  const handleTouchMove = (event) => {
    touchEndX = event.touches[0].clientX;
    let box = document.getElementById('carousel-items')

    if (touchStartX - touchEndX > 1) {
        box.scrollLeft = box.scrollLeft + 250
    }
    else if (touchStartX - touchEndX < -1) {
        box.scrollLeft = box.scrollLeft - 250
      }
      handleBtns()
  };

  const handleBtns = () => {
    // if(carouselData.length > 0)
    // setTimeout(() => {
    //   let box = document.getElementById('carousel-items');
    //   let prevButton = document.getElementById('prev');
    //   let nextButton = document.getElementById('next');
  
    //   prevButton.style.display = box.scrollLeft === 0 ? 'none' : 'block';
    //   nextButton.style.display = box.scrollLeft + box.offsetWidth >= box.scrollWidth ? 'none' : 'block';
    // }, 500);
  }

  const onChangeFilter = (option) => {
    if(option.value == sidetop){
      return;
    }
    setDefaultFiterOption(option)
    setEvents(null)
    setPageForEvent(1)
    setSidetop(option.value)
  }
  const onChangeCategoryFilter = (option) => {
    if(option.value == categoryIDforEventFiltering){
      return;
    }
    setDefaultCategoryOption(option)
    setEvents(null)
    setPageForEvent(1)
    setCategoryIDforEventFiltering(option.value)
  }

  handleBtns()
  useEffect(()=>{

  }, [carouselData])

  useLayoutEffect(()=>{
    getCategories()
  }, [])


  return (
    <>
    <div className="carousel-container">
          <button onClick={handlePrevClick} className='prev' id='prev'><img src={require('../../assets/left.png')} alt='left-arrow'/></button>
          <button onClick={handleNextClick} className='next' id='next'><img src={require('../../assets/left.png')} alt='right-arrow' /></button>
        <div className="carousel-items" id='carousel-items' onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
          {carouselData.map((item, index) => {
            return <div key={item._id} onClick={()=>filterByCategory(item._id)} className="carousel-item" style={{backgroundColor: categoryIDforEventFiltering == item._id ? '#00B66D' : '#F4F4F4', color: categoryIDforEventFiltering == item._id ? 'white' : '#0C0C0C',}}>
                      <h3>{item.name}</h3>
                    </div>
        })}
        </div>
    </div>
    {categoryFilter && <>
      <h2 className='predict-everything'>Predict Everything</h2>
      <div className='mobile-filter-section'>
        <div>
            <ReactSelect isSearchable={ false } value={defaultFilterOption} options={filters} styles={mobEventFilter} onChange={(option)=>onChangeFilter(option)}/>
        </div>
        <div>
            <ReactSelect isSearchable={ false } value={defaultCategoryOption} options={categoryFilter} styles={mobEventFilter} onChange={(option) => onChangeCategoryFilter(option)}/>
        </div>
    </div>
    </>} 
  </>
  );
};

export default CategoryCarosul;

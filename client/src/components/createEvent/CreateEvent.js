import React, { useContext, useEffect, useState } from 'react'
import './CreateEvent.css'
import { convertBase64, eventDataValidation, upload_to_NFT_Storage } from '../../utills/index'
import { toast } from 'react-toastify'
import { getCategoriesAPI, uploadImageToIPFS } from '../../utills/apiRequest'
import Select from 'react-select'
import { createEvent, createMobEvent } from '../../utills/selectStyles'
import { Context } from '../../state/Provider'
import Tooltip from '../toolTip/Tooltip'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



function CreateEvent() {
    const { setDepositPopup, balance, setAddress, numbers, address, setRefresh } = useContext(Context)
    const [image, setImage] = useState(null)
    const [eventData, setEventData] = useState({})
    const [loading, setLoading] = useState(false)
    const [categoryOptions, setCategoryOptions] = useState([])


    const handleImage = async(e) => {
        if(e.target.files[0].size >= 10000000){
            toast.error('Image size should be less than 10MB')
            return;
        }
        eventData.image = e.target.files[0]
        const base64 = await convertBase64(e.target.files[0])
        setImage(base64)
    } 

    const onChange = (e) => {
        let value = e.target.value;
        const pattern = /^[^<>|]*$/; 

        if((e.target.name == 'title' || e.target.name == 'description' || e.target.name == 'pick' || e.target.name == 'resolution_url') && pattern.test(value)){
            setEventData({...eventData, [e.target.name]: e.target.value})
        }
        else if(e.target.name === 'e_start'){
            value = `${value}T00:00`
            setEventData({...eventData, [e.target.name]: value})
        }
        // else if (!(e.target.name == 'title' || e.target.name == 'description' || e.target.name == 'pick' || e.target.name == 'resolution_url')){
        //     setEventData({...eventData, [e.target.name]: e.target.value})
        // }
        else{}
    }

    const getCategoryOptions = async() =>{
        const {response, res} = await getCategoriesAPI()
        if(response.status === 200){
            let options = []
            for (let i = 0; i < res.length; i++) {
                let option = {
                    value: res[i]._id,
                    label: res[i].name
                }
                options.push(option)
            }
            setCategoryOptions(options)
        }
        else if(response.status === 401){
            setAddress(null)
            toast.error('Please login, your session has expired.')
        }
        else
            toast.error(res.message)
    }

    const onSubmit = async(e) => {
        e.preventDefault()
        setLoading(true)
        

        // frontend validation
        const error = eventDataValidation(eventData.title, eventData.description, eventData.e_start, eventData.e_end)
        if(error){
            toast.error(error);
            setLoading(false)
            return;
        }
        // if user balance balance is less than 10000
        // if(balance < numbers.e_creation){
        //     setLoading(false)
        //     setDepositPopup(true)
        //     return;
        // }
        
        // const image_CID = await uploadImageToIPFS(eventData.image)
        // eventData.image_CID = image_CID

        try {
            const content_cid = await upload_to_NFT_Storage(
                eventData.title, 
                eventData.description, 
                eventData.e_start, 
                eventData.resolution_url,
                categoryOptions.filter((c) => c.value == eventData.c_id)[0].label,
                address,
                eventData.image,
                eventData.pick
                )

        const formData = new FormData()
        formData.append("title", eventData.title)
        formData.append("description", eventData.description)
        formData.append("d_date", eventData.e_start)
        formData.append("c_id", eventData.c_id)
        formData.append("resolution_url", eventData.resolution_url)
        formData.append("pick", eventData.pick)
        formData.append("image", eventData.image)
        formData.append("content_cid", content_cid)

        const res = await axios.post("/event/create", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                token: sessionStorage.getItem('token')
            }
            });

        if(res.status === 200){
            document.getElementById('title').value = ''
            document.getElementById('pick').value = ''
            document.getElementById('description').value = ''
            document.getElementById('description').value = ''
            document.getElementById('participation').value = ''
            // document.getElementById('d-day').value = ''
            document.getElementById('resolution').value = ''
            document.getElementById('cate-select').value = ''
            document.getElementById('check').checked = false
            setImage(null)
            eventData.title = ''
            eventData.description = ''
            eventData.pick = ''
            eventData.resolution_url = ''
            setRefresh((state) => !state)
            toast.success(res.data.message)
        }
        else if(res.status === 401){
            setAddress(null)
            toast.error('Please login, your session has expired.')
        }
        else
            toast.error(res.data.message)
            
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            setLoading(false)
        }
        

        setLoading(false)
    }

    setTimeout(()=>{
        if(!address)
            return
        const date = new Date()
        const add48hours = new Date(date.getTime() + 96 * 60 * 60 * 1000)
        
        let x = add48hours.toISOString().slice(0, 10)
        const element = document.getElementById('participation')
        if(!element?.value){
            element.value = x

            x = `${x}T00:00`
            eventData.e_start = x
        }
    }, 1000)

    const navigate = useNavigate()
    
    useEffect(()=>{
        if(!address){
            navigate('/')
        }
        getCategoryOptions()
    }, [eventData, address])

  return (
    <div className='create-event'>
      <div className='create-heading'>
        <h1>Create A New Event</h1>
        <p>The 1% commission of the event is yours.</p>
      </div>
      <form onSubmit={onSubmit}>
        <div className='create-inputs'>
            <div className='formGroup'>
                <label>Title <Tooltip text={"Please enter event title. \n ex) Tomorrow's temperature in london"}/></label>
                <input type='text' name='title' value={eventData.title} id="title" placeholder='Event title here (max : 60)' required onChange={(e) => {document.getElementById('title').value = e.target.value.slice(0, 60); if(e.target.value.length <= 60) onChange(e)}}/>
            </div>
            <div className='formGroup'>
                <label>Pick  (Condition) <Tooltip text={"Enter event conditions \nex) 35°C"}/></label>
                <input type='text' name='pick' value={eventData.pick} id="pick" placeholder='Event condition here (max : 60)' required onChange={(e) => {document.getElementById('pick').value = e.target.value.slice(0, 60); if(e.target.value.length <= 60) onChange(e)}}/>
            </div>
            <div className='formGroup'>
                <label>Description <Tooltip text={"Please provide a brief description of the event."}/></label>
                <textarea name='description' value={eventData.description} id='description' placeholder='Description here (max : 300)' required onChange={(e) => {document.getElementById('description').value = e.target.value.slice(0, 300); if(e.target.value.length <= 300) onChange(e)}}></textarea>
            </div>
            {/* <div className='formGroup'>
                <label>Event Participation End Date*</label>
                <input type='datetime-local' name='e_end' id='d-day' required onChange={onChange}/>
            </div> */}
            <div className='formGroup' style={{width:'110%'}}>
                <label>Category <Tooltip text={"Please select the category to which the event belongs."}/></label>
                <Select id='cate-select' isSearchable={ false } onChange={(option) => {eventData.c_id = option.value}} required placeholder="Select Category" options={categoryOptions} styles={window.innerWidth <= 768 ? createMobEvent : createEvent} />
            </div>
            <div className='formGroup'> 
                <label>Date of event <Tooltip text={"Please enter the date of the event \nex) 2023.09.01"}/></label>
                <input type='date' name='e_start' id='participation' required onChange={onChange}/>
            </div>
            <div className='formGroup'>
                <label>Resolution URL <Tooltip text={"Please enter the URL of the official website where you can check the event results."} /></label>
                <input type='text' id='resolution' value={eventData.resolution_url} name='resolution_url' placeholder='Type resolution here' required onChange={onChange}/>
            </div>
            <div className='form-check'>
                <input type='checkbox' required id='check'/>
                <label>Inappropriate events may not be accepted.</label>
            </div>
            <div className='formGroup'>
                <button className='btn-submit' disabled={loading? true: false}>
                    {loading? <img src={require('../../assets/loading.gif')} /> : 'Publish'}
                </button>
            </div>
        </div>
        <div className='event-image'>
            <label>Image <Tooltip text={"Please upload an image that can express the event well."}/></label>
            {!image && <div className='create-image' onClick={()=>document.getElementById('e-img').click()}>
                <img src={require('../../assets/create-img.png')} alt='event'/> 
            </div>}
            {image && <img src={image} alt='event' onClick={()=>document.getElementById('e-img').click()}/>}
            <input type='file' id='e-img' accept='image/*' onChange={handleImage} required/>
        </div>
      </form>
    </div>
  )
}

export default CreateEvent

import axios from "axios"

// API to LOGIN or SIGNUP
export const loginAPI = async(address) => {
    const response = await fetch('/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({address})
    })
    const res = await response.json()
    return {response, res}
}

// API to verify token
export const verifyToken = async(token) => {
    const response = await fetch('/user/verify-token', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            token: token
        }
    })
    const res = await response.json()
    return { response, res }
}

// Upload Image to IPFS
export const uploadImageToIPFS = async(image) => {
    const formData = new FormData();
    formData.append('file', image)

    const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`
        }
    });
    return res.data.IpfsHash;
}

// api to get Categories
export const getCategoriesAPI = async() =>{
    const response = await fetch('/category',{
        method:'GET',
        headers: {
            'Content-Type': 'application/json',
            token: sessionStorage.getItem('token')
        }
    })
    const res = await response.json()
    return { response, res }
}

// Api to get Events
export const getEventsAPI = async(pageForEvent, categoryIDforEventFiltering, sidetop, userTypeEvents) => {
    const response = await fetch(`/event?page=${pageForEvent}&category=${categoryIDforEventFiltering}&sidetop=${sidetop}&filter=${userTypeEvents}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    const res = await response.json()
    return {response , res}
}


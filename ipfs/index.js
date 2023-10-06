const axios = require('axios');
const db = require('../db')

const uploadJSONToIPFS = async(title, description, e_start, e_end, resolution_url, c_id, creator_id, image_CID, pick) => {
    const creator = await db.query('SELECT address FROM USERS WHERE _id = $1', [creator_id])
    const category = await db.query('SELECT name FROM CATEGORIES WHERE _id = $1', [c_id])
    
    let data =  JSON.stringify({
        title, 
        pick,
        description, 
        event_participation_date: e_start, 
        event_d_date : e_end, 
        resolution_url, category : category.rows[0].name, 
        creator: creator.rows[0].address, 
        // image: `https://ipfs.io/ipfs/${image_CID}`
        image: `https://1pick.xyz/${image_CID}`
    })

    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${process.env.PINATA_JWT}`
        },
        data : data
      };
      
    const res = await axios(config);
    return res.data.IpfsHash;
}


const deleteFromIPFS  = async(cid) => {
  console.log(cid);
  var config = {
    method: 'delete',
    url: `https://api.pinata.cloud/pinning/unpin/${cid}`,
    headers: { 
      'Authorization': `Bearer ${process.env.PINATA_JWT}`
    }
  };
  
  const res = await axios(config);
  if(res.data = 'OK')
    return true;
  else
    return false;
  
}



module.exports = { uploadJSONToIPFS, deleteFromIPFS }
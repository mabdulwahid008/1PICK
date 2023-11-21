import { NFTStorage } from 'nft.storage';

export const convertBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result)
    }
  })
}

export const eventDataValidation = (title, description, eventDate, expireDate) => {
  const specialCharRegex = /[!@#$%^&*()":{}|<>]/;

  // if (specialCharRegex.test(title) || specialCharRegex.test(description)) {
  //   return "Title and description should not contain special characters.";
  // }

  const selectedEventDate = new Date(eventDate);
  const selectedExpireDate = new Date(expireDate);
  const currentDateTime = new Date();
  const minExpireDate = new Date(selectedEventDate.getTime() - 60 * 60 * 1000);
  const minEventDate = new Date(currentDateTime.getTime() + 48 * 60 * 60 * 1000);


  if (selectedEventDate < currentDateTime) {
    return "Event d-date should not be in the past.";
  }
  if (selectedEventDate < minEventDate) {
    return "Event date should be at least 72 hours later than now.";
  }

  // if (selectedExpireDate < currentDateTime) {
  //   return "Event participation end date should not be in the past.";
  // }

  // if (selectedExpireDate >= selectedEventDate) {
  //   return "Event participation end date should be before the event D-date.";
  // }

  // if (selectedExpireDate > minExpireDate) {
  //   return "Event participation date should be at least 1 hour before the event D-date.";
  // }

  return null;
};



export const minifyAddress = (address) => {
  const start = address.substr(0, 6)
  const end = address.substr(address.length - 4)
  return `${start}...${end}`
}
export const minifyAddress2 = (address) => {
  const start = address.substr(0, 6)
  const mid = address.substr(8, 15)
  const end = address.substr(address.length - 4)
  return `${start}...${mid}...${end}`
}


export const upload_to_NFT_Storage = async (title, description, e_start, resolution_url, category, user, image, pick) => {

  let inputDate = new Date(e_start + ":00.000Z");
  let time = inputDate.setHours(inputDate.getHours() - 3);

  var date = new Date(time);
  var year = date.getUTCFullYear();
  var month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  var day = date.getUTCDate().toString().padStart(2, '0');
  var hours = date.getUTCHours().toString().padStart(2, '0');
  var minutes = date.getUTCMinutes().toString().padStart(2, '0');

  var e_end = `${year}-${month}-${day}T${hours}:${minutes}`;

  const client = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDcxRDY1MEJBOTk4YTNGNjVDMTdFODAxNjE4NTA4ZTIzYzBlM2Q5YWEiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4OTg2MTA4NjM0MiwibmFtZSI6IjFwaWNrIn0.u-WhsLbhLmpIkkslhNXsX32BS61HHFJHZfr9f3zkNKo" });

  const dummyImageData = 'https://1pick.xyz/images/16995090317073.jpg'; 
  const dummyImageBlob = new Blob([dummyImageData], { type: 'image/png' }); 


  try {
    const metadata = await client.store({
      name: title,
      pick,
      description,
      event_participation_date: e_end,
      event_d_date: e_start,
      resolution_url,
      category: category,
      creator: user,
      image: dummyImageBlob
    });

    return metadata.url.slice(7, metadata.url.length - 14);

  } catch (error) {
    throw new Error(error)
  }
}

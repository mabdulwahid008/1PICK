export const convertBase64 = (file)=>{
    return new Promise((resolve, reject)=>{
        const reader = new FileReader()
        reader.readAsDataURL(file);
        reader.onload =()=>{
            resolve(reader.result)
        }
    })
}

export const eventDataValidation = (title, description, eventDate, expireDate) => {
  const specialCharRegex = /[!@#$%^&*()":{}|<>]/;

  if (specialCharRegex.test(title) || specialCharRegex.test(description)) {
    return "Title and description should not contain special characters.";
  }

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

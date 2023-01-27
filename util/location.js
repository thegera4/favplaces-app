import { GOOGLE_API_KEY } from '@env';


export function getMapPreview(lat, lng){
  const imagePreviewURL = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
  return imagePreviewURL;
}

export async function getAddress(lat, lng){
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(URL);
  let address;
  if(!response.ok){
    throw new Error('Failed to fetch address!');
  }
  const resData = await response.json();
  
  if(resData){
    address = resData.results[0].formatted_address;
    return address;
  } else {
    address = 'No information about this place was found in Google Services';
    return address;
  }
}
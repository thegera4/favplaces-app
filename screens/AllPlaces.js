import { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import PlacesList from '../components/Places/PlacesList'
import { fetchPlaces } from '../util/database'


const AllPlaces = ({route}) => {
  const isFocused = useIsFocused()
  const [loadedPlaces, setLoadedPlaces] = useState([])

  useEffect(() => {
    async function loadedPlaces(){
      const places = await fetchPlaces()
      setLoadedPlaces(places)
    }
    if(isFocused){
      loadedPlaces()
    }
  }, [isFocused])


  return (
    <PlacesList places={loadedPlaces} />
  )
}

export default AllPlaces
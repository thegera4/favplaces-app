import { useEffect, useState } from 'react'
import { View, Text, ScrollView, Image, StyleSheet, Alert, ToastAndroid
 } from 'react-native'
import OutlinedButton from '../components/UI/OutlinedButton'
import { Colors } from '../constants/colors'
import { fetchPlaceDetails, deletePlace} from '../util/database'

const PlaceDetails = ({route, navigation}) => {
  const [fetchedPlace, setFetchedPlace] = useState()

  const showMapHandler = () => {
    navigation.navigate('Map',{
      initialLat: fetchedPlace.location.lat,
      initialLng: fetchedPlace.location.lng,
    })
  }

  const selectedPlaceId = route.params.placeId;

  useEffect(() => {
    async function loadPlaceData(){
      const place = await fetchPlaceDetails(selectedPlaceId)
      setFetchedPlace(place)
      navigation.setOptions({title: place.title})
    }
    loadPlaceData()
  }, [selectedPlaceId]);

  if(!fetchedPlace){
    return (
      <View style={styles.fallback}>
        <Text>Loading data...</Text>
      </View>
    )
  }

  const deleteHandler = async () => {
    try{
      await deletePlace(selectedPlaceId)
      navigation.goBack()
      ToastAndroid.show('Place deleted!', ToastAndroid.SHORT)
    }catch(err){
      console.log(err)
      ToastAndroid.show('Something went wrong! Try later..', ToastAndroid.SHORT)
    }
  }

  const confirmDeleteHandler = () => {
    Alert.alert(
      'Are you sure?',
      'Do you really want to delete this place?',
      [
        {text: 'No', style: 'default'},
        {text: 'Yes', style: 'destructive', onPress: deleteHandler}
      ]
    )
  }

  return (
    <ScrollView>
      <Image style={styles.image} source={{uri: fetchedPlace.imageUri}}/>
      <View style={styles.locationContainer}>
        <View style={styles.addressContainer}>
          <Text style={styles.address}>{fetchedPlace.address}</Text>
        </View>
        <OutlinedButton
          icon="map"
          onPress={showMapHandler}
        >
          View on map
        </OutlinedButton>
      </View>
      <View style={styles.deleteBtn}> 
        <OutlinedButton
          icon="trash"
          onPress={confirmDeleteHandler}
          border={Colors.error500}
          text={Colors.error500}
        >
          Delete Place
        </OutlinedButton>
      </View>
    </ScrollView>
  )
}

export default PlaceDetails

const styles = StyleSheet.create({
  fallback: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: '35%',
    minHeight: 300,
  },
  locationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressContainer:{
    padding: 20,
  },
  address:{
    color: Colors.primary500,
    textAlign: 'center',
    fontWeight: 'bold',
    fintSize: 16,
  },
  deleteBtn: {
    marginVertical: 50,
  },
  deleteColor: {
    backgroundColor: Colors.error500
  }
})


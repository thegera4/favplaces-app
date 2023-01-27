import { useEffect, useState } from 'react';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { Alert, View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Colors } from '../../constants/colors';
import OutlinedButton from '../UI/OutlinedButton';
import { 
  getCurrentPositionAsync, 
  useForegroundPermissions,
  PermissionStatus 
} from 'expo-location';
import { getAddress, getMapPreview } from '../../util/location';

function LocationPicker({onLocationPicked}){
  const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
  
  const [loading, setLoading] = useState(false);
  const [pickedLocation, setPickedLocation] = useState();

  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused && route.params){
      const mapPickedLocation = route.params && {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng
      }
      setPickedLocation(mapPickedLocation);
    }

  }, [route, isFocused])

  useEffect(() => {
    async function handleLocation(){
      if(pickedLocation){
        try{
          const address = await getAddress(pickedLocation.lat, pickedLocation.lng)
          onLocationPicked({...pickedLocation, address})
        } catch(error){
          console.log(error)
        }
      }
    }
    handleLocation()
  }, [pickedLocation, onLocationPicked])
  //if a function is part of the dependencies array, it will be re-evaluated every time the component re-renders
  //to avoid this, wrap the function in a useCallback hook


  async function verifyPermissions(){
     if(locationPermissionInformation.status === PermissionStatus.UNDETERMINED){
      const permissionResult = await requestPermission()
      return permissionResult.granted
    }
    if(locationPermissionInformation.status === PermissionStatus.DENIED){
      Alert.alert('Permission Denied', 'You need to grant location permissions to use this app.',)
      return false
    }
    return true
  }

  async function getLocationHandler(){
    setLoading(true);

    const hasPermission = await verifyPermissions();
    if(!hasPermission) return;
    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location?.coords.latitude,
      lng: location?.coords.longitude
    })

    setLoading(false);
  }

  function pickOnMapHandler(){
    navigation.navigate('Map');
  }

  let locationPreview = <Text>No location picked yet!</Text>;

  if(pickedLocation){
    locationPreview = (
      <Image
        style={styles.image}
        source={{uri: getMapPreview(pickedLocation.lat, pickedLocation.lng)}}
      />
    )
  }

  return(
    <View>
      <View style={styles.mapPreview}>
        { loading ? 
          <ActivityIndicator size="large" color={Colors.primary500} /> :
          locationPreview 
        }
      </View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate User
        </OutlinedButton>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  )
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
});
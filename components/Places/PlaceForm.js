import { useCallback, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, Alert, ToastAndroid 
} from 'react-native'
import { Colors } from '../../constants/colors'
import ImagePicker from './ImagePicker'
import LocationPicker from './LocationPicker'
import Button from '../UI/Button'
import { Place } from '../../models/place'

const PlaceForm = ({onCreatePlace}) => {
  const [enteredTitle, setEnteredTitle] = useState('')
  const [selectedImage, setSelectedImage] = useState()
  const [selectedLocation, setSelectedLocation] = useState()

  const titleChangeHandler = (text) => {
    setEnteredTitle(text)
  }

  const imageTakenHandler = (imageUri) => {
    setSelectedImage(imageUri)
  }

  const locationPickedHandler = useCallback((location) => {
    setSelectedLocation(location)
  },[])

  const formIsValid = () => {
    if(!enteredTitle || !selectedImage || !selectedLocation) return false
    return true
  }

  const savePlaceHandler = () => {
    if(!formIsValid()){
      Alert.alert('Invalid place', 
      `Please fill all place details: ${!enteredTitle ? 'Missing title' : 
      !selectedImage ? 'Missing image' : 'Missing location'}`, 
      [{text: 'OK'}])
      return
    }
    const newPlace = new Place(enteredTitle, selectedImage, selectedLocation)
    try{
      onCreatePlace(newPlace)
      ToastAndroid.show('Place added successfully', ToastAndroid.SHORT)
    }catch(err){
      ToastAndroid.show('Something went wrong, try again later.', ToastAndroid.LONG)
    }

  }

  return (
    <ScrollView style={styles.form}>
      <View>
        <Text style={styles.label}>Title</Text>
        <TextInput 
          style={styles.input}
          onChangeText={
            titleChangeHandler
          }
          value={enteredTitle}
        />
      </View>
      <ImagePicker onImageTaken={imageTakenHandler} />
      <LocationPicker onLocationPicked={locationPickedHandler} />
      <Button onPress={savePlaceHandler}>Add Place</Button>
    </ScrollView>
  )
}

export default PlaceForm

const styles = StyleSheet.create({
  form: {
    flex: 1,
    padding: 24,
  },
  label:{
    fontWeight: 'bold',
    marginBottom: 4,
    color: Colors.primary500
  },
  input:{
    marginVertical: 8,
    paddingHorizontal: 4,
    paddingVertical: 8,
    fontSize: 16,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary700,
    backgroundColor: Colors.primary100,
  },
})

import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import { 
  launchCameraAsync, 
  useCameraPermissions, //ios permissions
  PermissionStatus //ios permissions
} from 'expo-image-picker'
import { useState } from 'react'
import { Colors } from '../../constants/colors'
import OutlinedButton from '../UI/OutlinedButton'

const ImagePicker = ({onImageTaken}) => {
  const [pickedImage, setPickedImage] = useState()
  //ios permissions
  const [cameraPermissionInformation, requestPermission] = useCameraPermissions()

  //ios permissions
  async function verifyPermissions(){
    if(cameraPermissionInformation.status === PermissionStatus.UNDETERMINED){
      const permissionResult = await requestPermission()
      return permissionResult.granted
    }
    if(cameraPermissionInformation.status === PermissionStatus.DENIED){
      Alert.alert('Permission Denied', 'You need to grant camera permissions to use this app.',)
      return false
    }
    return true
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions() //ios permissions
    if(!hasPermission) return; //ios permissions

      const image = await launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.5
      })
      setPickedImage(image.assets[0].uri)
      onImageTaken(image.assets[0].uri)

  }

  return (
    <View>
      <View style={styles.preview}>
        {!pickedImage ? (
          <Text>No image picked yet.</Text>
        ) : (
          <Image style={styles.image} source={{uri: pickedImage}} />
        )}
      </View>
      <OutlinedButton icon="camera" onPress={takeImageHandler}>
        Take Image
      </OutlinedButton>
    </View>
  )
}

export default ImagePicker

const styles = StyleSheet.create({
  preview: {
    width: '100%',
    height: 200,
    marginVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%',
  }
})
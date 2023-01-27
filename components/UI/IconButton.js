import { Pressable, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const IconButton = ({ icon, size, color, onPress }) => {
  return (
    <Pressable 
      styles={({pressed}) => [styles.button, pressed && styles.pressed]} 
      onPress={onPress}
    >
      <Ionicons name={icon} size={30} color={color} />
    </Pressable>
  )
}

export default IconButton

const styles = StyleSheet.create({
  button:{
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.7,
  }
})
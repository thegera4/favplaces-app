import { StyleSheet, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../constants/colors'

const OutlinedButton = ({onPress, icon, children, border, text}) => {

  const styles = StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingHorizontal: 12,
      margin: 4,
      borderWidth: 1,
      borderColor: border,
    },
    pressed: {
      opacity: 0.5,
    },
    icon: {
      marginRight: 6,
    },
    text: {
      color: text,
    }
  })

  return (
    <Pressable
      style={({pressed}) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Ionicons 
        style={styles.icon}
        name={icon} 
        size={18} 
        color={text} 
      />
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  )
}

export default OutlinedButton

OutlinedButton.defaultProps = {
  border: Colors.primary500,
  text: Colors.primary500,
}
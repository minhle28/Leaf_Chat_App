
import React from 'react'
import { Image, StyleSheet } from 'react-native'

export default function Logo() {
  return(
    <Image source={require('../assets/Images/chat_logo.png')} style={styles.image} />
  ) 
}

const styles = StyleSheet.create({
  image: {
    resizeMode: "contain",
    width: 240,
    height: 240,
    marginBottom: 8,
    alignSelf: 'center',
  },
})
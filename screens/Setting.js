import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'

export default function Setting() {
  return (
    <View style={styles.container}>
        <Text>Sorry. This settings is not available</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
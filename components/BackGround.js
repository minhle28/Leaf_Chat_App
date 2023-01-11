
/* This BackGround just apply Login, SignUp, ResetPassword screens*/

import React from 'react'
import { StyleSheet, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native'


export default function BackGround({ children }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container}>
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: '10%',
    alignItems: 'center',
    paddingTop: 160,
    backgroundColor: '#fff',
  },
})
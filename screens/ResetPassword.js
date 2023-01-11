import React, { useState } from 'react'
import { BackGround, Button, TextInput, BackButton } from '../components'
import { StyleSheet, Text, View, Alert } from 'react-native'
import { emailValidator } from '../helpers/emailValidator'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { sendPasswordResetEmail } from "firebase/auth";
import Toast from '../components/Toast'
import { auth } from "../core/config"


export default function ResetPassword({ navigation }) {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState({ type: '' })

  const sendResetPasswordEmail = () => {
    const emailError = emailValidator(email)
    if (emailError) {
      setEmail({ ...email, error: emailError })
      return
    }
    if (email !== "") {
      sendPasswordResetEmail(auth, email)
        .then(() => setToast({ type: 'Success', message: 'Email has been sent.' }))
        .catch((err) => Alert.alert("Error", err.message));
    }
  }

  return (
    <BackGround>
      <BackButton goBack={navigation.goBack} />
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        label="E-mail address"
        returnKeyType="done"
        value={email}
        onChangeText={(text) => setEmail(text)}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <View style={styles.description}>
        <Text>Please check your email for password reset link.</Text>
      </View>

      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
      >
        <Text style={styles.send_Button}>Send</Text>
      </Button>
      <Toast {...toast} onDismiss={() => setToast({ type: '' })} />
    </BackGround>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    position: 'absolute',
    top: 45 + getStatusBarHeight(),
    left: 20,
  },
  send_Button: {
    color: 'white',
    marginTop: 16,
  },
  description: {
    width: 350,
    alignItems: 'flex-start',
    padding: 20,
    right: 16,

  },
})
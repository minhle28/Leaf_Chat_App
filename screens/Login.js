import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, Alert } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { BackGround, Button, TextInput, BackButton, Toast } from '../components'
import { theme } from '../core/theme'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../core/config"


export default function Login({ navigation }) {
  const [show, setShow] = React.useState(false)
  const [visible, setVisible] = React.useState(true)

  const [error, setError] = useState()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLoginPressed = () => {
    const emailError = emailValidator(email)
    const passwordError = passwordValidator(password)
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => console.log("Login success"))
        .catch((err) => Alert.alert("Email or Password is incorrect.", err.message));
    }
  }

  return (
    <BackGround>
      <BackButton goBack={navigation.goBack} />
      <Text style={styles.title}>Login</Text>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={(text) => setEmail(text)}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"

      />
      <View style={styles.container}>
        <TextInput
          label="Password"
          returnKeyType="done"
          value={password}
          onChangeText={(text) => setPassword(text)}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry={visible}
        />
        <TouchableOpacity style={styles.eye} onPress={() => { setVisible(!visible), setShow(!show) }}>
          <MaterialCommunityIcons
            name={show === false ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <Button
        //loading={loading}
        mode="contained"
        onPress={onLoginPressed}
      >
        <Text style={styles.login_Button}>Login</Text>
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('SignUp')}>
          <Text style={styles.link}> Sign up</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', paddingVertical: 40, width: 310 }}>
        <View style={{ backgroundColor: 'lightgray', height: 1, flex: 1, alignSelf: 'center' }} />
        <Text style={{ color: 'gray', alignSelf: 'center', paddingHorizontal: 10, fontSize: 13 }}>Or continue with</Text>
        <View style={{ backgroundColor: 'lightgray', height: 1, flex: 1, alignSelf: 'center' }} />
      </View>

      <View style={styles.second_row}>
        <TouchableOpacity onPress={() => { }}>
          <Image source={require('../assets/Social/Google.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Toast message={error} onDismiss={() => setError('')} />
    </BackGround>

  )
}

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    position: 'absolute',
    top: 45 + getStatusBarHeight(),
    left: 20,
  },
  login_Button: {
    color: 'white',
  },
  forgotPassword: {
    width: 355,
    alignItems: 'flex-end',
    marginBottom: 25,
    top: 8,
  },
  row: {
    flexDirection: 'row',
    marginTop: 26,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
    padding: 10,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  container: {
    width: 350,
  },
  eye: {
    position: 'absolute',
    right: 20,
    top: 40,
  },
  second_row: {
    flexDirection: 'row',
  },
  icon: {
    height: 52,
    width: 52,
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 50,
    marginHorizontal: 10,
  }
})
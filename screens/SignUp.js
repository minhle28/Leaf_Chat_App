import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, Alert } from 'react-native'
import { BackGround, Button, TextInput, BackButton, Toast } from '../components'
import { theme } from '../core/theme'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import CheckBox from "expo-checkbox"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { nameValidator } from '../helpers/nameValidator'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { updateProfile } from 'firebase/auth';
import { auth, firebase } from "../core/config"
const ImageUrl = "https://static.vecteezy.com/system/resources/previews/008/302/516/non_2x/eps10-green-user-icon-or-logo-in-simple-flat-trendy-modern-style-isolated-on-white-background-free-vector.jpg";

export default function RegisterScreen({ navigation }) {
  const [show, setShow] = React.useState(false)
  const [visible, setVisible] = React.useState(true)

  const [error, setError] = useState()
  const [agree, setAgree] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(ImageUrl)

  const onSignUpPressed = () => {
    const nameError = nameValidator(name)
    const emailError = emailValidator(email)
    const passwordError = passwordValidator(password)
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError })
      setEmail({ ...email, error: emailError })
      setPassword({ ...password, error: passwordError })
      return
    }
    if (auth) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((response) => {
          const uid = response.user.uid
          const data = {
            id: uid,
            email,
            name,
            pic: image,
          };

          const result = firebase.firestore().collection('users')
          result
            .doc(uid)
            .set(data)

          updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: image,
          })
        })
        .catch((error) => {
          alert(error)
        })

        .then(() => console.log('Signup success'))
        .catch((err) => Alert.alert("This email address is already in use.", err.message));

    }
  };

  return (
    <BackGround>
      <BackButton goBack={navigation.goBack} />
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name}
        onChangeText={(text) => setName(text)}
        error={!!name.error}
        errorText={name.error}
      />
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

      <View style={styles.container}>
        <View style={styles.wrapper}>
          <CheckBox
            value={agree}
            onValueChange={() => setAgree(!agree)}
            color={agree ? "#2BDA8E" : undefined}
          />

          <View style={styles.privacy}>
            <Text style={styles.Agree}>I agree to the </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
              <Text style={styles.link}>Privacy</Text>
            </TouchableOpacity>
            <Text> and </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
              <Text style={styles.link}>Terms</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Button
        disabled={!agree}
        mode="contained"
        onPress={onSignUpPressed}
      //style={{ marginTop: 40 }}
      >
        <Text style={styles.signUp_Button}>Sign Up</Text>
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.next}> Login</Text>
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
  wrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    right: '30%',
    padding: 20,
  },
  Agree: {
    fontSize: 13,
    color: theme.colors.secondary,
    marginLeft: 10,
    alignSelf: 'center',
  },
  signUp_Button: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    marginTop: 26,
  },
  next: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  privacy: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  link: {
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
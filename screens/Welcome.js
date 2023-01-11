import React from 'react'
import { Text, StyleSheet, View, SafeAreaView } from 'react-native'
import { Logo, Header, Button, Paragraph } from '../components'


export default function Welcome({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.position}>
        <Logo />
        <Header>Leaf Chat</Header>
        <Paragraph>
          Chat to all your friends with Leaf Chat.
        </Paragraph>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={{ color: 'white' }}> Login </Text>
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('SignUp')}
        >
          Sign Up
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  position: {
    padding: '5%',
    top: '25%',
  }
})

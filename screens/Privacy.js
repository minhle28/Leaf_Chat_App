import React, { useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import { theme } from '../core/theme'
import { ScrollView } from 'react-native-gesture-handler'


export default function Privacy({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity onPress={() => navigation.goBack('SignUp')}>
          <Text style={styles.close}>Close</Text>
        </TouchableOpacity>
        <Text style={{ textAlign: 'center', fontSize: 20, textAlign: 'center', fontWeight: 'bold', paddingBottom: 20 }}> Privacy Policy</Text>
        <ScrollView>
          <Text style={{ paddingHorizontal: 30, paddingBottom: '30%', fontSize: 16 }}>
            Sorry. Privacy Policy not update yet.{'\n\n'}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  close: {
    color: theme.colors.primary,
    fontSize: 18,
    left: 15,
    paddingVertical: 15,
  },
})
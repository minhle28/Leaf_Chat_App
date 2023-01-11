import React, { useState, useEffect } from 'react'
import { auth, firebase, storage} from '../core/config';
import { signOut } from 'firebase/auth';
import { View, Text, ImageBackground, Image, TouchableOpacity, Alert} from 'react-native';
import { DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CustomDrawer = props => {
  const [image, setImage] = useState(null)
  const [profile, setProfile] = useState('')
  const [uploading, setUploading] = useState('')

  const onSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  useEffect(() => {
    firebase.firestore().collection('users').doc(auth.currentUser.uid).get().then(docSnap => {
      setProfile(docSnap.data())
    })
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result);
      uploadImage(result)
    }
  };

  const uploadImage = async (image) => {
    setUploading(true)
    const response = await fetch(image.assets[0].uri)
    const blob = await response.blob()
    const file = image.assets[0].uri.substring(image.assets[0].uri.lastIndexOf('/')+1)
    var ref = firebase.storage().ref().child(file).put(blob)

    try {
      await ref
    } catch (e) {
      console.log(e)
    }
    setUploading(false);
    Alert.alert('Uploaded. Please reload the page.');

    //Get URL link from storage and update profile
    firebase.storage().ref().child(file).getDownloadURL().then((url) => {
      setImage(url);
      const data = {
        id: auth.currentUser.uid,
        email: auth.currentUser.email,
        name: auth.currentUser.displayName,
        pic: url,
      };
      const res = firebase.firestore().collection('users')
      res
        .doc(auth.currentUser.uid)
        .set(data)
  
      updateProfile(auth.currentUser, {
          photoURL: url,
        })
    })
  }

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: 'white' }}>
        <ImageBackground style={{ padding: 20, backgroundColor: 'white' }}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={{ uri: profile.pic}}
                style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 20 }}
              />
              <Ionicons 
                name="cloud-upload-outline" size={22}
                style={{ position: 'absolute', left: 70, marginTop: 60 }}
              />
            </TouchableOpacity>
          <Text
            style={{
              color: 'black',
              fontWeight: 'bold',
              fontSize: 18,
              marginBottom: 5,

            }}>
            {auth.currentUser.displayName}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={{
                color: 'black',
                marginRight: 5,
              }}>
              Email: {auth.currentUser?.email}
            </Text>
          </View>
        </ImageBackground>
        <View style={{ borderTopWidth: 1, borderTopColor: '#ccc' }} />
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 30, borderTopWidth: 1, borderTopColor: '#ccc' }}>
        <TouchableOpacity onPress={onSignOut} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 15,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;


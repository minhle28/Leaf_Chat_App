import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { GiftedChat, Send, Bubble } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot
} from 'firebase/firestore';
import { auth, database, firebase } from '../core/config';
import { useNavigation } from "@react-navigation/native";


export default function Global() {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState('')
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Image source={require('../assets/Images/global.jpg')} size={30}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            marginRight: 20,
          }} />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    firebase.firestore().collection('users').doc(auth.currentUser.uid).get().then(docSnap => {
      setProfile(docSnap.data())
    })
  }, [])

  useLayoutEffect(() => {

    const collectionRef = collection(database, 'global');
    const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
      console.log('querySnapshot unsusbscribe');
      setMessages(
        querySnapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return unsubscribe;
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, 'global'), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <IconButton icon='send-circle' size={32} color='#2BDA8E' />
        </View>
      </Send>
    );
  }

  function renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2BDA8E'
          }
        }}
        textStyle={{
          right: {
            color: '#fff'
          }
        }}
        imageStyle={{
          width: 150,
          height: 150,
          borderRadius: 10,
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <GiftedChat
        messages={messages}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        onSend={messages => onSend(messages)}
        alwaysShowSend
        renderSend={renderSend}
        renderBubble={renderBubble}
        messagesContainerStyle={{
          backgroundColor: '#fff'
        }}
        textInputStyle={{
          backgroundColor: '#fff',
          borderRadius: 20,
        }}
        user={{
          _id: auth?.currentUser?.email,
          name: auth?.currentUser?.displayName,
          avatar: profile.pic,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendingImage: {
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 13,
    marginHorizontal: 10,
  }
})
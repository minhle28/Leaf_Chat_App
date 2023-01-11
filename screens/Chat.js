import React, { useState, useEffect} from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { GiftedChat, Send, Bubble, } from 'react-native-gifted-chat';
import { IconButton } from 'react-native-paper';
import { auth, firebase } from '../core/config';
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const route = useRoute()
  const { uid, avatar } = route.params;
  const [profile, setProfile] = useState('')
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Image source={{ uri: avatar }} size={30}
          style={{
            width: 40,
            height: 40,
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

  useEffect(() => {
    const docid = uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + uid : uid + "-" + auth.currentUser.uid
    const querySnapshot = firebase.firestore()
      .collection('chats')
      .doc(docid)
      .collection('message')
      .orderBy('createdAt', 'desc')
    querySnapshot.onSnapshot(querySnapShot => {
      const allMessages = querySnapShot.docs.map(docSnap => {
        const data = docSnap.data()
        return {
          ...docSnap.data(),
          createdAt: new Date(),
        }
      })
      setMessages(allMessages)
    })
  }, [])

  const onSend = (messageArray) => {
    const msg = messageArray[0]
    const mymsg = {
      ...msg,
      sentBy: auth.currentUser.uid,
      sentTo: route.params.uid,
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
    const docid = uid > auth.currentUser.uid ? auth.currentUser.uid + "-" + uid : uid + "-" + auth.currentUser.uid
    firebase.firestore()
      .collection('chats')
      .doc(docid)
      .collection('message')
      .add({
        ...msg,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
  }


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
          borderRadius: 30,
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
    alignItems: 'center',
  },
})
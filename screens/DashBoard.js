import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo } from '@expo/vector-icons';
import { theme } from "../core/theme";
import { auth, database, firebase } from '../core/config';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DashBoard = () => {
    const navigation = useNavigation();
    const [users, setUsers] = useState(null)
    const getUsers = async () => {
        const querySanp = await firebase.firestore().collection('users').where('id', '!=', auth.currentUser.uid).get()
        const allusers = querySanp.docs.map(docSnap => docSnap.data())
        // console.log(allusers)
        setUsers(allusers)
    }

    useEffect(() => {
        getUsers()
    }, [])
    

    const RenderCard = ({ item }) => {
        const [latestMessage, setLatestMessage] = useState("");

        useEffect(() => {
            firebase.firestore()
                .collection('chats')
                .doc(item.id)
                .collection('message')
                .orderBy('timestamp', 'desc')
                .limit(1)
                .get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        setLatestMessage("You are now connected to Leaf Chat.");                        
                    } else {
                        setLatestMessage(snapshot.docs[0].data().text);
                    }
                });
        }, [item.id]);

        return (
            <TouchableOpacity onPress={() => navigation.navigate('Chat', { userName: item.name, uid: item.id, avatar: item.pic })}>
                <View style={styles.mycard}>
                    <Image source={{ uri: item.pic }} style={styles.img} />
                    <View>
                        <Text style={styles.name}>
                            {item.name}
                        </Text>
                        <Text style={styles.email}>
                            {/*{item.email}*/}
                            {latestMessage}

                        </Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={24} color='grey'
                        style={{
                            alignSelf: 'center',
                            position: 'absolute',
                            marginLeft: '90%',
                        }} />
                </View>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity>
                    <Ionicons name="add-outline" size={24} theme={theme.gray}
                        style={{
                            width: 30,
                            height: 30,
                            marginRight: 20,
                        }} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);



    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={({ item }) => { return <RenderCard item={item} /> }}
                //keyExtractor={(item)=>item.uid}
                keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.global}>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Global")}
                    style={styles.chatButton}
                >
                    <Entypo name="chat" size={40} color='#2BDA8E' />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DashBoard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    global: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    chatButton: {
        backgroundColor: theme.primary,
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: theme.primary,
        marginRight: 20,
        marginBottom: 50,
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 30,
        source: require('../assets/Images/user.png')
    },
    name: {
        top: 10,
        fontSize: 16,
        marginLeft: 15,
        fontWeight: 'bold',
    },
    email: {
        top: 14,
        fontSize: 14,
        marginLeft: 15,
        color: 'grey',
    },
    mycard: {
        flexDirection: "row",
        margin: 3,
        padding: 4,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: 'grey'
    },
});
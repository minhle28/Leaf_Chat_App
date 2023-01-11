import React, { useState, createContext, useContext, useEffect } from 'react';
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack'
import { theme } from './core/theme'
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator, Text } from 'react-native';
import { auth } from "./core/config"
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './components/CustomDrawer'
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  DashBoard,
  Login,
  Privacy,
  ResetPassword,
  SignUp,
  Terms,
  Welcome,
  Chat,
  Setting,
  Global,
} from './screens/Index'

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});


const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

const Drawer = createDrawerNavigator();
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerTintColor: 'black',
        drawerActiveBackgroundColor: '#2BDA8E',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -15,
          fontSize: 15,
        }
      }}>
      <Drawer.Screen name="Home" component={DashBoard}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen name="Global Chat" component={Global}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="globe-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen name="Setting" component={Setting}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function ChatStack() {
  return (
    <Stack.Navigator defaultScreenOptions={DashBoard}>
      <Stack.Screen name='DashBoard' component={DrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name='Global' component={Global} options={{ headerBackTitleVisible: false, headerTintColor: 'black', }} />
      <Stack.Screen name='Chat' component={Chat} options={({ route }) => ({ title: route.params.userName, headerBackTitleVisible: false, headerTintColor: 'black', })} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Provider theme={theme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='SignUp' component={SignUp} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Privacy" component={Privacy}
          options={{
            //gestureDirection: 'vertical',
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
        <Stack.Screen name="Terms" component={Terms}
          options={{
            //gestureDirection: 'vertical',
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
      </Stack.Navigator>
    </Provider>
  );
}

function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async authenticatedUser => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}

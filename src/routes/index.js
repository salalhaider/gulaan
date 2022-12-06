import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Screen from '../import/index';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { store } from "../redux/index"
import { Lpurple } from '../Constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
// console.log("--------------------------------------------------");
console.log("--------------------------------------------------");
console.log("--------------------tailor data------------------------------");
console.log(store.getState());
console.log("--------------------------------------------------");
// console.log("--------------------------------------------------");
// console.log("------------------------- user data-------------------------");
// console.log("--------------------------------------------------");
// console.log(store.getState().userdata);
function MyUserTabs() {

  return (
    <Tab.Navigator

      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Customize') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          } else if (route.name === 'Requests') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },

      })}
      tabBarOptions={{
        activeTintColor: 'green',
        inactiveTintColor: 'white',
        style: { backgroundColor: Lpurple },


      }}

    >
      <Tab.Screen name="Home" component={Screen.HOME}
      // options={{
      //   title: ''
      // }}
      />
      <Tab.Screen name="Customize" component={Screen.CUSTOMIZE} />
      <Tab.Screen name="Requests" component={Screen.REQUEST} />
      <Tab.Screen name="History" component={Screen.HISTORY} />
      <Tab.Screen name="Profile" component={Screen.PROFILE} />
    </Tab.Navigator >
  );

}
function MyTailorTabs() {

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Customize') {
            iconName = focused ? 'shirt' : 'shirt-outline';
          } else if (route.name === 'Requests') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'green',
        inactiveTintColor: 'white',
        style: { backgroundColor: Lpurple },
      }}>
      <Tab.Screen name="Home" component={Screen.TAILORHOME} />
      {/* <Tab.Screen name="Customize" component={Screen.CUSTOMIZE} /> */}
      <Tab.Screen name="Requests" component={Screen.TAILORREQUEST} />
      {/* <Tab.Screen name="History" component={Screen.HISTORY} /> */}
      <Tab.Screen name="Profile" component={Screen.TAILORPROFILE} />
    </Tab.Navigator>
  );

}

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="SIGNIN">
        <Stack.Screen name="SIGNIN" component={Screen.SIGNIN} />
        <Stack.Screen name="SIGNUP" component={Screen.SIGNUP} />
        <Stack.Screen name="TAILORSIGNIN" component={Screen.TAILORSIGNIN} />
        <Stack.Screen name="TAILORSIGNUP" component={Screen.TAILORSIGNUP} />
        <Stack.Screen name="USERDASHBOARD" component={MyUserTabs} />
        <Stack.Screen name="TAILORDASHBOARD" component={MyTailorTabs} />
        <Stack.Screen name="MAP" component={Screen.MAP} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const mapStateToProps = state => {
  return {
    userdata: state.userdata,
    tailordata: state.tailordata,
  }
}
export default connect(mapStateToProps)(Routes)

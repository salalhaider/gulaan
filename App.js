import React, { Component } from 'react';
import { useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,

} from 'react-native';
import Routes from "./src/routes/index"
import SplashScreen from 'react-native-splash-screen';
import { store } from "./src/redux/index"
import { Provider } from 'react-redux'
import { Dpurple, Mpurple } from './src/Constants/index'
import { Header } from 'react-native-elements'
import { Lpurple } from './src/Constants/index'
import { Image } from 'react-native';


class App extends React.Component {
  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
  }

  render() {
    return (
      <Provider store={store}>
        <Header
          placement="left"
          leftComponent={<Image source={require('./src/media/cover.png')} style={{ width: 100, height: 50 }} />}
          // centerComponent={{ text: 'Gulaan', style: { color: '#fff', fontSize: 26 } }}
          // rightComponent={{ icon: 'home', color: '#fff' }}
          backgroundColor={Lpurple}
        />

        <StatusBar backgroundColor={Dpurple} hidden={true} />
        <Routes />
      </Provider>
    );
  }
};


export default App;

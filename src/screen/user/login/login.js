import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
import Input from '../../../resuseableComponents/generic/input';
import CustomButton from '../../../resuseableComponents/generic/button';
import JsonServer from '../../../api/server';
import { connect } from 'react-redux';
import { Mpurple, Lpurple, White, Red, Dpurple } from '../../../Constants';
import axios from 'axios';
import { Header } from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker'
import RNFetchBlob from 'react-native-fetch-blob'


class login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // email: 'ddd@gmail.com',
      // password: '12345678',
      // email: 't@t.com',
      // password: 'admin1234',
      email: 'a@a.com',
      password: 'admin1234',
      // email: '',
      // password: '',
    };
  }
  // async componentDidMount() {
  //   try {
  //     const res = await DocumentPicker.pick({
  //       type: [DocumentPicker.types.images],
  //     })
  //     console.log(
  //       res[0].uri,
  //       // res.type, // mime type
  //       // res.name,
  //       // res.size,
  //     )
  //     RNFetchBlob.fs.stat(res[0].uri)
  //       .then((stats) => { console.log(stats.path) })
  //       .catch((err) => { })

  //   } catch (err) {
  //     if (DocumentPicker.isCancel(err)) {
  //       // User cancelled the picker, exit any dialogs or menus and move on
  //     } else {
  //       throw err
  //     }
  //   }
  // }

  login() {
    // alert("wait")
    if (this.state.email === '' || this.state.password === '') {
      alert('fields cannot be empty');
    }
    else {
      ToastAndroid.show("Loading...", ToastAndroid.LONG);

      JsonServer
        .post('user/login', {
          email: this.state.email,
          password: this.state.password,
        })
        .then(response => {
          console.log(response.data);
          this.props.setUserData((response.data.data));
          this.props.navigation.navigate('USERDASHBOARD');
        })
        .catch(error => console.log(error));
      // .catch(error => ToastAndroid.show("Something Went Wrong!", ToastAndroid.SHORT));
    }

  }
  render() {
    return (
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <ImageBackground source={{ uri: "https://previews.123rf.com/images/vectorchoice/vectorchoice1605/vectorchoice160500095/57692765-vector-abstract-upholstery-dark-green-background-can-be-used-in-cover-design-book-design-website-bac.jpg" }}
          style={styles.main}>
          <KeyboardAvoidingView style={styles.innerView}>
            {/* <Header
              backgroundColor={Dpurple}
              placement="left"
              // leftComponent={{ icon: 'menu', color: '#fff' }}
              centerComponent={{ text: 'USER LOGIN', style: { color: White, fontSize: 22 } }}
            // rightComponent={{ icon: 'home', color: '#fff' }}
            /> */}
            {/* <Image
              // source={{
              //   uri:
              //     'https://logos.textgiraffe.com/logos/logo-name/Gulan-designstyle-summer-m.png',
              // }}
              source={require('../../../media/cover.png')}
              style={{ width: "100%", height: 150 }}
            /> */}
            <Text style={{ color: White, fontSize: 36, fontWeight: 'bold' }}>User Login</Text>
            <View
              style={{
                backgroundColor: White,
                paddingVertical: 10,
                width: "100%",
                height: '100%',
                alignItems: 'center',
                borderTopRightRadius: 25,
                borderTopLeftRadius: 25,
                marginTop: 70

              }}>
              {/* <Text style={{ fontSize: 26, fontWeight: 'bold', color: White }}>User SignIn</Text> */}
              <Input
                placeholder="Email"
                onChangeText={uemail => this.setState({ email: uemail })}
              />
              <Input
                placeholder="Password"
                onChangeText={upass => this.setState({ password: upass })}
                issecure={true}
              />
              <CustomButton buttontext="Login" onPress={() => this.login()} />
              <Text
                style={{ marginTop: 20, }}
                onPress={() => this.props.navigation.navigate('SIGNUP')}>
                Don't have an account? SignUp here
              </Text>
              <CustomButton buttontext="Login as Tailor" onPress={() => this.props.navigation.navigate("TAILORSIGNIN")} style={{ backgroundColor: Dpurple }} />

            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  main: {
    backgroundColor: 'transparent',
    flexGrow: 1,
    // paddingVertical: 10,
    // paddingHorizontal: 10,
  },
  innerView: {
    flex: 1,
    backgroundColor: Mpurple,
    alignItems: 'center',
    paddingVertical: 10,
  },
});
const mapStateToProps = state => {
  return {
    userdata: state.userdata,
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setUserData: data => {
      dispatch({ type: 'USER_DATA', userdata: data });
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(login);

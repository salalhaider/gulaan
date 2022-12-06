import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  ImageBackground
} from 'react-native';
import Input from '../../../resuseableComponents/generic/input';
import CustomButton from '../../../resuseableComponents/generic/button';
import JsonServer from '../../../api/server';
import axios from 'axios';
import { Mpurple, Lpurple, White, Red, Dpurple } from '../../../Constants';
import { Header } from 'react-native-elements';
export default class signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      contact: null,
      city: '',
      experience: '',
      average_rate: null,
      address: '',
      lat: this.props.route.params?.lat,
      long: this.props.route.params?.long,
    };
  }
  signup() {
    JsonServer
      .post('tailor/signup', {
        first_name: this.state.firstname,
        last_name: this.state.lastname,
        email: this.state.email,
        password: this.state.password,
        contact: this.state.contact,
        city: this.state.city,
        experience: this.state.experience,
        average_rate_per_stitching: this.state.average_rate,
        address: this.state.city,
        lang: (this.props.route.params.long),
        lat: (this.props.route.params.lat),
      })
      .then(response => {
        if (response.data.success) {
          alert('SignUp successfully, login to continue');
          this.props.navigation.navigate('TAILORSIGNIN');
        }
        else {
          alert(JSON.stringify(response.data.message))

        }
      })
      .catch(error => console.log(error.response));
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground source={{ uri: "https://previews.123rf.com/images/vectorchoice/vectorchoice1605/vectorchoice160500095/57692765-vector-abstract-upholstery-dark-green-background-can-be-used-in-cover-design-book-design-website-bac.jpg" }}
          style={styles.main}>
          <KeyboardAvoidingView style={styles.innerView}>
            {/* <Text>{JSON.stringify(this.props.route.params)}</Text>
            <Text>{JSON.stringify(this.props.lat)}</Text>
            <Text>{JSON.stringify(this.props.long)}</Text> */}
            {/* <Header
              backgroundColor={Dpurple}
              placement="left"
              // leftComponent={{ icon: 'menu', color: '#fff' }}
              centerComponent={{ text: 'TAILOR REGISTRATION', style: { color: White, fontSize: 22 } }}
            // rightComponent={{ icon: 'home', color: '#fff' }}
            />
            <Image
              // source={{
              //   uri:
              //     'https://logos.textgiraffe.com/logos/logo-name/Gulan-designstyle-summer-m.png',
              // }}
              source={require('../../../media/cover.png')}
              style={{ width: '100%', height: 150 }}
            /> */}
            <Text style={{ color: White, fontSize: 36, fontWeight: 'bold' }}>Tailor Register</Text>
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
              {/* <Text style={{ fontSize: 26, fontWeight: 'bold' }}>
                Tailor SignUp
              </Text> */}
              <Input
                placeholder="First Name"
                onChangeText={fname => this.setState({ firstname: fname })}
              />
              <Input
                placeholder="Last Name"
                onChangeText={lname => this.setState({ lastname: lname })}
              />
              <Input
                placeholder="Email"
                onChangeText={uemail => this.setState({ email: uemail })}
              />
              <Input
                placeholder="Password"
                onChangeText={upass => this.setState({ password: upass })}
                issecure={true}
              />
              <Input
                placeholder="Contact"
                onChangeText={ucontact => this.setState({ contact: ucontact })}
                type="numeric"
              />
              <Input
                placeholder="City"
                onChangeText={ucity => this.setState({ city: ucity })}
              />
              <Input
                placeholder="Experience"
                onChangeText={uexp => this.setState({ experience: uexp })}
              />
              <Input
                placeholder="Average rate per Stiching"
                onChangeText={uaverage => this.setState({ average_rate: uaverage })}
                type="numeric"
              />
              {/* <Input
                placeholder="Address"
                onChangeText={uaddress => this.setState({ address: uaddress })}
              /> */}
              <CustomButton buttontext="Get Exact Location" onPress={() => this.props.navigation.navigate('MAP')} />
              <CustomButton buttontext="Register" onPress={() => this.signup()} />
              <Text
                style={{ marginTop: 20, }}
                onPress={() => this.props.navigation.navigate('TAILORSIGNIN')}>
                Don't have an account? Login here
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  main: {
    // backgroundColor: 'green',
    flex: 1,
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

import axios from 'axios';
import moment from 'moment';
import React, { Component } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, Linking } from 'react-native';
import Ionicon from "react-native-vector-icons/Ionicons"
import { connect } from 'react-redux';
import { Avatar } from 'react-native-elements';
import ThemedListItem from 'react-native-elements/dist/list/ListItem';
import Modal from 'react-native-modal'
import { White } from '../../Constants';
import Input from '../generic/input'
import CustomButton from '../generic/button'
import jsonserver from '../../api/server'

class suitCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      backgroundImageUri: "https://lh3.googleusercontent.com/proxy/h7gPZ0xAS7Jq-n1q4torwcsSbCgInwqHTNRSsq-FFanmfQ1Ns560TdOqwZq97lL3gG1z8ttXE47IpFJ2lsM24YWyLtos25bZ7Fc1I6y7WR6hBFPku-_lmm7D-hK5Pp5zCTC2DOv0jQgvqtQOg85sis1pInQXBSLeXA",
      data: [],
      heartState: this.props.heartState,
      date: "",
      openModal: false,
      amount: 0,
      days: 0,
      request: false,
      isAccount: false
    };

  }
  handleFav() {
    if (this.state.heartState === "heart-outline") {
      axios.put(`http://peaceful-cliffs-40451.herokuapp.com/api/user/add_favorite_post/${this.state.data._id}/${(this.props.userdata)._id}`)
        .then((response) => {
          var temp = []
          temp = this.props.userAllFavoriteData
          temp.push(this.state.data)
          var tempallposts = this.props.userallposts;

          tempallposts.map((x) => {
            if (x._id === this.state.data._id) {
              x.heartState = "heart"
            }
          })
          this.props.set_user_all_posts(tempallposts)
          this.props.set_user_all_fav_suit(temp)
          this.setState({ heartState: "heart" })
        })
        .catch((error) => {
          alert("error adding fav")
        })
    }
    else {
      let id = this.state.data._id
      if (typeof this.state.data.post_id != 'undefined') {
        id = this.state.data.post_id
      }
      axios.put(`http://peaceful-cliffs-40451.herokuapp.com/api/user/remove_favorite_post/${id}/${(this.props.userdata)._id}`)
        .then((response) => {
          var temp = []
          temp = this.props.userAllFavoriteData
          temp.splice(temp.findIndex((x) => { return x.post_id == this.state.data._id }), 1)
          this.props.set_user_all_fav_suit(temp)
          var tempallposts = this.props.userallposts;

          tempallposts.map((x) => {
            if (x._id === this.state.data._id) {
              x.heartState = "heart-outline"
            }
          })
          this.props.set_user_all_posts(tempallposts)
          this.setState({ heartState: "heart-outline" })
        })
        .catch((error) => {
          alert("error removing fav")
        })
    }

  }

  componentDidMount() {
    if (typeof this.props.item !== "undefined") {
      this.setState({ data: this.props.item })
      this.setState({ backgroundImageUri: this.props.item.images[0] })

    }
  }
  async creditCardInformation() {
    const res1 = await jsonserver.put(`tailor/stripe_account/${this.props.tailordata._id}`, {
      email: this.state.emailForStripe
    })
    if (res1.data.redirect) {
      // alert(res1.data.redirect)
      Linking.openURL(res1.data.redirect)
      this.toggleModal()
      this.setState({ isAccount: true })
      return
    }
    alert(JSON.stringify(res1.data))
  }
  _RenderModal = () => {

    // let isAccount = this.props.tailordata.stripe_account_id == "" ? false : true

    if (!this.state.isAccount)

      return (
        <Modal isVisible={this.state.openModal} onBackdropPress={this.toggleModal}>
          <View style={{ backgroundColor: White, paddingHorizontal: 10, paddingBottom: 20 }}>
            <Text style={{ fontSize: 24 }}>Account Information before requesting</Text>
            <Input placeholder="Enter Registred Email" onChangeText={(data) => this.setState({ emailForStripe: data })} style={{ width: '100%' }} />
            <CustomButton buttontext="Submit" style={{ width: '100%' }} onPress={() => this.creditCardInformation(this)} />
          </View>
        </Modal>
      )
    else
      return (
        <Modal isVisible={this.state.openModal} onBackdropPress={this.toggleModal}>
          <View style={{ backgroundColor: White, paddingHorizontal: 10, paddingBottom: 20 }}>
            <Text style={{ fontSize: 26 }}>Information before requesting</Text>
            <Input placeholder="Amount you will charge" onChangeText={(data) => this.setState({ amount: data })} style={{ width: '100%' }} type="numeric" />
            <Input placeholder="Days you will take" onChangeText={(data) => this.setState({ days: data })} style={{ width: '100%' }} type="numeric" />
            {/* <Input placeholder="Expiry Month" onChangeText={(data) => this.setState({ length: data })} style={{ width: '100%' }} />
          <Input placeholder="Expiry Year" onChangeText={(data) => this.setState({ length: data })} style={{ width: '100%' }} /> */}
            <CustomButton buttontext="Request" style={{ width: '100%' }} onPress={this.requestAUser.bind(this)} />
          </View>
        </Modal>
      )
  }
  toggleModal = () => {
    this.setState({ openModal: !this.state.openModal })
  }
  requestAUser = () => {
    // alert(this.state.amount + ' ' + this.state.days)
    this.toggleModal()
    if (this.state.amount == "" || this.state.days == "") {
      alert("Amount and days both must be filled before requesting")
      return
    }
    // this.setState({ request: !this.state.request })
    // this.toggleModal()

    jsonserver.post('tailor/bidingRequest', {

      post_id: this.state.data._id,
      tailor_id: this.props.tailordata._id,
      user_id: this.state.data.user_id,
      amount: this.state.amount,
      days: this.state.days

    }).then(res => {
      this.setState({ request: !this.state.request })
    })
      .catch(err => this.setState({ request: !this.state.request }))
  }


  render() {
    return (
      <View style={{
        width: '95%',
        marginVertical: 5,
        height: 470,
        borderWidth: 0,
        borderRadius: 25,
        paddingVertical: 20,
        paddingHorizontal: 10,
        overflow: 'hidden',
        elevation: 10,

      }}>
        {/* <Text style={{ fontSize: 20 }}>{JSON.stringify(this.props.tailordata)}</Text> */}
        {/* <Text>{console.log(this.props.item.images[0])}</Text> */}
        <this._RenderModal />
        <View style={{ width: "100%", height: "100%", backgroundColor: "white", borderRadius: 25 }}>
          <View style={{ flexDirection: "row", marginVertical: 10, marginLeft: 10 }}>

            <Avatar
              rounded
              source={{
                uri:
                  this.state.backgroundImageUri,
              }}
            />
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 2 }}>
                <Text style={{ marginLeft: 10, color: "silver", width: '68%' }}>
                  {this.state.data.first_name} {this.state.data.last_name}
                </Text>
                {this.props.customCardForTailor &&
                  <TouchableOpacity onPress={this.toggleModal}>
                    <Text style={{ color: 'blue' }}>
                      {!this.state.request ?
                        "Request"
                        :
                        "Requested"
                      }
                    </Text>
                  </TouchableOpacity>
                }
              </View>
              <Text style={{ color: "silver", marginLeft: 10 }}>{moment(this.state.data.date).fromNow()}</Text>
            </View>
          </View>
          <Text
            style={{
              width: "95%",

              marginLeft: 10,
              fontSize: 16
            }}>

            {this.state.data.description}

          </Text>
          <Image
            source={{
              uri: this.props.item?.images[0]
            }}

            style={{ width: "100%", height: 350, borderRadius: 25, marginTop: 20, borderBottomLeftRadius: 25 }}

          />
          <TouchableOpacity
            onPress={() => {
              this.handleFav()
            }}
            style={{ position: "absolute", marginLeft: "90%", marginTop: "2%", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
            {this.props.canFav && (
              <Ionicon name={this.state.heartState} size={30} color="red" />
            )}
          </TouchableOpacity>
        </View>


      </View >
    );
  }
}
const mapStateToProps = state => {
  return {
    userdata: state.userdata,
    userAllFavoriteData: state.userfavsuit,
    userallposts: state.userallposts,
    tailordata: state.tailordata
  }
}
const mapDispatchToProps = dispatch => {
  return {
    set_user_all_fav_suit: (data) => { dispatch({ type: "USER_FAV_SUIT", userfavsuit: data }) },
    set_user_all_posts: (data) => { dispatch({ type: "USER_ALLPOSTS", userallposts: data }) },

  }
}
export default connect(mapStateToProps, mapDispatchToProps)(suitCard)
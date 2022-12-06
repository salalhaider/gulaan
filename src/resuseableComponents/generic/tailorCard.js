import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicon from "react-native-vector-icons/Ionicons"
import { connect } from 'react-redux';
import jsonserver from '../../api/server'
import Modal from 'react-native-modal'
import { ScrollView } from 'react-native-gesture-handler';
import Input from '../generic/input'
import { White } from '../../Constants';
import CustomButton from '../generic/button'
class tailorCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Dress_MET_69.2.1_front_CP4.jpg/220px-Dress_MET_69.2.1_front_CP4.jpg",
      heartState: this.props.heartState,
      data: "",
      requestAppointment: this.props.requested,
      complainModal: false,


    };
  }
  componentDidMount() {
    if (this.props.item.profile_photo != "")
      this.setState({ image: this.props.item.profile_photo })
    if (typeof this.props.item !== "undefined") {
      this.setState({ data: this.props.item })

    }
  }
  handleFav() {
    if (this.state.heartState === "heart-outline") {
      jsonserver.put(`user/add_favorite_tailor/${this.state.data._id}/${(this.props.userdata)._id}`)
        .then((response) => {
          var temp = []
          temp = this.props.userfavtailor
          temp.push(this.state.data)

          this.props.set_user_all_fav_tailor(temp.reverse())
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
      jsonserver.put(`user/remove_favorite_tailor/${id}/${(this.props.userdata)._id}`)
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
  requestATailor = async () => {
    // alert(JSON.stringify(this.props.userdata._id))
    this.setState({ requestAppointment: !this.state.requestAppointment })
    jsonserver.post('tailor/bidingRequest', {
      tailor_id: this.props.item._id,
      user_id: this.props.userdata._id

    }).then(res => { })
      .catch(err => this.setState({ requestAppointment: !this.state.requestAppointment }))
  }

  toggleComplainModal = () => {

    this.setState({ complainModal: !this.state.complainModal })
  }

  complainATailor = () => {
    this.toggleComplainModal()
    setTimeout(() => {

      alert(' Succesfully complained')
    }, 1000);
  }

  render() {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Modal isVisible={this.state.complainModal} onBackdropPress={this.toggleComplainModal}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ height: 300, width: 350, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                <Text>Make a Complain</Text>
                <Input placeholder="What is the complain" style={{ width: 300, height: 100 }} />
                <CustomButton buttontext="Submit" onPress={() => this.complainATailor()} style={{ backgroundColor: 'red', width: 300 }} />
              </View>
            </View>
          </Modal>

          {/* <Text>{JSON.stringify(this.props.item)}</Text> */}
          <TouchableOpacity
            onPress={() => {
              this.handleFav()

            }}
            style={{ position: "absolute", marginLeft: "70%", marginTop: "2%", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 50, alignItems: "center", justifyContent: "center", zIndex: 10, }}
          >
            {this.props.canFav && (
              <Ionicon name={this.state.heartState} size={30} color="red" />
            )}

          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.toggleComplainModal()
            }}
            style={{ position: "absolute", marginLeft: "90%", marginTop: "2%", backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 50, alignItems: "center", justifyContent: "center", zIndex: 10, }}
          >
            {this.props.canFav && (
              <Ionicon name={"warning-outline"} size={30} color="red" />
            )}

          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onPress}>
            <Image
              source={{
                uri: this.state.image

              }}
              style={{
                height: '70%',
                width: '100%',
              }}
            />
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <Text style={styles.text}>Name: </Text>
              <Text style={{ width: '43%', }}>
                {/* {JSON.stringify(this.props)} */}
                {this.props.item.first_name} {this.props.item.last_name}
              </Text>
              <TouchableOpacity onPress={this.requestATailor}>
                <Text style={{ color: 'blue' }}>
                  {/* {JSON.stringify(this.props.item.requested)} */}
                  {!this.state.requestAppointment ?
                    "Request Appointment" :
                    "Requested"
                  }
                </Text>
              </TouchableOpacity>
            </View>
            {this.props.showData && (
              <>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.text}>Average Stichting Rat: </Text>
                  <Text>{this.props.item.average_rate_per_stitching}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.text}>Experience: </Text>
                  <Text>{this.props.item.experience}</Text>
                </View>
              </>
            )}
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.text}>Address: </Text>
              <Text>{this.props.item.address}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: "100%",
    height: 320,
    elevation: 3,
    backgroundColor: '#fff',
    // shadowColor:"#333",
    // shadowOpacity:0.3,
    // shadowRaduis:2,
    marginHorizontal: 1,
    marginVertical: 6,
    // paddingBottom: 80
  },
  cardContent: {
    marginHorizontal: 18,
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    // backgroundColor: 'green',
    width: '20%'
  },
});
const mapStateToProps = state => {
  return {
    userdata: state.userdata,
    userAllFavoriteData: state.userfavsuit,
    userallposts: state.userallposts,
    userfavtailor: state.userfavtailor,

  }
}
const mapDispatchToProps = dispatch => {
  return {
    set_user_all_fav_suit: (data) => { dispatch({ type: "USER_FAV_SUIT", userfavsuit: data }) },
    set_user_all_posts: (data) => { dispatch({ type: "USER_ALLPOSTS", userallposts: data }) },
    set_user_all_fav_tailor: (data) => { dispatch({ type: "USER_FAV_TAILOR", userfavtailor: data }) },


  }
}
export default connect(mapStateToProps, mapDispatchToProps)(tailorCard)
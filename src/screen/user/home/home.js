import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  // Alert,
} from 'react-native';
import ImageSlider from '../../../resuseableComponents/generic/ImageSlider';
import CustomButton from '../../../resuseableComponents/generic/button';
import Input from '../../../resuseableComponents/generic/input';
import SuitCard from '../../../resuseableComponents/userhome/suitCard';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import TailorCard from '../../../resuseableComponents/generic/tailorCard';
import Ionicon from "react-native-vector-icons/Ionicons"
import { connect } from 'react-redux';
import SearchBar from "../../../resuseableComponents/generic/serachbar"
import jsonserver from '../../../api/server'
import { resolvePreset } from '@babel/core';
import Modal from 'react-native-modal';
import Geolocation from '@react-native-community/geolocation';


class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tailor: false,
      trending: true,
      tailordata: [],
      allposts: [],
      tailorPicForSlider: null,
      temptailordata: [],
      // selectedImages: ["https://www.macmillandictionaryblog.com/wp-content/uploads/2018/04/cloud--1024x667.jpg"],
      // selectedImages: ["file:///data/user/0/com.gulaan/cache/rn_image_picker_lib_temp_a6cc6cd5-b633-4fae-afaf-438e1a1be423.jpg"],
      // selectedImages: ["file:///data/user/0/com.gulaan/cache/rn_image_picker_lib_temp_16ea7de7-bf36-4b97-8ccb-cfb48dcd4825.jpg", "file:///data/user/0/com.gulaan/cache/rn_image_picker_lib_temp_8c4f00c2-5727-4ceb-b26a-e7047fcc9687.jpg"],
      selectedImages: [],

      postDiscription: "",
      postsUploadedByMe: "no",
      modalData: [],
      modaldecision: false,
      refreshing: false,
      currentLatitude: 33.652041,
      currentLongitude: 73.156583,

    };
  }
  refresh() {
    this.setState({ refreshing: true })
    jsonserver.get("user/all_favorite_posts/" + (this.props.userdata)._id)
      .then((response) => {
        this.props.set_user_all_fav_suit(response.data.data[0].favorite_posts)
        jsonserver
          .get('user/all_posts')
          .then(response => {
            var temp = this.props.userAllFavoriteData
            var r = response.data.data
            temp.map((x) => x.heartState = "heart")
            r.map((x) => x.heartState = "heart-outline")
            temp.map((j) => {
              r.map((k) => {
                if (j.post_id === k._id) {
                  k.heartState = "heart"
                }
              })
            })
            this.props.set_user_all_posts(r)
          })
          .catch(error => {
            console.log(error.response);
          });
      })
      .catch((error) => {
        alert("something went wrong")
      })

    alert('here')
    jsonserver.get(`user/get_all_favorite_tailors/${this.props.userdata._id}`)
      .then((response) => {
        this.props.set_user_all_fav_tailor(response.data.data[0].favorite_tailors)
        jsonserver
          // .get(
          //   `user/get_all_tailors/${this.props.userdata._id}`,
          // )
          // .post(
          //   `tailor/all_near_tailors`, {
          //   lang: this.state.currentLongitude,
          //   lat: this.state.currentLatitude
          // }
          // )
          .get(
            'user/get_all_tailors',
          )
          .then(response => {
            var temp = this.props.userfavtailor
            temp.map((x) => x.heartState = "heart")
            var alltemp = response.data.data
            alert(response.data.data)
            alltemp.map((x) => x.heartState = "heart-outline")
            temp.map((j) => {
              alltemp.map((k) => {
                if (j.tailor_id == k._id) {
                  k.heartState = "heart"
                }
              })
            })

            this.setState({ tailordata: alltemp });
            this.setState({ temptailordata: response.data.data });
            let arr = []
            response.data.data.map((x) => {
              if (typeof x.profile_photo != 'undefined') {
                if (x.profile_photo != "")
                  arr.push(x.profile_photo)
                else
                  arr.push("https://cdn4.iconfinder.com/data/icons/filled-color-modern-clothes-set/64/clothesfilled-09-512.png")

              }


            })
            this.setState({ tailorPicForSlider: arr })
            this.setState({ refreshing: false })


          })
          .catch(error => {
            console.log(error.response);

          });
      })
      .catch((error) => {

      })


  }
  componentDidMount = () => {

    jsonserver.get("user/all_favorite_posts/" + (this.props.userdata)._id)
      .then((response) => {
        this.props.set_user_all_fav_suit(response.data.data[0].favorite_posts)
        jsonserver
          .get('user/all_posts')
          .then(response => {
            var temp = this.props.userAllFavoriteData
            var r = response.data.data
            console.log(response.data.data);
            temp.map((x) => x.heartState = "heart")
            r.map((x) => x.heartState = "heart-outline")
            temp.map((j) => {
              r.map((k) => {
                if (j.post_id === k._id) {
                  k.heartState = "heart"
                }
              })
            })
            this.props.set_user_all_posts(r)
          })
          .catch(error => {
            console.log(error.response);
          });
      })
      .catch((error) => {
        alert("something went wrong")
      })

    jsonserver.get(`user/get_all_favorite_tailors/${this.props.userdata._id}`)
      .then((response) => {

        this.props.set_user_all_fav_tailor(response.data.data[0].favorite_tailors)
        jsonserver
          .get(
            `user/get_all_tailors`,
          )
          .then(response => {

            var temp = this.props.userfavtailor
            temp.map((x) => x.heartState = "heart")
            var alltemp = response.data.data
            alltemp.map((x) => x.heartState = "heart-outline")
            temp.map((j) => {
              alltemp.map((k) => {
                if (j.tailor_id == k._id) {
                  k.heartState = "heart"
                }
              })
            })

            this.setState({ tailordata: alltemp });
            this.setState({ temptailordata: response.data.data });
            let arr = []
            response.data.data.map((x) => {
              if (typeof x.profile_photo != 'undefined') {
                if (x.profile_photo != "")
                  arr.push(x.profile_photo)
                else
                  arr.push("https://cdn4.iconfinder.com/data/icons/filled-color-modern-clothes-set/64/clothesfilled-09-512.png")

              }


            })
            this.setState({ tailorPicForSlider: arr })

          })
          .catch(error => {
            alert('did')
            console.log(error.response);

          });
      })
      .catch((error) => {

      })


    Geolocation.getCurrentPosition(

      (position) => {
        // alert(JSON.stringify(position))
        const currentLongitude =
          (position.coords.longitude);


        const currentLatitude =
          (position.coords.latitude);

        //Setting Longitude state
        this.setState({
          currentLatitude,
          currentLongitude
        })
        // setCurrentLongitude(currentLongitude);

        // //Setting Longitude state
        // setCurrentLatitude(currentLatitude);
      },
      (error) => {
        // setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000
      },
    );



  };
  handleRenderStateChangeTailor() {
    this.setState({ tailor: true, trending: false });
  }
  handleRenderStateChangeTrending() {
    this.setState({ tailor: false, trending: true });

    // this.setState({ tailor: true });
  }
  pickImage() {
    const options = {
      title: 'Select Profile Picture',
      maxWidth: 5000,
      maxHeight: 5000,
      quality: 1,
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: '../Android/data/com.restaurant/files',
        includeBase64: true,
      },
    };
    ImagePicker.launchImageLibrary(options, response => {


      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.uri;
        let arr = this.state.selectedImages
        arr.push(response.uri)

        this.setState({ selectedImages: arr })
        // this.setState({ backgroundUri: uri });
      }
    });
  }
  uploadPost() {
    var userdata = (this.props.userdata)
    if (this.state.selectedImages == "") {
      alert("Must select atleast one picture.")
    }
    else {
      var formdata = new FormData();
      this.state.selectedImages.map((x) => {
        formdata.append('images', {
          uri: x,
          name: "image.jpg",
          type: "image/jpg"
        });
      })
      formdata.append("description", this.state.postDiscription)
      // alert(JSON.stringify(formdata))
      // return
      jsonserver.post(`user/trend_upload/${userdata._id}`, formdata)
        .then((response) => {
          // Alert.alert(
          //   // "Alert Title",
          //   "Trend Posted Succesfully",
          //   [
          //     // {
          //     //   text: "Cancel",
          //     //   onPress: () => console.log("Cancel Pressed"),
          //     //   style: "cancel"
          //     // },
          //     { text: "OK", onPress: () => console.log("OK Pressed") }
          //   ]
          // );
          alert("trend posted")
          this.setState({ postDiscription: "", selectedImages: [] })
          let arr = []
          arr.push(response.data.data)
          this.props.userallposts.map((x) => arr.push(x))
          this.props.set_user_all_posts(arr)
          this.setState({ postsUploadedByMe: arr });
        })
        .catch((error) => {
          alert("error posting trend")
          console.log(error);
        })
    }
  }

  searchTailor(query) {
    var temp = this.state.temptailordata
    var re = new RegExp(query.toUpperCase(), 'g');
    var temp1 = []
    temp.map((x) => {

      if (x.address.toUpperCase().match(re) != null || x.first_name.toUpperCase().match(re) != null || x.last_name.toUpperCase().match(re) != null || JSON.stringify(x.average_rate_per_stitching).toUpperCase().match(re) != null || x.experience.toUpperCase().match(re) != null) {
        temp1.push(x)
      }
    })
    this.setState({ tailordata: temp1 })
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.main}
        refreshControl={<RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={() => this.refresh()}
        />}
      >
        {/* <Text>{JSON.stringify(this.state.tailordata[0])}</Text> */}
        <View style={styles.innerView}>
          <Modal isVisible={this.state.modaldecision}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
              {/* <Text>{JSON.stringify(this.state.modalData)}</Text> */}
              <TailorCard item={this.state.modalData} showData={this.state.modaldecision} heartState={this.state.modalData.heartState} canFav={true} />
              <CustomButton buttontext="close" onPress={() => this.setState({ modaldecision: false })} />
            </View>
          </Modal>
          {/* {this.state.tailorPicForSlider === null ? null :
            <ImageSlider images={this.state.tailorPicForSlider} />

          } */}
          <View
            style={{
              flexDirection: 'row',
              // justifyContent: 'space-between',
              width: '95%',
            }}>
            {/* <CustomButton
              buttontext="Trending"
              style={{
                width: '45%',
                height: 35,
                backgroundColor: this.state.trending ? 'pink' : 'red',
              }}
              textstyle={{ fontSize: 14 }}
              onPress={() => this.handleRenderStateChangeTrending()}
            />
            <CustomButton
              buttontext="Tailors"
              style={{
                width: '45%',
                height: 35,
                backgroundColor: this.state.tailor ? 'pink' : 'red',
              }}
              textstyle={{ fontSize: 14 }}
              onPress={() => this.handleRenderStateChangeTailor()}
            /> */}
            <TouchableOpacity

              onPress={() => this.handleRenderStateChangeTrending()}
            >

              <View style={{ width: 110, height: 50, borderBottomWidth: this.state.trending ? 0.5 : 0, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 26, color: this.state.trending ? 'green' : 'black' }}>Trending</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity

              onPress={() => this.handleRenderStateChangeTailor()}
            >

              <View style={{ width: 100, height: 50, marginLeft: 10, alignItems: 'center', borderBottomWidth: this.state.tailor ? 0.5 : 0 }}
              >
                <Text style={{ fontSize: 26, color: this.state.tailor ? 'green' : 'black' }}>Tailors</Text>
              </View>
            </TouchableOpacity>

          </View>
          {this.state.tailor && (
            <>

              {/* <Text>{this.state.currentLatitude}</Text>
              <Text>{this.state.currentLongitude}</Text>
              <Text>{JSON.stringify(this.state.tailordata[0].first_name)}</Text> */}
              <SearchBar onChangeText={(a) => this.searchTailor(a)} />
              {this.state.tailordata.map((x) =>
                <TailorCard item={x} onPress={() => this.setState({ modalData: x, modaldecision: true })} heartState={x.heartState} canFav={true} requested={x.requested} />
              )}

            </>
          )}
          {this.state.trending && (
            <>
              <View
                style={{
                  width: '95%',
                  paddingVertical: 10,
                  // backgroundColor: 'pink',
                  marginTop: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  // borderWidth: 0.2,
                  borderRadius: 25,
                }}>
                <View
                  style={{
                    width: '95%',
                    backgroundColor: 'white',
                    height: 60,
                    justifyContent: 'center',
                    paddingHorizontal: 10,
                    borderRadiust: 25,
                  }}>
                  <TextInput
                    placeholder="Tell us about trending suits!!!!!"
                    placeholderTextColor="silver"
                    style={{ fontSize: 18 }}
                    onChangeText={(a) => this.setState({ postDiscription: a })}
                  />
                </View>
                <View style={{ width: "95%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                  {this.state.selectedImages.map((x) =>
                    <View>
                      <TouchableOpacity style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1, width: 20, height: 20, position: "absolute", marginVertical: 5, marginLeft: 80, borderRadius: 10 }}
                        onPress={() => {
                          let arr = this.state.selectedImages
                          let c = arr.findIndex((a) => {
                            return a === x
                          })
                          arr.splice(c, 1)
                          this.setState({ selectedImages: arr })
                        }}
                      >
                        <Ionicon name="close" size={20} color="#fff" style={{ zIndex: 2 }} />
                      </TouchableOpacity>
                      <Image source={{ uri: x }} style={{ height: 100, width: 100, marginLeft: 5, resizeMode: 'stretch', }} />
                    </View>
                  )}

                </View>
                <View
                  style={{
                    width: '95%',
                    backgroundColor: 'white',
                    height: 60,
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    flexDirection: 'row',
                  }}>
                  <CustomButton
                    buttontext={<Ionicon name="camera" size={25} />}

                    style={{
                      width: 150,
                      height: 35,
                      backgroundColor: this.state.tailor ? 'pink' : 'red',
                    }}
                    textstyle={{ fontSize: 14 }}
                    onPress={() => this.pickImage()}
                  />
                  <CustomButton
                    buttontext="Post"
                    style={{
                      width: 150,
                      height: 35,
                      backgroundColor: this.state.tailor ? 'pink' : 'red',
                    }}
                    textstyle={{ fontSize: 14 }}
                    onPress={() => this.uploadPost()}
                  />
                </View>
              </View>
              {this.state.postsUploadedByMe === "no" ?

                this.props.userallposts.reverse().map((item) =>
                  item.heartState === "heart" ? <SuitCard item={item} heartState="heart" canFav={true} /> : <SuitCard item={item} heartState="heart-outline" canFav={true} />

                ) :
                this.state.postsUploadedByMe.reverse().map((item) =>
                  item.heartState === "heart" ? <SuitCard item={item} heartState="heart" canFav={true} /> : <SuitCard item={item} heartState="heart-outline" canFav={true} />

                )
              }
            </>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'green',
    flexGrow: 1,
    // paddingVertical: 10,
    // paddingHorizontal: 10,
  },
  innerView: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 20,
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
    set_user_all_fav_tailor: (data) => { dispatch({ type: "USER_FAV_TAILOR", userfavtailor: data }) },
    set_user_all_posts: (data) => { dispatch({ type: "USER_ALLPOSTS", userallposts: data }) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(home)
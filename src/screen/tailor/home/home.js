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
  RefreshControl
} from 'react-native';
import ImageSlider from '../../../resuseableComponents/generic/ImageSlider';
import CustomButton from '../../../resuseableComponents/generic/button';
import SuitCard from '../../../resuseableComponents/userhome/suitCard';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import TailorCard from '../../../resuseableComponents/generic/tailorCard';
import Ionicon from "react-native-vector-icons/Ionicons"
import { connect } from 'react-redux';
import SearchBar from "../../../resuseableComponents/generic/serachbar"
import jsonserver from '../../../api/server'
import { Mpurple } from '../../../Constants';


class home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tailor: false,
      trending: true,
      tailordata: [],
      allposts: [],
      PicForSlider: null,
      // selectedImages: ["https://www.macmillandictionaryblog.com/wp-content/uploads/2018/04/cloud--1024x667.jpg"],
      // selectedImages: ["file:///data/user/0/com.gulaan/cache/rn_image_picker_lib_temp_a6cc6cd5-b633-4fae-afaf-438e1a1be423.jpg"],
      selectedImages: [],
      allCustomSuitsByUsers: [],
      postDiscription: "testing",
      refreshing: false

    };
  }
  refresh() {
    this.setState({ refreshing: true })
    jsonserver
      .get('user/all_posts')
      .then(response => {
        this.props.set_user_all_posts(response.data.data)
        let arr = []
        response.data.data.map((x) => {
          if (typeof x.images[0] != 'undefined') {
            arr.push(x.images[0])
          }
        })
        // console.log("--------------------------______________-----------------")
        // console.log(arr)
        this.setState({ PicForSlider: arr })

      })
      .catch(error => {
        console.log(error.response);

      });
    jsonserver
      .get(
        'user/get_all_tailors',
      )
      .then(response => {
        this.setState({ tailordata: response.data.data });

        // console.log("---------------------all tailors images 0 index -------------------");
        // console.log(arr);
      })
      .catch(error => {
        console.log(error.response);

      });
    jsonserver.get(`user/all_customization`)
      .then((response) => {
        this.setState({ allCustomSuitsByUsers: response.data.data })
        this.setState({ refreshing: false })

      })
      .catch((error) => {
        alert("Something went wrong customization")
      })
  }
  componentDidMount = () => {
    jsonserver
      .get('user/all_posts')
      .then(response => {
        this.props.set_user_all_posts(response.data.data)
        let arr = []
        response.data.data.map((x) => {
          if (typeof x.images[0] != 'undefined') {
            arr.push(x.images[0])
          }
        })
        // console.log("--------------------------______________-----------------")
        // console.log(arr)
        this.setState({ PicForSlider: arr })

      })
      .catch(error => {
        console.log(error.response);

      });
    jsonserver
      .get(
        'user/get_all_tailors',
      )
      .then(response => {
        this.setState({ tailordata: response.data.data });

        // console.log("---------------------all tailors images 0 index -------------------");
        // console.log(arr);
      })
      .catch(error => {
        console.log(error.response);

      });
    jsonserver.get(`user/all_customization`)
      .then((response) => {
        this.setState({ allCustomSuitsByUsers: response.data.data })
      })
      .catch((error) => {
        // alert("Something went wrong customization")
      })



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
      console.log('Response = ', response.uri);
      let arr = this.state.selectedImages
      arr.push(response.uri)

      this.setState({ selectedImages: arr })
      // console.log("------------------- array of images ---------------------");
      // console.log(this.state.selectedImages);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.uri;
        this.setState({ backgroundUri: uri });
      }
    });
  }
  uploadPost() {
    console.log('============ her check ========================');
    console.log(this.props.userallposts);
    console.log('====================================');
    var taiordatahere = (this.props.tailordata)
    if (this.state.selectedImages == "") {
      alert("Must select atleast one picture.")
    }
    else {
      // alert(taiordatahere._id)
      var formdata = new FormData();
      this.state.selectedImages.map((x) => {
        formdata.append('images', {
          uri: x,
          name: "image.jpg",
          type: "image/jpg"
        });
      })
      formdata.append("description", this.state.postDiscription)
      jsonserver.post(`tailor/trend_upload/${taiordatahere._id}`, formdata)
        .then((response) => {
          alert("trend posted")
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
    var temp = this.state.tailordata
    var re = new RegExp(query, 'g');
    var temp1 = []
    // console.log('====================================');
    // console.log(temp);
    temp.map((x) => {
      if (x.address.match(re) != null) {
        temp1.push(x)
      }
      // console.log(x.address);
    })
    // console.log('====================================');
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
        <View style={styles.innerView}>
          {this.state.PicForSlider !== null ? <ImageSlider images={this.state.PicForSlider.slice(3)} /> : null}
          {/* <Text>{JSON.stringify(this.state.PicForSlider)}</Text> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '95%',
            }}>
            <CustomButton
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
              buttontext="Custom"
              style={{
                width: '45%',
                height: 35,
                backgroundColor: this.state.tailor ? 'pink' : 'red',
              }}
              textstyle={{ fontSize: 14 }}
              onPress={() => this.handleRenderStateChangeTailor()}
            />

          </View>
          {this.state.trending && (
            <>
              <View
                style={{
                  width: '95%',
                  paddingVertical: 10,
                  backgroundColor: 'white',
                  marginTop: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 0.2
                }}>
                <View
                  style={{
                    width: '95%',
                    backgroundColor: 'white',
                    height: 60,
                    justifyContent: 'center',
                    paddingHorizontal: 10,
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
              {this.props.userallposts.reverse().map((item) => <SuitCard item={item} heartState={item?.heartState} />)}

            </>
          )}
          {this.state.tailor && (
            <>
              {/* <Text>this is here when you need</Text> */}
              {this.state.allCustomSuitsByUsers.map((item) => <SuitCard item={item} heartState={item?.heartState} customCardForTailor={true} />)}

            </>
          )}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: Mpurple,
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
    tailordata: state.tailordata,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    set_user_all_fav_suit: (data) => { dispatch({ type: "USER_FAV_SUIT", userfavsuit: data }) },
    set_user_all_posts: (data) => { dispatch({ type: "USER_ALLPOSTS", userallposts: data }) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(home)
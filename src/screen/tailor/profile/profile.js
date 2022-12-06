import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TextInput, ImagePickerIOS } from 'react-native';
import NavigationButton from "../../../resuseableComponents/profile/navigationButton"
import Ionicon from "react-native-vector-icons/Ionicons"
import { connect } from 'react-redux';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import CustomButton from "../../../resuseableComponents/generic/button"
import SuitCard from "../../../resuseableComponents/userhome/suitCard"
import axios from 'axios';
import { template } from '@babel/core';
import * as ImagePicker from 'react-native-image-picker';
import jsonserver from '../../../api/server'
import { Lpurple, Mpurple, White } from '../../../Constants';
class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applyTab: false,
            myAccount: false,
            myDress: false,
            myFavorite: false,
            userAllPosts: [],
            userAllFavoriteData: (this.props.userAllFavoriteData),
            data: (this.props.tailordata),
            first_name: (this.props.tailordata)?.first_name,
            last_name: (this.props.tailordata)?.last_name,
            password: (this.props.tailordata)?.password,
            address: (this.props.tailordata)?.address,
            phone: '0' + (this.props.tailordata)?.contact,
            city: (this.props.tailordata)?.city,
            experience: (this.props.tailordata)?.experience,
            averagerate: (this.props.tailordata)?.average_rate_per_stitching,
            // dp: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6PQwCtxfamerWvqVDooqSR9ArzJ_gIIbyZQ&usqp=CAU"
            // dp: "file:///data/user/0/com.gulaan/cache/rn_image_picker_lib_temp_6518f099-1bf5-492a-bb86-c501a4a83e65.jpg"
            dp: this.props.tailordata?.profile_photo
        };
    }
    updateTailorData() {

        jsonserver.put("tailor/update_detils/" + this.state.data._id, {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            password: this.state.password,
            city: this.state.city,
            address: this.state.address,
            contact: this.state.phone,
            experience: this.state.experience,
            average_rate_per_stitching: this.state.averagerate,
            // profile_photo: this.state.dp,
        })
            .then((response) => {
                // this.props.setUserData(JSON.stringify(response.data.data));
                alert("changed")
                console.log('============ user data update ========================');
                console.log(response);
                console.log('====================================');
            })

            .catch((error) => {
                console.log('================== user data update errorv==================');
                console.log(error);
                console.log('====================================');
                alert("something went wrong")
            })
        var formdata = new FormData()
        formdata.append('profile_photo', {
            uri: this.state.dp,
            name: "image.jpg",
            type: "image/jpg"
        })
        jsonserver.put(`tailor/profile_Photo/${this.state.data._id}`, formdata)
            .then((response) => {
                alert("success images")
                console.log('============= image upload true =======================');
                console.log(response);
                console.log('====================================');
            })
            .catch((error) => {
                console.log('=============== image failed =====================');
                console.log(error);
                console.log('====================================');
                alert("error")
            })
    }

    pickImage() {
        const options = {
            title: 'Select Profile Picture',
            maxWidth: 5000,
            maxHeight: 5000,
            quality: 0.1,
            includeBase64: true,
            storageOptions: {
                skipBackup: true,
                path: '../Android/data/com.restaurant/files',
                includeBase64: true,
            },
        };
        ImagePicker.launchImageLibrary(options, response => {
            this.setState({ dp: response.uri })
            // console.log(response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
                this.setState({ dp: this.props.userdata.profile_photo })
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else {
                const uri = response.uri;
                this.setState({ backgroundUri: uri });
            }
        });
    }
    render() {
        return (
            <ScrollView contentContainerStyle={styles.main}>
                <View style={styles.innerView}>
                    <View style={{
                        width: "100%",
                        backgroundColor: Lpurple,
                        height: 200,
                        paddingHorizontal: 20,
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                    }}>
                        <Image source={{ uri: this.state.dp }} style={{ height: 100, width: 100, borderRadius: 100, marginTop: 20 }} />
                        <Text style={{ fontSize: 32, color: White }}>{typeof this.props.tailordata != 'undefined' ? this.props.tailordata.first_name : null} {typeof this.props.tailordata != 'undefined' ? this.props.tailordata.last_name : null}</Text>
                        <Text style={{ fontSize: 16, color: White }}>{typeof this.props.tailordata != 'undefined' ? this.props.tailordata.email : null}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>

                        <NavigationButton iconname="person-circle-outline" title="Your account" isIcon={true} iconsize={30} onPress={() => this.setState({ applyTab: true, myAccount: true, myDress: false, myFavorite: false })} />
                        <NavigationButton iconname="shirt-outline" title="My Dresses" iconsize={25} isIcon={true} onPress={() => this.setState({ applyTab: true, myAccount: false, myDress: true, myFavorite: false })} />
                        <NavigationButton iconname="heart-outline" title="My Favourites" iconsize={25} isIcon={true} onPress={() => this.setState({ applyTab: true, myAccount: false, myDress: false, myFavorite: true })} />
                        {/* <NavigationButton iconname="settings-outline" title="Settings" iconsize={25} /> */}
                        <NavigationButton iconname="exit-outline" title="Logout" iconsize={25} onPress={() => {
                            this.props.setUserData('')
                            this.props.settailordata('')
                            this.props.setuserfav('')
                            this.props.navigation.navigate("TAILORSIGNIN")
                        }} />
                    </View>
                </View>
                {this.state.applyTab &&
                    <View style={[{ backgroundColor: White, width: "100%", height: "100%", position: "absolute", marginTop: 10 }]}>
                        <View style={{ width: "100%", backgroundColor: Lpurple, height: 220, paddingHorizontal: 20 }}>
                            <TouchableOpacity style={{ marginLeft: -10, marginTop: 10 }} onPress={() => this.setState({ applyTab: !this.state.applyTab })}>
                                <Ionicon name="arrow-back-outline" size={30} color={White} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.pickImage()}>
                                <Image source={{ uri: this.state.dp }} style={{ height: 100, width: 100, borderRadius: 100, marginTop: 0, resizeMode: 'stretch' }} />
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={{ width: 30, height: 30, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 50, position: 'relative', zIndex: 10, marginLeft: 50, marginTop: -30, justifyContent: 'center', alignItems: 'center' }}>
                                <Ionicon name="create-outline" size={20} color="black" />
                            </TouchableOpacity> */}
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", height: 50, }}>
                                <Text style={{ fontSize: 32, color: White }}>{this.state.first_name} {this.state.last_name}</Text>

                                {this.state.myAccount
                                    &&
                                    <CustomButton style={{ width: 90 }} buttontext="Save" onPress={() => this.updateTailorData()} />
                                }
                            </View>
                            <Text style={{ fontSize: 16, color: White }}>{(this.props.tailordata).email}</Text>
                        </View>
                        {this.state.myAccount &&
                            (<ScrollView contentContainerStyle={{ marginTop: 10, alignItems: 'center', paddingBottom: 30 }}>
                                <Text style={{ width: "90%", fontSize: 18, marginVertical: 10 }}>
                                    First Name
                                </Text>
                                <TextInput placeholder="First name" style={{ borderWidth: 0.5, width: "90%" }} value={this.state.first_name} onChangeText={(af) => this.setState({ first_name: af })} />
                                <Text style={{ width: "90%", fontSize: 18, marginVertical: 10 }}>
                                    Last Name
                                </Text>
                                <TextInput placeholder="Last name" style={{ borderWidth: 0.5, width: "90%" }} value={this.state.last_name} onChangeText={(al) => this.setState({ last_name: al })} />
                                <Text style={{ width: "90%", fontSize: 18, marginVertical: 10 }}>
                                    Password
                                </Text>
                                <TextInput placeholder="Password" style={{ borderWidth: 0.5, width: "90%" }} onChangeText={(app) => this.setState({ password: app })} secureTextEntry={true} />
                                <Text style={{ width: "90%", fontSize: 18, marginVertical: 10 }}>
                                    Address
                                </Text>
                                <TextInput placeholder="Address" style={{ borderWidth: 0.5, width: "90%" }} value={this.state.address} onChangeText={(ad) => this.setState({ address: ad })} />
                                <Text style={{ width: "90%", fontSize: 18, marginVertical: 10 }}>
                                    Phone
                                </Text>
                                <TextInput placeholder="Phone" style={{ borderWidth: 0.5, width: "90%" }} value={(this.state.phone)} onChangeText={(ap) => this.setState({ phone: ap })} keyboardType='number-pad' />
                                <Text style={{ width: "90%", fontSize: 18, marginVertical: 10 }}>
                                    Experience
                                </Text>
                                <TextInput placeholder="Experience" style={{ borderWidth: 0.5, width: "90%" }} value={(this.state.experience)} onChangeText={(ap) => this.setState({ experience: ap })} keyboardType='number-pad' />
                                <Text style={{ width: "90%", fontSize: 18, marginVertical: 10 }}>
                                    Average Rate
                                </Text>
                                <TextInput placeholder="AverageRate" style={{ borderWidth: 0.5, width: "90%" }} value={(this.state.averagerate)} onChangeText={(ap) => this.setState({ averagerate: ap })} keyboardType='number-pad' />

                            </ScrollView>)
                        }
                        {this.state.myDress && (
                            <ScrollView contentContainerStyle={{ marginTop: 10, alignItems: 'center', paddingBottom: 30 }}>


                                {typeof this.state.userAllPosts === 'string' || this.state.userAllPosts.length == 0 ?
                                    <Text>No record Available </Text> :
                                    this.state.userAllPosts.map((x) =>
                                        <SuitCard item={x} heartState={x.heartState} />
                                    )
                                }

                            </ScrollView>
                        )}
                        {this.state.myFavorite && (
                            <ScrollView contentContainerStyle={{ marginTop: 10, alignItems: 'center', paddingBottom: 30 }}>


                                {!this.props.userAllFavoriteData ?
                                    <Text>No record Available</Text> :
                                    // <Text>{JSON.stringify(this.props.userAllFavoriteData)}</Text>

                                    this.props.userAllFavoriteData.map((y) =>
                                        <SuitCard item={y} heartState="heart" />
                                    )

                                }

                            </ScrollView>
                        )}
                    </View>
                }
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    main: {
        backgroundColor: Mpurple,
        flexGrow: 1,
        paddingVertical: 10,
        // paddingHorizontal: 10,
    },
    innerView: {
        flex: 1,
        backgroundColor: White,
        alignItems: "center",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        // paddingVertical: 20
    }
})

const mapStateToProps = state => {
    return {
        userdata: state.userdata,
        userAllFavoriteData: state.userfavsuit,
        tailordata: state.tailordata,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setUserData: data => {
            dispatch({ type: 'USER_DATA', userdata: data });
        },
        settailordata: data => {
            dispatch({ type: 'TAILOR_DATA', userdata: data });
        },
        setuserfav: data => {
            dispatch({ type: 'USER_FAV_SUIT', userdata: data });
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(profile)
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
import TailorCard from '../../../resuseableComponents/generic/tailorCard';
import { Lpurple, Mpurple, White } from '../../../Constants';

class profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applyTab: false,
            myAccount: false,
            myDress: false,
            tailors: false,

            userAllPosts: [],
            userAllFavoriteData: (this.props.userAllFavoriteData),
            data: (this.props.userdata),
            first_name: (this.props.userdata).first_name,
            last_name: (this.props.userdata).last_name,
            password: (this.props.userdata).password,
            address: (this.props.userdata).address,
            phone: '0' + (this.props.userdata).contact,
            city: (this.props.userdata).city,
            // dp: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6PQwCtxfamerWvqVDooqSR9ArzJ_gIIbyZQ&usqp=CAU"
            dp: this.props.userdata.profile_photo,
            mydresstab: true,
            favdresstab: false
        };
    }
    updateUserData() {
        var formdata = new FormData()
        formdata.append('profile_photo', this.state.dp);

        jsonserver.put("user/update_detils/" + this.state.data._id, {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            password: this.state.password,
            contact: this.state.phone,
            city: this.state.city,
            address: this.state.address,

        })
            .then((response) => {
                this.props.setUserData(JSON.stringify(response.data.data));
                alert("changed")
            })

            .catch((error) => {
                alert("something went wrong")
            })
        var formdata = new FormData()
        formdata.append('profile_photo', {
            uri: this.state.dp,
            name: "image.jpg",
            type: "image/jpg"
        })
        jsonserver.put(`user/profile_Photo/${this.state.data._id}`, formdata)
            .then((response) => {
                alert("success images")
            })
            .catch((error) => {
                alert("error")
            })
    }
    componentDidMount() {
        if (this.props.userdata.profile_photo != "") {
            this.setState({ dp: this.props.userdata.profile_photo })
        }
        jsonserver.get("user/all_posts_of_user/" + this.state.data._id)
            .then((response) => {
                if (typeof response.data.error == 'undefined') {
                    var r = response.data.data
                    r.map((x) => x.heartState = "heart-outline")
                    if (typeof this.props.userAllFavoriteData != 'undefined') {
                        var temp = this.props.userAllFavoriteData
                        temp.map((x) => x.heartState = "heart")
                        temp.map((j) => {
                            r.map((k) => {
                                if (j.post_id === k._id) {
                                    k.heartState = "heart"
                                }
                            })
                        })

                        this.setState({ userAllPosts: r })
                    }
                    else {
                        this.setState({ userAllPosts: response.data.data })

                    }
                }
                else {

                    this.setState({ userAllPosts: response.data.error })
                }
            })

            .catch((error) => {
                console.log(error);
                alert("something went wrong from all post user")
            })


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
            this.setState({ dp: response.uri })
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
                        <Image source={{ uri: this.state.dp }} style={{ height: 100, width: 100, borderRadius: 100, marginTop: 20, }} />
                        <Text style={{ fontSize: 32, color: White }}>{(this.props.userdata).first_name} {(this.props.userdata).last_name}</Text>
                        <Text style={{ fontSize: 16, color: White }}>{(this.props.userdata).email}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>

                        <NavigationButton iconname="person-circle-outline" title="My Account" isIcon={true} iconsize={30} onPress={() => this.setState({ applyTab: true, myAccount: true, myDress: false, tailors: false })} />
                        <NavigationButton iconname="shirt-outline" title="Dresses" iconsize={25} isIcon={true} onPress={() => this.setState({ applyTab: true, myAccount: false, myDress: true, tailors: false })} />
                        <NavigationButton iconname="cut-outline" title="Tailors" iconsize={25} isIcon={true} onPress={() => this.setState({ applyTab: true, myAccount: false, myDress: false, tailors: true })} />
                        {/* <NavigationButton iconname="settings-outline" title="Settings" iconsize={25} /> */}
                        <NavigationButton iconname="exit-outline" title="Logout" iconsize={25} onPress={() => {
                            this.props.setUserData('')
                            this.props.settailordata('')
                            this.props.setuserfav('')
                            this.props.navigation.navigate("SIGNIN")
                        }} />
                    </View>
                </View>
                {this.state.applyTab &&
                    <View style={[{ backgroundColor: White, width: "100%", height: "100%", position: "absolute", marginTop: 10 }]}>
                        <View style={{ width: "100%", backgroundColor: Lpurple, height: 220, paddingHorizontal: 20, }}>
                            <TouchableOpacity style={{ marginLeft: -10, marginTop: 10 }} onPress={() => this.setState({ applyTab: !this.state.applyTab })}>
                                <Ionicon name="arrow-back-outline" size={30} color={White} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => this.pickImage()}>
                                <Image source={{ uri: this.state.dp }} style={{ height: 100, width: 100, borderRadius: 100, marginTop: 0, resizeMode: 'stretch' }} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: "center", height: 50, }}>
                                <Text style={{ fontSize: 32, color: White }}>{this.state.first_name} {this.state.last_name}</Text>
                                {this.state.myAccount
                                    &&
                                    <CustomButton style={{ width: 90 }} buttontext="Save" onPress={() => this.updateUserData()} />
                                }
                            </View>
                            <Text style={{ fontSize: 16, color: White }}>{(this.props.userdata).email}</Text>
                        </View>
                        {this.state.myAccount &&
                            (<ScrollView contentContainerStyle={{ marginTop: 10, alignItems: 'center', paddingBottom: 20 }}>
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

                            </ScrollView>)
                        }
                        {this.state.myDress && (
                            <>
                                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "95%", marginLeft: "2.5%", marginBottom: 10 }}>

                                    <CustomButton buttontext="My" style={{
                                        width: "45%",
                                        height: 35,
                                        backgroundColor: this.state.mydresstab ? "pink" : "red"
                                    }}
                                        onPress={() => this.setState({ mydresstab: true, favdresstab: false })}
                                    />
                                    <CustomButton buttontext="Favorites" style={{
                                        width: "45%",
                                        height: 35,
                                        backgroundColor: this.state.favdresstab ? "pink" : "red"
                                    }}
                                        onPress={() => this.setState({ favdresstab: true, mydresstab: false })}

                                    />
                                </View>
                                <ScrollView contentContainerStyle={{ marginTop: 10, alignItems: 'center', paddingBottom: 30 }}>

                                    {this.state.mydresstab && (
                                        typeof this.state.userAllPosts === 'string' ?
                                            <Text>{this.state.userAllPosts}</Text> :
                                            this.state.userAllPosts.map((x) =>
                                                <SuitCard item={x} heartState={x.heartState} />
                                            )
                                    )}
                                    {this.state.favdresstab && (

                                        typeof this.props.userAllFavoriteData === 'undefined' ?
                                            <Text>{this.state.userAllPosts}</Text> :

                                            this.props.userAllFavoriteData.map((y) =>
                                                <SuitCard item={y} heartState="heart" canFav={true} />
                                            )



                                    )}

                                </ScrollView>
                            </>
                        )}
                        {this.state.tailors && (
                            <ScrollView contentContainerStyle={{ marginTop: 10, alignItems: 'center', paddingBottom: 30 }}>


                                {this.props.userfavtailor == [] ?
                                    <Text>no fav tailors</Text> :

                                    this.props.userfavtailor.map((y) =>
                                        <TailorCard item={y} heartState="heart" canFav={true} />
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
        marginTop: 10
        // paddingVertical: 20
    }
})

const mapStateToProps = state => {
    return {
        userdata: state.userdata,
        userAllFavoriteData: state.userfavsuit,
        userfavtailor: state.userfavtailor,

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
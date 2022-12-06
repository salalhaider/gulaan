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
    Platform,
    PermissionsAndroid,
    KeyboardAvoidingView,
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
import { resolvePreset } from '@babel/core';
import Modal from 'react-native-modal';
import Input from '../../../resuseableComponents/generic/input'
import { Mpurple, White } from '../../../Constants';
import PhotoEditor from 'react-native-photo-editor'
import RNFetchBlob from 'react-native-fetch-blob';






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
            length: "",
            waist: '',
            chest: '',
            shoulder: '',
            seleves: '',

        };
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

            // let arr = null
            // if (this.state.selectedImages != null)
            //     arr = this.state.selectedImages
            // else { }
            // arr = []
            // arr.push(response.uri)

            // RNFetchBlob.fs.stat(response.uri)
            //     .then((stats) => {
            //         // photoToEdit = c
            //         PhotoEditor.Edit({
            //             path: stats.path,
            //             onDone: (e) => { console.log('done'); console.log(e) }
            //         });
            //     })
            //     .catch((err) => { })




            // this.setState({ selectedImages: arr })

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                let arr = this.state.selectedImages
                RNFetchBlob.fs.stat(response.uri)
                    .then((stats) => {
                        // photoToEdit = c
                        PhotoEditor.Edit({
                            path: stats.path,
                            onDone: (e) => {
                                console.log('done');
                                console.log(e);
                                //  arr.push(e) 
                                this.setState({ selectedImages: [...this.state.selectedImages, "file://" + e] })

                            }
                        });
                    })
                    .catch((err) => { })






                // const uri = response.uri;
                // arr.push(uri)
                this.setState({ selectedImages: arr })
            }
        });
    }
    uploadPost() {

        // if (this.state.postDiscription == "" || this.state.length == "" || this.state.waist == "" || this.state.chest == "" || this.state.shoulder == "" || this.state.seleves == "") {
        //     alert("All fileds Must be filled")
        //     return
        // }
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
            formdata.append("length", this.state.length)
            formdata.append("waist", this.state.waist)
            formdata.append("chest", this.state.chest)
            formdata.append("shoulder", this.state.shoulder)
            formdata.append("seleves", this.state.seleves)
            jsonserver.post(`user/customization/${userdata._id}`, formdata)
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
    componentDidMount() {

        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE)


        // PhotoEditor.Edit({
        //     // path: "/storage/emulated/0/Pictures/Screenshots/Screenshot_20210917-234854.jpg"
        //     path: "content://com.android.providers.media.documents/document/image%3A24"
        // });
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.main}>
                {/* <Text style={{ fontSize: 20, color: 'white' }}>{JSON.stringify(Platform)}</Text> */}
                <KeyboardAvoidingView style={styles.innerView}>

                    <Text style={{ fontSize: 26 }}>Customize your Suit</Text>



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
                                placeholder="Description about your suits!!!!!"
                                placeholderTextColor="silver"
                                style={{ fontSize: 18 }}
                                onChangeText={(a) => this.setState({ postDiscription: a })}
                            />
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
                    {/* {this.state.selectedImages == null ? null :

                        <ImageSlider images={this.state.selectedImages} />
                    } */}
                    <View style={{ width: "95%", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                        {this.state.selectedImages == null ? null :
                            this.state.selectedImages.map((x) =>
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
                                    <TouchableOpacity onPress={() => this.setState({ modalData: x, modaldecision: true })}>

                                        <Image source={{ uri: x }} style={{ height: 100, width: 100, marginLeft: 5, resizeMode: 'stretch', }} />
                                    </TouchableOpacity>
                                </View>
                            )
                        }

                    </View>
                    <Input placeholder="Length" onChangeText={(data) => this.setState({ length: data })} />
                    <Input placeholder="Waist" onChangeText={(data) => this.setState({ waist: data })} />
                    <Input placeholder="Chest" onChangeText={(data) => this.setState({ chest: data })} />
                    <Input placeholder="Shoulder" onChangeText={(data) => this.setState({ shoulder: data })} />
                    <Input placeholder="Seleves" onChangeText={(data) => this.setState({ seleves: data })} />

                    <Modal isVisible={this.state.modaldecision} onBackdropPress={() => this.setState({ modaldecision: false })} onBackButtonPress={() => this.setState({ modaldecision: false })}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <Image source={{ uri: this.state.modalData }} style={{ height: 300, width: 350, resizeMode: 'stretch', }} />

                            <CustomButton buttontext="close" onPress={() => this.setState({ modaldecision: false })} />
                        </View>
                    </Modal>

                </KeyboardAvoidingView>

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
        alignItems: 'center',
        paddingVertical: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: 10
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
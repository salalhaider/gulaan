import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TextInput,
    FlatList,
    Image,
    RefreshControl,
    TouchableOpacity,
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
            history: [],
            refreshing: false
        };
    }

    componentDidMount = () => {
        // alert(this.props.userdata._id)
        jsonserver.get(`user/all_customizations_of_user/${this.props.userdata._id}`)
            .then((response) => {

                // alert(JSON.stringify(response.data.data));
                this.setState({ history: response.data.data })
            })
            .catch((error) => {
                alert(JSON.stringify(error.response))
            })
    };
    refresh() {
        this.setState({ refreshing: true })
        jsonserver.get(`user/all_customizations_of_user/${this.props.userdata._id}`)
            .then((response) => {
                console.log('================= history ===================');
                console.log(response.data.data);
                console.log('====================================');
                this.setState({ history: response.data.data })
                this.setState({ refreshing: false })

            })
            .catch((error) => {
                alert("Something went wrong")
            })
    }


    render() {
        return (
            <ScrollView contentContainerStyle={styles.main} refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.refresh()}
                />
            }>
                {/* <Text style={{ fontSize: 18, color: 'white' }}>{JSON.stringify(this.state.history)}</Text> */}
                <View style={styles.innerView}>
                    <Text style={{ fontSize: 26 }}>Your Custom Suits</Text>
                    {this.state.history ? this.state.history.length == 0 ? <Text>There is no history</Text> : this.state.history.map((item) => <SuitCard item={item} heartState={item.heartState} />) : <Text>There is no history</Text>}
                </View>
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
        backgroundColor: 'white',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        marginTop: 10
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
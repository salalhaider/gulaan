import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import jsonserver from '../../../api/server'
import RequestCard from './RequestCard';
import CustomButton from '../../../resuseableComponents/generic/button'
class request extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allRequestDataOfTailor: [],
            sentrequest: false,
            receiveRequest: true
        };
    }
    componentDidMount() {
        // alert(this.props.tailordata._id)
        jsonserver.get(`tailor/get_all_biding/${this.props.tailordata._id}`)
            .then(res => {
                if (res.data.data)
                    this.setState({ allRequestDataOfTailor: res.data.data })
            }

            )
            .catch(err => alert(JSON.stringify(err)))

    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 20 }}>
                    <TouchableOpacity style={{ borderBottomWidth: 1, height: 40, width: (Dimensions.get('window').width / 2), alignItems: 'center', borderColor: this.state.receiveRequest ? "green" : 'black' }} onPress={() => this.setState({ receiveRequest: true, sentrequest: false })}>
                        <Text style={{ fontSize: 18, color: this.state.receiveRequest ? "green" : 'black' }}>Incomming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ borderBottomWidth: 1, height: 40, width: (Dimensions.get('window').width / 2), alignItems: 'center', borderColor: this.state.sentrequest ? "green" : 'black' }} onPress={() => this.setState({ receiveRequest: false, sentrequest: true })}>
                        <Text style={{ fontSize: 18, color: this.state.sentrequest ? "green" : 'black' }}>Sent</Text>
                    </TouchableOpacity>
                </View>
                {/* <Text>{this.state.allRequestDataOfTailor.length}</Text> */}
                {/* <Text style={{ fontSize: 20 }}> {JSON.stringify(this.state.allRequestDataOfTailor)} </Text> */}

                {
                    this.state.receiveRequest &&
                    this.state.allRequestDataOfTailor.map(x =>
                        !x.post &&
                        <RequestCard data={x} incomming={true} tailordata={this.props.tailordata} />
                    )
                }
                {
                    this.state.sentrequest &&
                    this.state.allRequestDataOfTailor.map(x =>
                        x.post &&
                        <RequestCard data={x} />
                    )
                }
            </ScrollView>
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
export default connect(mapStateToProps, mapDispatchToProps)(request)
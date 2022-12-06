import React, { Component } from 'react'
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import { White } from '../../../Constants'
import Modal from 'react-native-modal'
import Input from '../../../resuseableComponents/generic/input'
import CustomButton from '../../../resuseableComponents/generic/button'
import jsonserver from '../../../api/server'

export default class RequestCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            openModal: false,
            cardNumber: 4242424242424242,
            EM: 9,
            EY: 2022,
            CVC: 314,
            status: this.props.data.status == 'pending' ? 'Accept' : this.props.data.status == 'accepted' ? "Mark Complete" : "Completed",
            cancel: 'Cancel',
            refreshing: false

        }

    }

    acceptRequest() {
        alert(this.props.data._id)
    }
    async creditCardInformation() {
        this.toggleModal()
        // alert(this.state.status == "pending" ? 'accepted' : this.state.status == 'Mark Complete' ? "completed" : "completed")
        const res = await jsonserver.put(`tailor/update_bidding_status/${this.props.data._id}`, {
            status: this.state.status == "pending" ? 'accepted' : this.state.status == 'Mark Complete' ? "completed" : "completed",
            card_number: this.state.cardNumber,
            exp_month: this.state.EM,
            exp_year: this.state.EY,
            cvc: this.state.CVC,
            request_from: 'user'
        })
        if (res.data.success) {
            if (this.state.status == "Mark Complete")
                this.setState({ status: "Completed" })
            if (this.state.status == "Accept")
                this.setState({ status: "Mark Complete" })
            return
        }
        alert(JSON.stringify(res.data.message))
    }
    toggleModal() {
        this.setState({ openModal: !this.state.openModal })
    }
    async cancelRequest() {

        const res = await jsonserver.put(`tailor/update_bidding_status/${this.props.data._id}`, {
            status: 'rejected',

        })
        if (res.data.success)
            this.setState({ cancel: 'Canceled' })
    }
    render() {
        var data = this.props.data
        if (data.status != 'accepted')
            return (
                <View style={{ width: '95%', backgroundColor: White, marginVertical: 10, borderWidth: 0.5 }}>
                    {/* <Text>{JSON.stringify(this.props.data.status)}</Text> */}
                    <Modal isVisible={this.state.openModal} onBackdropPress={this.toggleModal.bind(this)}>
                        <View style={{ backgroundColor: White, paddingHorizontal: 10, paddingBottom: 20 }}>
                            <Text style={{ fontSize: 24 }}>Account Information before requesting</Text>
                            <Input placeholder="Card Number" onChangeText={(data) => this.setState({ cardNumber: data })} style={{ width: '100%' }} type="numeric" />
                            <Input placeholder="Expiry Month" onChangeText={(data) => this.setState({ EM: data })} style={{ width: '100%' }} type="numeric" />
                            <Input placeholder="Expiry Year" onChangeText={(data) => this.setState({ EY: data })} style={{ width: '100%' }} type="numeric" />
                            <Input placeholder="CVC" onChangeText={(data) => this.setState({ CVC: data })} style={{ width: '100%' }} type="numeric" />
                            {/* <Input placeholder="Expiry Month" onChangeText={(data) => this.setState({ length: data })} style={{ width: '100%' }} />
          <Input placeholder="Expiry Year" onChangeText={(data) => this.setState({ length: data })} style={{ width: '100%' }} /> */}
                            <CustomButton buttontext="Submit" style={{ width: '100%' }} onPress={() => this.creditCardInformation(this)} />
                        </View>
                    </Modal>


                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: data.tailor.profile_photo }} style={{ height: 100, width: 100 }} />
                        <View style={{ width: '50%', marginLeft: 10 }}>
                            <Text>{data.tailor.first_name} {data.tailor.last_name}</Text>
                            <Text>{data.tailor.address}</Text>
                            {
                                data.status != 'pending' &&
                                <>
                                    <Text>{data.tailor.email}</Text>
                                    <Text>{data.tailor.contact}</Text>
                                </>
                            }

                        </View>
                        {this.props.incomming ?
                            <TouchableOpacity onPress={() => this.setState({ openModal: !this.state.openModal })} disabled={this.state.status == "Completed" ? true : false}>

                                <Text style={{ color: 'blue' }}>
                                    {this.state.status}
                                </Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.cancelRequest()}>

                                <Text style={{ color: 'red' }}>
                                    {this.state.cancel}
                                </Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            )
        else
            return (<></>)
    }
}

import React, { Component } from 'react'
import { Text, View, TextInput, KeyboardAvoidingView } from 'react-native'


export default class serachbar extends Component {
    render() {
        return (
            <KeyboardAvoidingView style={{ width: "90%", marginTop: 10 }}>
                <TextInput placeholder="Search" style={{ width: "100%", borderWidth: 1, fontSize: 12, height: 40, borderRadius: 5, paddingHorizontal: 10, }} onChangeText={this.props.onChangeText} />
            </KeyboardAvoidingView>
        )
    }
}

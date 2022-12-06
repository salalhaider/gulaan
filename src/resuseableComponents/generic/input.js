import React, { Component } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Dimensions } from 'react-native';
import { White } from '../../Constants';

export default class input extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <KeyboardAvoidingView>
                <TextInput
                    placeholder={this.props.placeholder}
                    style={[styles.input, this.props.style]}
                    onChangeText={this.props.onChangeText}
                    placeholderTextColor="black"
                    secureTextEntry={this.props.issecure}
                    keyboardType={this.props.type}
                />
            </KeyboardAvoidingView>
        );
    }
}
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        // flex: 1,
        // flexDirection: "column"
        width: Dimensions.get('screen').width - 20,
        borderRadius: 5,
        marginTop: 20,
        paddingLeft: 20,
        borderColor: 'black',
        color: "black"

    }
})

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Red, White } from '../../Constants';

export default class button extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <TouchableOpacity
                style={[{
                    width: Dimensions.get('screen').width - 20,
                    alignItems: "center",
                    backgroundColor: Red,
                    height: 50,
                    justifyContent: "center",
                    borderRadius: 5,
                    marginTop: 20,



                }, this.props.style]}
                onPress={this.props.onPress}
            >
                <Text style={[{ fontSize: 18, color: White }, this.props.textstyle]}>{this.props.buttontext}</Text>
            </TouchableOpacity>
        );
    }
}

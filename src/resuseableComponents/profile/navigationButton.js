import React, { Component } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Ionicon from "react-native-vector-icons/Ionicons"
import FontIcon from "react-native-vector-icons/FontAwesome5"

export default class navigationButton extends Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={{ width: "100%", backgroundColor: "white", height: 80, justifyContent: "center", alignItems: 'center', borderWidth: 0.5 }}>
                    <View style={{
                        width: "95%", height: 75, backgroundColor: "white", justifyContent: "center", flexDirection: "row"
                    }}>
                        <View style={{ width: "20%", justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicon name={this.props.iconname} size={this.props.iconsize} />
                        </View>
                        <View style={{ width: "70%", justifyContent: 'center' }}>
                            <Text style={{ fontSize: 18 }}>{this.props.title}</Text>
                        </View>
                        <View style={{ width: "10%", justifyContent: 'center', alignItems: 'center' }}>
                            {this.props.isIcon &&

                                <FontIcon name="chevron-right" size={20} />
                            }
                        </View>
                    </View >
                </View >
            </TouchableOpacity>
        )
    }
}

import { Image, SafeAreaView, Text, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import React from "react"

export default class MyCarousel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            carouselItems: [
                {
                    title: "Item 1",
                    text: "Text 1",
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Dress_MET_69.2.1_front_CP4.jpg/220px-Dress_MET_69.2.1_front_CP4.jpg"
                },
                {
                    title: "Item 1",
                    text: "Text 1",
                    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Dress_MET_69.2.1_front_CP4.jpg/220px-Dress_MET_69.2.1_front_CP4.jpg"

                },

            ]
        }
    }
    componentDidMount() {
        let arr = []
        this.props.images.map((x) => arr.push({ uri: x }))
        this.setState({ carouselItems: arr, title: "Item 1", text: "some" })
    }

    _renderItem({ item, index }) {
        return (
            <View style={{
                backgroundColor: 'floralwhite',
                borderRadius: 5,
                height: 300,
                // padding: 50,
                // marginLeft: 25,
                // marginRight: 25,
            }}>
                {/* <Text style={{ fontSize: 30 }}>{item.title}</Text> */}
                <Image source={{ uri: item.uri }} style={{ height: 300, width: "100%" }} />
            </View>

        )
    }

    get pagination() {
        const { carouselItems, activeIndex } = this.state;
        return (
            <Pagination
                dotsLength={carouselItems.length}
                activeDotIndex={activeIndex}
                containerStyle={{ backgroundColor: 'transparent', position: "absolute", marginTop: 155, marginLeft: "25%" }}
                style={{ height: 10 }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: "black"
                    // backgroundColor: 'rgba(255, 255, 255, 0.92)'
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    render() {
        return (
            <SafeAreaView style={{ backgroundColor: 'black', height: 225 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                    <Carousel
                        layout={"default"}
                        ref={ref => this.carousel = ref}
                        data={this.state.carouselItems}
                        sliderWidth={350}
                        itemWidth={350}
                        renderItem={this._renderItem}
                        onSnapToItem={index => this.setState({ activeIndex: index })} />
                </View>
                {/* {this.pagination} */}

            </SafeAreaView>
        );
    }
}
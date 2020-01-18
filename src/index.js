import React, { Component } from 'react';

import {
    View,
    Dimensions,
    Animated,
    PanResponder,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    Slider
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const image = require('./assets/Hotelcalifornia.jpg');
const pause = require('./assets/pause.png');
const fastforward = require('./assets/fastforward.png');
const play = require('./assets/play.png');
const rewind = require('./assets/rewind.png');
const more = require('./assets/more.png');
const add = require('./assets/add.png');

export default class App extends Component {

    state = {
        isScrollEnabled: false
    };

    UNSAFE_componentWillMount() {
        this.scrollOffset = 0;

        this.animation = new Animated.ValueXY({ x: 0, y: SCREEN_HEIGHT - 80 });

        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                if (
                    (this.state.isScrollEnabled && this.scrollOffset <= 0 && gestureState.dy > 0) ||
                    !this.state.isScrollEnabled && gestureState.dy < 0
                ) {
                    return true;
                } else {
                    return false;
                }
            },
            onPanResponderGrant: (evt, gestureState) => {
                this.animation.extractOffset()
            },
            onPanResponderMove: (evt, gestureState) => {
                this.animation.setValue({ x: 0, y: gestureState.dy })
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.moveY > SCREEN_HEIGHT - 129) {
                    Animated.spring(this.animation.y, {
                        toValue: 0,
                        tension: 1
                    }).start();
                } else if (gestureState.moveY < 120) {
                    Animated.spring(this.animation.y, {
                        toValue: 0,
                        tension: 1
                    }).start();
                } else if (gestureState.dy < 0) {
                    this.setState({ isScrollEnabled: true });

                    Animated.spring(this.animation.y, {
                        toValue: -SCREEN_HEIGHT + 80,
                        tension: 1
                    }).start();

                } else if (gestureState.dy > 0) {
                    this.setState({ isScrollEnabled: false });

                    Animated.spring(this.animation.y, {
                        toValue: SCREEN_HEIGHT - 80,
                        tension: 1
                    }).start();
                }
            },
        });
    }

    render() {
        const animatedHeight = {
            transform: this.animation.getTranslateTransform()
        };

        const animatedImage = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT - 90],
            outputRange: [200, 32],
            extrapolate: 'clamp'
        });

        const animatedSongTitleOpacity = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 90],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        });

        const animatedSongDetailsOpacity = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT - 500, SCREEN_HEIGHT - 90],
            outputRange: [1, 0, 0],
            extrapolate: 'clamp'
        });

        const animatedBackgroundColor = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT - 90],
            outputRange: ['rgba(0, 0, 0, 0.5)', 'white'],
            extrapolate: 'clamp'
        });

        const animatedSongImageLeft = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT - 90],
            outputRange: [SCREEN_WIDTH / 2 - 100, 10],
            extrapolate: 'clamp'
        });

        const animatedHeaderHeight = this.animation.y.interpolate({
            inputRange: [0, SCREEN_HEIGHT - 90],
            outputRange: [SCREEN_HEIGHT / 2, 90],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View
                style={{
                    flex: 1,
                    backgroundColor: animatedBackgroundColor
                }}
            >
                <Animated.View
                    {... this.panResponder.panHandlers}
                    style={[animatedHeight, styles.body]}
                >
                    <ScrollView
                        scrollEnabled={this.state.isScrollEnabled}
                        scrollEventThrottle={16}
                        onScroll={event => {
                            this.scrollOffset = event.nativeEvent.contentOffset.y
                        }}
                    >
                        <Animated.View
                            style={{
                                height: animatedHeaderHeight,
                                borderTopWidth: 1,
                                borderTopColor: '#EBE5E5',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <View style={styles.banner}>
                                <Animated.View
                                    style={{
                                        height: animatedImage,
                                        width: animatedImage,
                                        marginLeft: animatedSongImageLeft
                                    }}
                                >
                                    <Image style={styles.image} source={image} />
                                </Animated.View>

                                <Animated.Text
                                    style={{
                                        opacity: animatedSongTitleOpacity,
                                        fontSize: 18,
                                        paddingLeft: 10
                                    }}
                                >
                                    Hotel California (Live)
                                </Animated.Text>
                            </View>

                            <Animated.View
                                style={{
                                    opacity: animatedSongTitleOpacity,
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around'
                                }}
                            >
                                <Image source={pause} style={styles.icon} />
                                <Image source={play} style={styles.icon} />
                            </Animated.View>
                        </Animated.View>

                        <Animated.View
                            style={{
                                height: animatedHeaderHeight,
                                opacity: animatedSongDetailsOpacity
                            }}
                        >
                            <View style={styles.musicContainer}>
                                <Text style={styles.musicTitle}>Hotel California (Live)</Text>
                                <Text style={styles.musicDetails}>Eagles - Hell Freezers Over</Text>
                            </View>

                            <View style={{
                                height: 40,
                                width: SCREEN_WIDTH,
                                alignItems: 'center'
                            }}>
                                <Slider
                                    style={{ width: 300 }}
                                    step={1}
                                    minimumValue={18}
                                    maximumValue={71}
                                    value={18}
                                />
                            </View>

                            <View style={styles.controls}>
                                <Image source={rewind} style={styles.iconMid} />
                                <Image source={pause} style={styles.iconBig} />
                                <Image source={fastforward} style={styles.iconMid} />
                            </View>

                            <View style={styles.menu}>
                                <Image source={add} style={styles.iconColor} />
                                <Image source={more} style={styles.iconColor} />
                            </View>
                        </Animated.View>
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    body: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'white',
        height: SCREEN_HEIGHT
    },
    banner: {
        flex: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: null,
        height: null
    },
    icon: {
        height: 32,
        width: 32
    },
    iconColor: {
        height: 32,
        width: 32,
        tintColor: '#FA95ED'
    },
    iconMid: {
        height: 40,
        width: 40
    },
    iconBig: {
        height: 50,
        width: 50
    },
    controls: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    menu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    musicDetails: {
        color: '#FA95ED',
        fontSize: 18
    },
    musicContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    musicTitle: {
        fontWeight: 'bold',
        fontSize: 22
    }
});

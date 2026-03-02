import React, { useEffect, useRef } from "react";
import {
    TouchableWithoutFeedback,
    View,
    Animated,
    StyleSheet,
} from "react-native";
import { colors } from "../../constants/colors";

const TOGGLE_WIDTH = 46;
const TOGGLE_HEIGHT = 26;
const KNOB_SIZE = 22;

const AppToggle = ({ value, onChange }) => {
    const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: value ? 1 : 0,
            duration: 220,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [2, TOGGLE_WIDTH - KNOB_SIZE - 2],
    });

    const backgroundColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ["#E5E7EB", colors.primary],
    });

    return (
        <TouchableWithoutFeedback onPress={() => onChange(!value)}>
            <Animated.View style={[styles.container, { backgroundColor }]}>
                <Animated.View
                    style={[
                        styles.knob,
                        {
                            transform: [{ translateX }],
                        },
                    ]}
                />
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        width: TOGGLE_WIDTH,
        height: TOGGLE_HEIGHT,
        borderRadius: TOGGLE_HEIGHT / 2,
        padding: 2,
        justifyContent: "center",
    },

    knob: {
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        backgroundColor: "#fff",
        elevation: 2, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOpacity: 0.15,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
    },
});


export default AppToggle;

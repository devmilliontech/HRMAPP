import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import AppText from "../common/AppText";
import { colors } from "../../constants/colors";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SIZE = 200;
const STROKE_WIDTH = 14;


const CircularProgress = ({ maxScore = 10, percentScore = 0, radi = 2 }) => {
    const RADIUS = (SIZE - STROKE_WIDTH) / radi;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    const progress = useRef(new Animated.Value(0)).current;
    const color = percentScore > 104 ? colors.success : percentScore > 94 ? colors.warning : colors.danger

    const percentage = Math.min(
        Math.max((percentScore / maxScore) * 100, 0),
        100
    );

    useEffect(() => {
        Animated.timing(progress, {
            toValue: percentage,
            duration: 900,
            useNativeDriver: false,
        }).start();
    }, [percentage]);

    const strokeDashoffset = progress.interpolate({
        inputRange: [0, 100],
        outputRange: [CIRCUMFERENCE, 0],
    });

    return (
        <View style={styles.container}>
            <Svg width={SIZE} height={SIZE}>

                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke="#E5E7EB"
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                />

                <AnimatedCircle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke={color}
                    strokeWidth={STROKE_WIDTH}
                    fill="none"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${SIZE / 2}, ${SIZE / 2}`}
                />
            </Svg>

            <View style={styles.center}>
                <AppText style={[styles.percent, { color: color }]}>
                    {percentScore.toFixed(0)} / {maxScore}
                </AppText>
                <AppText style={styles.label}>
                    {Math.round(percentage)}%
                </AppText>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    center: {
        position: "absolute",
        alignItems: "center",
    },
    percent: {
        fontSize: 28,
        fontWeight: "700",
        color: colors.primary,
    },
    label: {
        fontSize: 14,
        color: "#777",
    },
});

export default CircularProgress;

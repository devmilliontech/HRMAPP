import React from "react";
import { View, StyleSheet } from "react-native";
import { colors } from "../../../constants/colors";

const SkeletonLeaveCalendar = ({ visible = true }) => {
    if (!visible) return null;
    return (
        <View style={styles.container}>
            <View style={styles.calendar} />
            <View style={styles.legend} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: colors.white },
    calendar: { height: 360, backgroundColor: colors.light, borderRadius: 8, marginBottom: 12 },
    legend: { height: 40, backgroundColor: colors.light, borderRadius: 8 },
});

export default SkeletonLeaveCalendar;

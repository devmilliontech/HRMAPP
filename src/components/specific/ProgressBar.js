import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { colors } from '../../constants/colors'

const ProgressBar = ({ value, bgColor }) => {
    return (
        <View style={styles.container}>
            <View style={{ height: "100%", width: `${value}%`, backgroundColor: bgColor }}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 8,
        backgroundColor: colors.light,
        width: "100%",
        borderRadius: 16,
        overflow: "hidden"
    },
    progress: {

    }
})

export default ProgressBar
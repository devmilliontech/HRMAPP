import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../../constants/colors'
import AppText from '../common/AppText'
import { AntDesign } from '@expo/vector-icons'

const Counter = ({ width, label, value, onIncrease, onDecrese }) => {
    return (
        <View style={[styles.container, { width: width }]}>
            <AppText style={{ marginBottom: 8, fontSize: 15 }}>{label}</AppText>
            <View style={styles.box}>
                <TouchableOpacity onPress={onDecrese} style={styles.decreaseButton}>
                    <AntDesign name='minus' size={18} color={colors.medium} />
                </TouchableOpacity>
                <AppText style={styles.value}>{value}</AppText>
                <TouchableOpacity onPress={onIncrease} style={styles.increaseButton}>
                    <AntDesign name='plus' size={18} color={colors.medium} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    box: {
        height: 50,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: colors.light,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center"
    },

    increaseButton: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    value: {
        flex: 3,
        textAlign: "center",
        fontSize: 20
    },
    decreaseButton: {
        flex: 1,
    }
})

export default Counter
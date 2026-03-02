import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppText from '../common/AppText'
import { colors } from '../../constants/colors'
import { typography } from '../../constants/typography'


const QuickAction = ({ width, icon, iconColor, iconBg, text, onPress }) => {

    return <TouchableWithoutFeedback onPress={() => onPress()}>
        <View style={[styles.card, { width: width }]}>
            <View style={[styles.circle, { backgroundColor: iconBg }]}>
                <Ionicons name={icon} size={24} color={iconColor} />
            </View>
            <AppText style={{ marginTop: 8, fontFamily: typography.medium, fontSize: 15 }}>{text}</AppText>
        </View>
    </TouchableWithoutFeedback>
}

const styles = StyleSheet.create({
    card: {
        paddingVertical: 24,
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        elevation: 1.5,
        shadowColor: colors.primary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
    },
    circle: {
        padding: 12,
        borderRadius: 50,
    }
})

export default QuickAction
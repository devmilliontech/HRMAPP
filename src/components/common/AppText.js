import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { typography } from '../../constants/typography'

const AppText = ({ style, children, numberOfLines }) => {
    return (
        <Text numberOfLines={numberOfLines} style={[styles.text, style]}>{children}</Text>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontFamily: typography.medium
    }
})

export default AppText
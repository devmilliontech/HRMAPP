import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AppText from './AppText'
import { colors } from '../../constants/colors';

const ErrorMessage = ({ error, visible }) => {
    if (!visible || !error) return;
    return (
        <AppText style={styles.error}>{error}</AppText>
    )
}

const styles = StyleSheet.create({
    error: {
        color: colors.danger
    }
})
export default ErrorMessage
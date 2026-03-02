import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppText from '../common/AppText'
import { STYLES } from '../../constants/styles'

const SectionHeader = ({ title, icon, iconColor }) => {
    return (
        <View style={styles.sectionHeader}>
            <Ionicons name={icon} color={iconColor} size={24} />
            <AppText style={styles.sectionTitle}>{title}</AppText>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionHeader: {
        flexDirection: "row",
        marginBottom: 16,
        alignItems: "center",
    },

    sectionTitle: {
        ...STYLES.header,
        marginBottom: 0,
        // flex: 1,
        marginLeft: 12,
    },
})
export default SectionHeader
import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight, ActivityIndicator } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../constants/colors'
import AppText from './AppText'

const AppButton = ({ loading, style, onPress, title, icon }) => {
    return (
        <TouchableHighlight disabled={loading} underlayColor={"#0f00e1"} onPress={onPress} style={[styles.container, style, { backgroundColor: loading ? "#4149b7" : colors.primary }]}>
            {
                loading ? <ActivityIndicator animating={loading} color={colors.white} size={28} /> : <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    {icon && <MaterialCommunityIcons name={icon} size={24} color={colors.white} />}
                    <AppText style={styles.text}>{title}</AppText>
                </View>
            }
        </TouchableHighlight>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 8,
        height: 60,
        gap: 6
    },
    text: {
        color: colors.white,
        fontSize: 16
    }
})
export default AppButton
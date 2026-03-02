import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AppTextField from '../common/AppTextField'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { colors } from '../../constants/colors'

const AppSearchInput = ({ name, }) => {
    return (
        <View>
            <AppTextField
                style={styles.input}
                placeholder={"Search Employee..."}
            />
            <MaterialCommunityIcons name='search' size={20} color={colors.medium} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    input: {
        flex: 1
    }
})

export default AppSearchInput
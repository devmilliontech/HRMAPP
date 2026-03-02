import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import AppText from '../common/AppText'

const ListPickerItem = ({ item, onSelectItem }) => {
    return (
        <TouchableWithoutFeedback onPress={onSelectItem}>
            <View style={styles.container}>
                <AppText>{item.label}</AppText>
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16
    }
})

export default ListPickerItem
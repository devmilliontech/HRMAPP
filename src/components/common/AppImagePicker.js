import { View, Text, StyleSheet, TouchableNativeFeedback, Image } from 'react-native'
import React from 'react'
import * as ImagePicker from "expo-image-picker"
import { colors } from '../../constants/colors'
import AppText from './AppText'
import { FontAwesome5 } from '@expo/vector-icons'

const AppImagePicker = ({ image, text, imageType, onSelectImage }) => {
    const handleSelectImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled) {
                onSelectImage(result.assets[0].uri)
            }
        } catch (error) {
            console.log("Error in launcing image picker", error)
        }
    }
    return (
        <TouchableNativeFeedback onPress={handleSelectImage}>
            <View style={styles.container}>
                {!image ? <View style={{ alignItems: "center" }}>
                    <FontAwesome5 name='cloud-upload-alt' size={28} color={colors.medium} />
                    <AppText style={styles.text}>{text}</AppText>
                    <AppText style={styles.type}>{imageType}</AppText>
                </View> : <Image source={{ uri: image }} style={styles.image} />}
            </View>
        </TouchableNativeFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 150,
        width: "100%",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.light,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderStyle: "dashed"
    },
    text: {
        fontSize: 18,
        color: colors.medium,
        marginVertical: 4
    },
    image: {
        height: "100%",
        width: "100%",
    },
    type: {
        fontSize: 14,
        color: colors.medium
    }
})

export default AppImagePicker
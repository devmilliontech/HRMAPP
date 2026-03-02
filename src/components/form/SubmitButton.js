import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useFormikContext } from 'formik'
import AppButton from '../common/AppButton'

const SubmitButton = ({ loading, title, icon, style }) => {
    const { handleSubmit } = useFormikContext()

    return (
        <AppButton loading={loading} onPress={handleSubmit} style={[styles.button, style]} title={title} icon={icon} />
    )
}

const styles = StyleSheet.create({
    button: {
        marginTop: 12,
    },
})

export default SubmitButton
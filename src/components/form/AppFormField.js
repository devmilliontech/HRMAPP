import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AppTextField from '../common/AppTextField'
import { useFormikContext } from 'formik'
import ErrorMessage from '../common/ErrorMessage'

const AppFormField = ({ name, ...other }) => {
    const { errors, touched, setFieldTouched, setFieldValue, values } = useFormikContext()

    return (
        <View style={styles.container}>
            <AppTextField
                onBlur={() => setFieldTouched(name)}
                onChangeText={(text) => setFieldValue(name, text)}
                value={String(values[name])}
                {...other}
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16
    }
})

export default AppFormField
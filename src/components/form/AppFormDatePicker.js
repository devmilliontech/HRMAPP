import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import ErrorMessage from "../common/ErrorMessage";
import AppDatePicker from "../common/AppDatePicker";

const AppFormDatePicker = ({ name, placeholder, disablePast = false, disableNextDays = 0 }) => {
    const { touched, setFieldTouched, setFieldValue, values, errors } = useFormikContext();


    return (
        <View style={styles.container}>
            <AppDatePicker
                placeholder={placeholder}
                date={values[name]}
                disablePast={disablePast}
                disableNextDays={values?.leaveType?.value == "SL" ? 0 : disableNextDays}
                onSelectDate={(date) => setFieldValue(name, date)}
                onBlur={() => setFieldTouched(name)}
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: "100%"
    }
})

export default AppFormDatePicker;

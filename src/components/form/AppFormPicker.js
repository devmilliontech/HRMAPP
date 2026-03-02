import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useFormikContext } from "formik";
import AppPicker from "../common/AppPicker";
import ErrorMessage from "../common/ErrorMessage";
import AppText from "../common/AppText";

const AppFormPicker = ({ name, icon, placeholder, editable = true, items, ...other }) => {
    const { touched, setFieldTouched, setFieldValue, values, errors } = useFormikContext();

    useEffect(() => {
        if (values?.employee) {
            setFieldValue("baseSalary", values?.employee?.value?.baseSalary || "");
        }
    }, [values?.employee]);

    return (
        <View style={styles.container}>
            <AppPicker
                icon={icon}
                placeholder={placeholder}
                items={items}
                selectedItem={values[name]}
                onSelectItem={(item) => setFieldValue(name, item)}
                onBlur={() => setFieldTouched(name)}
                editable={editable}
                {...other}

            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16
    }
})

export default AppFormPicker;

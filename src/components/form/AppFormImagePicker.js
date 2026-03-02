import { View, Text } from "react-native";
import React from "react";
import { useFormikContext } from "formik";
import AppImagePicker from "../common/AppImagePicker";
import ErrorMessage from "../common/ErrorMessage";

const AppFormImagePicker = ({ name, text, imageType }) => {
    const { errors, values, touched, setFieldTouched, setFieldValue } = useFormikContext();
    return (
        <View>
            <AppImagePicker
                text={text}
                imageType={imageType}
                image={values[name]}
                onSelectImage={(image) => setFieldValue(name, image)}
                onBlur={() => setFieldTouched(name)}
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />
        </View>
    );
};

export default AppFormImagePicker;

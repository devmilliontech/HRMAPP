import { View, StyleSheet, KeyboardAvoidingView, Image, TouchableOpacity, Alert } from "react-native";
import React, { useContext, useEffect } from "react";
import Screen from "../layout/Screen";
import { colors } from "../constants/colors";
import AppText from "../components/common/AppText";
import { useApi } from "../hooks/useApi";
import auth from "../api/auth";
import { AuthContext } from "../context/authcontext";
import AppForm from "../components/form/AppForm";
import * as Yup from "yup";
import AppFormField from "../components/form/AppFormField";
import SubmitButton from "../components/form/SubmitButton";
import AppLoading from "../components/common/AppLoading";
import storage from "../utils/storage";
import { typography } from "../constants/typography";


const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label("Email"),
    password: Yup.string().required().label("Password"),
});

const LoginScreen = () => {
    const { loading, data, request } = useApi(auth.login);
    const { setToken, setRole } = useContext(AuthContext);

    const handleSubmit = async ({ email, password }) => {
        await request(email, password);
    }

    useEffect(() => {
        if (data) {
            setToken(data.sessionId)
            setRole(data.user.role)
            storage.storeToken(data.sessionId)
            storage.storeRole(data.user.role)
        }
    }, [data])

    return (
        <Screen style={styles.container}>

            <KeyboardAvoidingView behavior="padding">

                <View style={styles.logo}>
                    <Image style={styles.image} source={require("../../assets/icon.png")} />
                </View>

                <AppForm
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSubmit(values)}
                >
                    <AppText style={styles.text}>Email ID</AppText>
                    <AppFormField
                        name={"email"}
                        icon={"email"}
                        placeholder={"Email"}
                        autoCorrect={false}
                        autoCapitalize={"none"}
                        keyBoardType="email-address"
                        textContentType="emailAddress"
                    />
                    <AppText style={styles.text}>Password</AppText>
                    <AppFormField
                        name={"password"}
                        autoCapitalize="none"
                        autoCorrect={false}
                        icon={"lock"}
                        placeholder={"Password"}
                        secureTextEntry
                    />
                    <SubmitButton loading={loading} title={"Log In"} icon={"account"} />
                </AppForm>

                <TouchableOpacity onPress={() => Alert.alert("Alert", "Contact HR to Reset Password")}>
                    <AppText style={styles.link}>Forgot Password</AppText>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 40,
    },
    logo: {
        height: 120,
        width: 120,
        borderRadius: 60,
        backgroundColor: colors.primary,
        marginHorizontal: "auto",
        overflow: "hidden",
        marginBottom: 50
    },
    image: {
        height: "100%",
        width: "100%",
        resizeMode: "center"
    },
    text: {
        fontFamily: typography.bold,
        marginBottom: 4,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 12,
    },
    link: {
        fontSize: 20,
        fontWeight: 600,
        color: colors.primary,
        textAlign: "center",
        marginTop: 20,
    },
});

export default LoginScreen;

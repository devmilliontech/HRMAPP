import { View, Text, StyleSheet, TextInput, Pressable, Platform } from "react-native";
import React, { useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import { typography } from "../../constants/typography";

const AppTextField = ({ style, icon, placeholder, ...other }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={[styles.container, style]}>
            {icon && (
                <MaterialCommunityIcons name={icon} color={colors.medium} size={20} />
            )}
            {other?.secureTextEntry ? (
                <TextInput
                    placeholderTextColor={colors.medium}
                    placeholder={placeholder}
                    style={styles.input}
                    {...other}
                    secureTextEntry={!showPassword}
                />
            ) : (
                <TextInput
                    placeholderTextColor={colors.medium}
                    placeholder={placeholder}
                    style={styles.input}
                    {...other}
                />
            )}
            {other?.secureTextEntry && (
                <Pressable onPress={() => setShowPassword((prev) => !prev)}>
                    <Ionicons
                        name={!showPassword ? "eye-off-sharp" : "eye"}
                        color={colors.medium}
                        size={20}
                    />
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.light,
        flexDirection: "row",
        alignItems: "center",
        padding: 6,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "black",
        fontFamily: typography.medium,
        minHeight: 40,
        paddingVertical: Platform.OS === "ios" ? 10 : 8,
    },
});

export default AppTextField;

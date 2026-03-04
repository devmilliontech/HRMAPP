import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppText from "./AppText";

const AppHeader = ({
    title,
    showBack = true,
    rightIcon,
    onRightPress,
}) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                {showBack ? (
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.iconContainer}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconPlaceholder} />
                )}

                <AppText style={styles.title}>{title}</AppText>

                {rightIcon ? (
                    <TouchableOpacity
                        onPress={onRightPress}
                        style={styles.iconContainer}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={rightIcon} size={22} color="#000" />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.iconPlaceholder} />
                )}
            </View>
        </View>
    );
};

export default AppHeader;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
    },
    header: {
        height: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderColor: "#ddd",
    },
    title: {
        fontSize: 18,
        fontWeight: "600",
    },
    iconContainer: {
        width: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    iconPlaceholder: {
        width: 40,
    },
});
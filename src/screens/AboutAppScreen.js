import React from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../components/common/AppText";
import { colors } from "../constants/colors";
import Card from "../layout/Card";
import { STYLES } from "../constants/styles";
import { Linking, TouchableOpacity } from "react-native";


const AboutAppScreen = () => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

            <View style={styles.header}>
                <Image
                    source={require("../../assets/icon.png")}
                    style={styles.logo}
                />
                <AppText style={styles.appName}>HRMAPP</AppText>
                <AppText style={styles.version}>Version 2.1.3</AppText>
            </View>

            <Card>
                <AppText style={STYLES.header}>About HRMAPP</AppText>
                <AppText style={styles.description}>
                    HRMAPP is a comprehensive Human Resource Management system designed
                    to streamline employee management, attendance tracking, payroll processing,
                    and leave management. Built for modern organizations, it enhances productivity
                    and ensures smooth HR operations.
                </AppText>
            </Card>

            <Card>
                <AppText style={STYLES.header}>Key Features</AppText>

                <Feature icon="people-outline" text="Employee Management" />
                <Feature icon="calendar-outline" text="Leave & Attendance Tracking" />
                <Feature icon="cash-outline" text="Payroll & Salary Management" />
                <Feature icon="document-text-outline" text="Performance Reviews" />
                <Feature icon="notifications-outline" text="Real-time Notifications" />
            </Card>

            <Card>
                <AppText style={STYLES.header}>Support & Contact</AppText>

                <View style={styles.iconRow}>

                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => Linking.openURL("mailto:david@millionhits.com.au")}
                    >
                        <Ionicons name="mail-outline" size={26} color={colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => Linking.openURL("tel:03348094489")}
                    >
                        <Ionicons name="call-outline" size={26} color={colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() =>
                            Linking.openURL("https://millionhits.com.au/HRMAPP/")
                        }
                    >
                        <Ionicons name="globe-outline" size={26} color={colors.primary} />
                    </TouchableOpacity>

                </View>
            </Card>



            <View style={styles.footer}>
                <AppText style={styles.footerText}>
                    © 2026 HRMAPP. All Rights Reserved.
                </AppText>
            </View>

        </ScrollView>
    );
};

const Feature = ({ icon, text }) => (
    <View style={styles.featureRow}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <AppText style={styles.featureText}>{text}</AppText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },

    header: {
        alignItems: "center",
        marginBottom: 20,
    },

    logo: {
        width: 90,
        height: 90,
        borderRadius: 20,
        marginBottom: 10,
    },

    appName: {
        fontSize: 22,
        fontWeight: "700",
    },

    version: {
        fontSize: 12,
        color: colors.medium,
        marginTop: 4,
    },

    description: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 10,
    },

    featureRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },

    featureText: {
        marginLeft: 10,
        fontSize: 14,
    },
    iconRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 15,
    },

    iconBtn: {
        backgroundColor: "#F4F6FA",
        padding: 14,
        borderRadius: 50,
    },
    footer: {
        marginTop: 20,
        alignItems: "center",
    },

    footerText: {
        fontSize: 12,
        color: colors.medium,
    },
});


export default AboutAppScreen;

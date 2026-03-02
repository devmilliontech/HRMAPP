import React, { useContext, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import AppText from "../components/common/AppText";
import Card from "../layout/Card";
import BackButton from "../components/specific/BackButton";
import Screen from "../layout/Screen";
import { AuthContext } from "../context/authcontext";
import { useApi } from "../hooks/useApi";
import authApi from "../api/auth";
import storage from "../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ConfirmModal from "../components/specific/ConfirmModal";
import { useUsersStore } from '../store/allUsersStore';
import { useDashboardStore, useHRDashboardStore } from '../store/useDashboardStore';
import { useOwnSalary, useSalaries } from '../store/useSalaryStore';
import { useReportStore } from '../store/useReportStore';
import { usePerformance } from '../store/usePerformanceStore';
import { useAttendance } from "../store/useAttendanceStore";
import { useLeave } from "../store/useLeavesStore";

const SettingsScreen = ({ navigation }) => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { setToken, setRole } = useContext(AuthContext)
    const [loading, setLoading] = useState(false)

    const { request } = useApi(authApi.logout);
    const { resetUsers } = useUsersStore()
    const { resetData: resetUserDashboard } = useDashboardStore()
    const { resetData: resetHRDashboard } = useHRDashboardStore()
    const { resetSalaries } = useSalaries()
    const { resetSalary: resetOwnSalary } = useOwnSalary()
    const { resetReport } = useReportStore()
    const { resetPerformance } = usePerformance()
    const { resetAttendance } = useAttendance()
    const { resetLeaves } = useLeave()

    const handleLogout = async () => {
        setLoading(true)
        const response = await request()
        if (response.ok) {
            setShowLogoutModal(false)
            await storage.removeToken();
            await storage.removeRole();
            await AsyncStorage.clear()
            setToken(null);
            setRole(null);
            resetUsers();
            resetUserDashboard();
            resetHRDashboard();
            resetSalaries();
            resetOwnSalary();
            resetReport();
            resetPerformance();
            resetAttendance();
            resetLeaves();
        }
        setLoading(false)
    }
    return (
        <Screen style={styles.container}>
            <View style={styles.header}>
                <BackButton navigation={navigation} />
                <AppText style={styles.headerTitle}>Settings</AppText>
            </View>

            <ScrollView contentContainerStyle={[styles.content]}>

                <SettingItem icon="account" title="Profile" onPress={() => navigation.navigate("Profile")} />
                <SettingItem icon="bell" title="Notification Settings" onPress={() => navigation.navigate("NotificationSetting")} />

                <SettingItem icon="information" title="About App" onPress={() => navigation.navigate("aboutUs")} />

            </ScrollView>

            <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutModal(true)}>
                {
                    loading ? <ActivityIndicator animating={loading} size={28} color={colors.primary} /> : <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <MaterialCommunityIcons name="logout" size={24} color={colors.primary} />
                        <AppText style={styles.logoutText}>Logout</AppText>
                    </View>
                }
            </TouchableOpacity>

            <ConfirmModal
                header={"Logout?"}
                desc={"Are you sure your want to logout?"}
                visible={showLogoutModal}
                onCancel={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                confirmText={"Logout"}
                confirmBg={colors.danger}
                underlayColor="#ff5c5ce6"
                loading={loading}
            />

            <AppText style={styles.version}>Version 2.1.3</AppText>
        </Screen>
    );
};

const SettingItem = ({ icon, title, onPress }) => (

    <TouchableOpacity activeOpacity={1} onPress={onPress}>
        <Card style={styles.settingRow}>
            <View style={styles.iconBox}>
                <MaterialCommunityIcons
                    name={icon}
                    size={24}
                    color={colors.primary}
                />
            </View>
            <AppText style={styles.settingText}>{title}</AppText>
            <Ionicons name="chevron-forward" size={18} color="#999" />
        </Card>
    </TouchableOpacity>

);



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderBottomWidth: 1,
        borderColor: colors.light
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
    },

    content: {
        padding: 16,

    },

    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 50,
        backgroundColor: "#EEE9FF",
        alignItems: "center",
        justifyContent: "center",
    },

    settingText: {
        flex: 1,
    },
    adminLabel: {
        fontSize: 11,
        color: "#999",
        marginVertical: 10,
        marginLeft: 4,
    },

    logoutButton: {
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.primary,
        margin: 16
    },
    logoutText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: "500",
    },
    cancelButton: {
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.light,
        width: 100,
        alignItems: 'center',
        backgroundColor: colors.light
    },
    confirmButton: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: colors.danger,
        width: 100,
        alignItems: 'center',
    },

    version: {
        fontSize: 14,
        color: "#999",
        textAlign: "center",
        marginBottom: 20
    },
});





export default SettingsScreen;

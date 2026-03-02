import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import AppText from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import Card from "../../layout/Card";
import { StatusBar } from "expo-status-bar";
import AppLoading from "../../components/common/AppLoading";
import useUserStore from "../../store/userStore";
import { STYLES } from "../../constants/styles";
import Screen from "../../layout/Screen";
import { getGreeting } from "../../utils/helper";
import QuickAction from "../../components/specific/QuickActionButton";
import { useHRDashboardStore } from "../../store/useDashboardStore";

const HomeScreen = ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false)
    const { data, setData } = useHRDashboardStore()
    const { user } = useUserStore()

    const onRefresh = async () => {
        setRefreshing(true);
        await setData();
        setRefreshing(false);
    };

    const fetchDashboardData = async () => {
        setLoading(true)
        await setData()
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    return (
        <Screen style={styles.container}>
            <StatusBar style="dark" />
            <AppLoading visible={loading} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderColor: colors.light }}>

                <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ width: "120", height: "40", left: -10 }}>
                    <Image source={require("../../../assets/logo.png")} style={{ height: "100%", width: "100%" }} />
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    {/* <Ionicons name='notifications' size={24} /> */}
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={{ height: 36, width: 36, backgroundColor: colors.light, borderRadius: 50, overflow: 'hidden', paddingTop: 8 }}>
                        <Image source={{ uri: user?.image_url }} style={{ height: "100%", width: "100%" }} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            } contentContainerStyle={styles.content}>
                <AppText style={[STYLES.header, { marginBottom: 0 }]}>{getGreeting()}, {user?.firstName}!</AppText>
                <AppText style={styles.subText}>
                    Here's your team overview for today
                </AppText>

                <Card style={{ marginTop: 20 }}>
                    <View style={styles.cardHeader}>
                        <AppText style={STYLES.header}>Attendance Summary Today</AppText>
                    </View>

                    <View style={styles.attendanceRow}>
                        <AttendanceItem
                            color="#E8FFF1"
                            icon="checkmark"
                            value={data?.attendance?.present}
                            label="Present"
                            valueColor={colors.success}
                        />
                        <AttendanceItem
                            color="#FFECEC"
                            icon="close"
                            value={data?.attendance?.absent}
                            label="Absent"
                            valueColor={colors.danger}
                        />
                        <AttendanceItem
                            color="#FFF8E1"
                            icon="alert"
                            value={data?.attendance?.late}
                            label="Late"
                            valueColor="#E6A700"
                        />
                    </View>
                </Card>

                <AppText style={STYLES.header}>Quick Actions</AppText>

                <View style={styles.row}>
                    <QuickAction
                        width={"48%"}
                        icon={"checkmark-done-circle-sharp"}
                        iconBg={"#e8f1fc"}
                        iconColor={colors.primary}
                        text={"Approve Leaves"}
                        onPress={() => navigation.navigate("leave-requests")}
                    />

                    <QuickAction
                        width={"48%"}
                        icon={"analytics-sharp"}
                        iconBg={"#e8fcea"}
                        iconColor={colors.success}
                        text={"Performance"}
                        onPress={() => navigation.navigate("PerformanceRating")}
                    />
                </View>

                <View style={styles.row}>
                    <QuickAction
                        width={"48%"}
                        icon={"arrow-up-right-box"}
                        iconBg={"#fcf2e8"}
                        iconColor={"#fc8208"}
                        text={"Attendance"}
                        onPress={() => navigation.navigate("getAllAttendance")}
                    />

                    <QuickAction
                        width={"48%"}
                        icon={"add"}
                        iconBg={"#f2e2fe"}
                        iconColor={"#b90ffc"}
                        text={"Add User"}
                        onPress={() => navigation.navigate("AddEmployee")}
                    />
                </View>

                <Card style={{ marginTop: 20 }}>
                    <View style={styles.cardHeader}>
                        <AppText style={[STYLES.header, { marginBottom: 0 }]}>Pending Reviews</AppText>
                        <Ionicons name="list" size={18} />
                    </View>

                    <ApprovalItem
                        title="Daily Reports"
                        subtitle="Pending reviews"
                        count={data?.dailyReports}
                        bg="#E8F1FF"
                        onPress={() => navigation.navigate("viewReports")}
                    />
                </Card>

                <Card>
                    <View style={styles.cardHeader}>
                        <AppText style={[STYLES.header, { marginBottom: 0 }]}>Performance Cycle</AppText>
                        <Ionicons name="bar-chart-outline" size={18} />
                    </View>

                    <View style={styles.performanceBox}>
                        <View>
                            <AppText style={styles.performanceTitle}>{data?.performance?.cycle} Cycle</AppText>
                            <AppText style={styles.subText}>{data?.performance?.pending} pending reviews</AppText>
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={[styles.progressBar, {
                                width: `${(((data?.performance?.total - data?.performance?.pending) / data?.performance?.total) * 100).toFixed(0)}%`
                            }]} />
                        </View>

                        <AppText style={styles.progressText}>{(((data?.performance?.total - data?.performance?.pending) / data?.performance?.total) * 100).toFixed(0)}%</AppText>
                    </View>
                </Card>

            </ScrollView>
        </Screen >
    );
};

const AttendanceItem = ({ color, icon, value, label, valueColor }) => (
    <View style={styles.attendanceItem}>
        <View style={[styles.attendanceIcon, { backgroundColor: color }]}>
            <Ionicons name={icon} size={24} color={valueColor} />
        </View>
        <AppText style={[STYLES.header, { marginBottom: 0, fontSize: 24, color: valueColor }]}>
            {value}
        </AppText>
        <AppText style={styles.subText}>{label}</AppText>
    </View>
);

const ApprovalItem = ({ title, subtitle, count, bg, onPress }) => (
    <TouchableOpacity onPress={onPress} style={[styles.approvalItem, { backgroundColor: bg }]}>
        <View>
            <AppText>{title}</AppText>
            <AppText style={styles.subText}>{subtitle}</AppText>
        </View>
        <View style={styles.badge}>
            <AppText style={styles.badgeText}>{count}</AppText>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        backgroundColor: colors.white,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    appIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
    },

    headerRight: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },

    content: {
        padding: 16,
        paddingBottom: 30,
    },

    subText: {
        fontSize: 14,
        color: colors.medium,
        fontFamily: "Montserrat_400Regular"
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        alignItems: "center"
    },

    cardTitle: {
        fontSize: 14,
        fontWeight: "600",
    },

    attendanceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    attendanceItem: {
        alignItems: "center",
        width: "30%",
    },

    attendanceIcon: {
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12
    },

    approvalItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: "center"
    },

    approvalTitle: {
        fontWeight: "600",
        fontSize: 16,
    },

    badge: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 8,
        height: 24,
        justifyContent: "center",
    },

    badgeText: {
        color: colors.white,
        fontSize: 12,
    },

    performanceBox: {
        backgroundColor: "#F3E8FF",
        padding: 12,
        borderRadius: 12,
    },

    performanceTitle: {
        fontWeight: "600",
        marginBottom: 4,
    },

    progressContainer: {
        height: 6,
        backgroundColor: "#E0D7FF",
        borderRadius: 3,
        marginTop: 10,
    },

    progressBar: {
        height: "100%",
        backgroundColor: colors.primary,
        borderRadius: 3,
    },

    progressText: {
        alignSelf: "flex-end",
        marginTop: 6,
        fontSize: 12,
        fontWeight: "600",
    },
});




export default HomeScreen;

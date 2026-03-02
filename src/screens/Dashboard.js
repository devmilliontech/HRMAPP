import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Screen from "../layout/Screen";
import { colors } from "../constants/colors";
import {
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from "@expo/vector-icons";
import AppText from "../components/common/AppText";
import moment from "moment";
import AppButton from "../components/common/AppButton";
import QuickAction from "../components/specific/QuickActionButton";
import Card from "../layout/Card";
import { useApi } from "../hooks/useApi";
import attendance from "../api/attendance";
import AppLoading from "../components/common/AppLoading";
import { STYLES } from "../constants/styles";
import useUserStore from "../store/userStore";
import { getGreeting } from "../utils/helper";
import ConfirmModal from "../components/specific/ConfirmModal";
import { useDashboardStore } from "../store/useDashboardStore";
import { typography } from "../constants/typography";


const Dashboard = ({ navigation }) => {
    const [loading, setLoading] = useState(false)
    const { data, setData } = useDashboardStore()
    const [postLoading, setPostLoading] = useState(false)
    const checkIn = useApi(attendance.checkIn);
    const checkOut = useApi(attendance.checkOut);

    const [refreshing, setRefreshing] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false)

    const startTime = moment.utc(data?.checkin?.time);
    const [currentTime, setCurrentTime] = useState(moment.utc(`${moment.utc().toISOString().replace("Z", "")}-05:30`));

    const diffDuration = moment.duration(currentTime.diff(startTime));

    const hours = Math.floor(diffDuration.asHours());
    const minutes = diffDuration.minutes();
    const seconds = diffDuration.seconds();

    const timeDiff = `${hours}h ${minutes}m ${seconds}s`;

    const onRefresh = async () => {
        setRefreshing(true);
        await setData();
        setRefreshing(false);
    };

    const { setUser } = useUserStore()

    const score = data?.performanceScore / 5 * 100
    const status = score > 104 ? colors.success : score > 94 ? colors.warning : colors.danger
    const badge = score > 124 ? "Best" : score > 104 ? "Good" : score > 94 ? "Average" : score > 79 ? "Bad" : "Poor"

    const handleCheckins = async () => {
        setPostLoading(true)
        const response = await checkIn.request();
        if (response.ok) {
            await setData();
        }
        setPostLoading(false)
    };

    const handleCheckOut = async () => {
        setPostLoading(true)
        const response = await checkOut.request();
        if (response.ok) {
            await setData();
        }
        setPostLoading(true)
        setShowCheckoutModal(false)
    }

    const fetchDashboardData = async () => {
        setLoading(true)
        await setData()
        setLoading(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, []);

    useEffect(() => {
        if (data) {
            setUser({ ...data?.user, checkIn: data?.checkin })
        }
    }, [data])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(moment.utc(`${moment.utc().toISOString().replace("Z", "")}-05:30`));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const unReadNotifications = data?.notifications?.filter((n) => n.read == false) || null

    return (
        <Screen style={styles.container}>
            <AppLoading visible={loading} text="Loading..." />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                contentContainerStyle={{ paddingBottom: 24 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity style={styles.menu} onPress={navigation.openDrawer}>
                        {/* <MaterialCommunityIcons
                            name="menu"
                            color={colors.white}
                            size={28}
                        /> */}

                        <Image source={require("../../assets/logo2.png")} style={{ height: "100%", width: "100%" }} />
                    </TouchableOpacity>
                    <View style={styles.avatar}>
                        <Image style={styles.image} source={{ uri: data?.user?.image_url }} />
                    </View>
                    <View style={styles.headercontent}>
                        <AppText style={styles.greet}>Welcome back</AppText>
                        <AppText style={{ fontSize: 24, color: colors.white }}>
                            {data?.firstName}
                        </AppText>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                        <View>
                            <MaterialIcons
                                name="notifications-none"
                                size={30}
                                color={colors.white}
                            />
                        </View>
                        {unReadNotifications?.length > 0 && <View style={{ position: "absolute", height: 20, width: 20, borderRadius: "50%", backgroundColor: "red", right: -1, top: -4 }}>
                            <AppText style={{ color: "white", fontSize: 14, width: 20, textAlign: "center" }}>{unReadNotifications?.length < 4 ? unReadNotifications?.length : "4+"}</AppText>
                        </View>}
                    </TouchableOpacity>

                </View>

                <View style={{ paddingHorizontal: 16 }}>
                    <Card style={{ position: "relative", bottom: 40, marginBottom: 0 }}>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View>
                                <AppText style={STYLES.header}>{getGreeting()}</AppText>
                                <AppText style={[STYLES.header, { color: colors.primary }]}>
                                    {data?.firstName}
                                </AppText>
                            </View>
                            <Text style={styles.emoji}>👋</Text>
                        </View>

                        <View style={styles.line}></View>

                        <View style={styles.row}>
                            <AppText style={{ color: colors.medium }}>{moment().format("dddd")}</AppText>
                            <AppText style={{ fontFamily: typography.bold }}>
                                {moment().format("MMM DD, YYYY")}
                            </AppText>
                        </View>
                    </Card>

                    <Card>
                        <View style={styles.row}>
                            <AppText style={[STYLES.header, { marginBottom: 0 }]}>
                                Attendance
                            </AppText>
                            {data?.checkin?.time && !data?.checkout.time ? <AppText style={{ fontSize: 18, fontFamily: typography.bold, color: colors.primary }}>{timeDiff}</AppText> : <MaterialIcons name="timer" size={25} color={colors.primary} />}
                        </View>
                        {
                            !data?.checkin?.status && <>
                                <AppText
                                    style={{
                                        textAlign: "center",
                                        marginTop: 30,
                                        marginBottom: 20,
                                        color: colors.medium,
                                    }}
                                >
                                    You haven't checked in yet
                                </AppText>
                                <AppButton loading={postLoading} title={"CHECK IN NOW"} onPress={handleCheckins} />
                            </>
                        }

                        {
                            !data?.checkout?.status && data?.checkin?.status ? <>
                                <View style={{ marginTop: 15 }} />
                                <AppButton title={"CHECK OUT NOW"} onPress={() => setShowCheckoutModal(true)} />
                            </> : null
                        }

                        {
                            data?.checkin?.status && data?.checkout?.status ? <AppText
                                style={{
                                    textAlign: "center",
                                    marginTop: 30,
                                    marginBottom: 20,
                                    color: colors.medium,
                                }}
                            >
                                Try Next working day
                            </AppText> : null
                        }

                    </Card>

                    <View style={styles.quickActionContainer}>
                        <AppText style={STYLES.header}>Quick Actions</AppText>
                        <View style={[styles.quickActionWrapper, { marginTop: 0 }]}>
                            <QuickAction
                                icon={"calendar"}
                                text={"Apply Leaves"}
                                width={"48%"}
                                iconBg={"#e8f1fc"}
                                iconColor={colors.primary}
                                onPress={() => navigation.navigate("ApplyLeaves")}
                            />
                            <QuickAction
                                icon={"cash"}
                                text={"View PaySlip"}
                                width={"48%"}
                                iconBg={"#e8fcea"}
                                iconColor={colors.success}
                                onPress={() => navigation.navigate("ViewPaySlip")}
                            />
                        </View>

                        <View style={styles.quickActionWrapper}>
                            <QuickAction
                                icon={"document-text-sharp"}
                                text={"Submit Report"}
                                width={"48%"}
                                iconBg={"#fcf2e8"}
                                iconColor={"#fc8208"}
                                onPress={() => navigation.navigate("DailyReports")}
                            />
                            <QuickAction
                                icon={"analytics"}
                                text={"Performance"}
                                width={"48%"}
                                iconBg={"#f2e2fe"}
                                iconColor={"#b90ffc"}
                                onPress={() => navigation.navigate("Performance")}
                            />
                        </View>
                    </View>

                    <View style={{ height: 32 }} />

                    <Card>
                        <View style={styles.row}>
                            <AppText style={[STYLES.header, { marginBottom: 0 }]}>
                                Leave Balance
                            </AppText>
                            <MaterialCommunityIcons
                                name="palm-tree"
                                size={25}
                                color={colors.primary}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 24,
                            }}
                        >
                            <View style={{ alignItems: "center" }}>
                                <AppText
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 700,
                                        color: colors.primary,
                                    }}
                                >
                                    {data?.totalLeaves}
                                </AppText>
                                <AppText style={{ color: colors.medium }}>Total</AppText>
                            </View>

                            <View style={{ alignItems: "center" }}>
                                <AppText
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 700,
                                        color: colors.success,
                                    }}
                                >
                                    {data?.totalLeaves - data?.usedLeaves}
                                </AppText>
                                <AppText style={{ color: colors.medium }}>Available</AppText>
                            </View>

                            <View style={{ alignItems: "center" }}>
                                <AppText
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 700,
                                        color: colors.pending,
                                    }}
                                >
                                    {data?.usedLeaves}
                                </AppText>
                                <AppText style={{ color: colors.medium }}>Used</AppText>
                            </View>
                        </View>
                    </Card>

                    <Card>
                        <View style={styles.row}>
                            <AppText style={[STYLES.header, { marginBottom: 0 }]}>
                                Last Month Performance
                            </AppText>
                            <Ionicons name="star" size={25} color={colors.primary} />
                        </View>

                        <View style={[styles.row, { marginTop: 20 }]}>
                            <View>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <AppText
                                        style={{
                                            fontSize: 24,
                                            fontWeight: 700,
                                            color: colors.primary,
                                        }}
                                    >
                                        {data?.performanceScore || "00"}
                                    </AppText>
                                    <AppText
                                        style={{
                                            fontSize: 24,
                                            fontWeight: 700,
                                            color: colors.medium,
                                        }}
                                    >
                                        /150
                                    </AppText>
                                </View>
                                <AppText style={{ color: colors.medium }}>
                                    {badge} Performance
                                </AppText>
                            </View>
                            <View style={[styles.circle, { borderColor: status }]}>
                                <AppText style={{ color: status, fontWeight: "700" }}>
                                    {data?.performanceScore || 0}
                                </AppText>
                            </View>
                        </View>
                        <View style={styles.line}></View>

                        <View style={styles.row}>
                            <AppText style={{ color: colors.medium }}>Rank in Team</AppText>
                            <AppText
                                style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}
                            >
                                {data?.rankInTeam} of {data?.totalTeamMember}
                            </AppText>
                        </View>
                    </Card>
                </View>
            </ScrollView>

            <ConfirmModal
                visible={showCheckoutModal}
                header={"Check Out?"}
                desc={"Are your sure want to check out ?"}
                confirmBg={colors.danger}
                confirmText={"Check out"}
                onCancel={() => setShowCheckoutModal(false)}
                loading={postLoading}
                onConfirm={handleCheckOut}
            />
        </Screen >
    );
};

const styles = StyleSheet.create({
    menu: {
        position: "absolute",
        top: 20,
        left: 16,
        width: "120",
        height: 40
    },
    header: {
        height: 250,
        padding: 20,
        backgroundColor: colors.primary,
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 40
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 50,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        // paddingTop: 8
    },
    image: {
        height: "100%",
        width: "100%",
        resizeMode: "contain"
    },
    headercontent: {
        flex: 1,
        marginLeft: 16,
    },
    greet: {
        fontSize: 20,
        fontFamily: "Montserrat_700Bold",
        color: colors.white,
        opacity: 0.8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    emoji: {
        fontSize: 36,
    },
    line: {
        height: 1,
        width: "100%",
        backgroundColor: colors.light,
        marginVertical: 26,
    },
    quickActionWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    circle: {
        padding: 8,
        height: 80,
        width: 80,
        borderRadius: 50,
        borderWidth: 10,
        borderColor: colors.success,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Dashboard;

import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppText from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import Card from "../../layout/Card";
import { useApi } from "../../hooks/useApi";
import leavesApi from "../../api/leaves";
import AppLoading from "../../components/common/AppLoading";
import moment from "moment";
import ConfirmModal from "../../components/specific/ConfirmModal";
import { useLeave } from "../../store/useLeavesStore";
import { typography } from "../../constants/typography";

const LeaveRequestScreen = () => {
    const [loading, setLoading] = useState(false)
    const leaveApproveHook = useApi(leavesApi.approveLeave)
    const leaveRejectHook = useApi(leavesApi.rejectLeave)
    const { leaves, setLeaves } = useLeave()
    const [refreshing, setRefreshing] = useState(false)

    const onRefresh = async () => {
        setRefreshing(true)
        await setLeaves()
        setRefreshing(false)
    }

    const getAllLeaves = async () => {
        setLoading(true)
        await setLeaves();
        setLoading(false)
    }

    const handleApproveLeave = async (id) => {
        const response = await leaveApproveHook.request(id)
        if (response.ok) {
            Alert.alert("Leave Approved", "Leave approved successfully")
            await setLeaves();
        }
    }

    const handleRejectLeave = async (id) => {
        const response = await leaveRejectHook.request(id)
        if (response.ok) {
            Alert.alert("Leave Rejected!", "Leave rejected successfully")
            await setLeaves();
        }
    }

    useEffect(() => {
        getAllLeaves();
    }, [])

    const leavesRequests = leaves || [];
    const pending = leavesRequests?.filter((l) => l.status == "PENDING")?.length || 0
    const approved = leavesRequests?.filter((l) => l.status == "APPROVED")?.length || 0
    const rejected = leavesRequests?.filter((l) => l.status == "REJECTED")?.length || 0

    return (
        <View style={styles.container}>

            <AppLoading visible={loading} />

            <ScrollView style={{ padding: 16 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                <View style={styles.stats}>
                    <StatItem value={pending} label="Pending" color={colors.primary} />
                    <Divider />
                    <StatItem value={approved} label="Approved" color={colors.success} />
                    <Divider />
                    <StatItem value={rejected} label="Rejected" color={colors.danger} />
                </View>

                {
                    leavesRequests.map((leave) => (
                        <LeaveCard
                            key={leave.id}
                            item={leave}
                            onApprove={() => handleApproveLeave(leave.id)}
                            onReject={() => handleRejectLeave(leave.id)}
                        />
                    ))
                }

            </ScrollView>
        </View>
    );
};

const StatItem = ({ value, label, color }) => (
    <View style={styles.statItem}>
        <AppText style={[styles.statValue, { color }]}>{value}</AppText>
        <AppText style={styles.statLabel}>{label}</AppText>
    </View>
);

const Divider = () => <View style={styles.divider} />;

const LeaveCard = ({ item, onApprove, onReject }) => {
    const [showModal, setShowModal] = useState(false)
    const [approveLoading, setApproveLoading] = useState(false)
    const [rejectLoading, setRejectLoading] = useState(false)

    const fullName = `${item?.user?.firstName} ${item?.user?.middleName ? item?.user?.middleName + " " : ""}${item?.user?.lastName}`

    return <Card>
        <View style={styles.cardHeader}>
            <View style={styles.userRow}>
                <Image
                    source={{ uri: item?.user?.image_url }}
                    style={styles.avatar}
                />
                <View>
                    <AppText style={styles.name}>{fullName}</AppText>
                    <AppText style={styles.subText}>{item?.user?.team}</AppText>
                </View>
            </View>

            <View style={[styles.leaveType, { backgroundColor: "#E8F1FF" }]}>
                <AppText style={styles.leaveTypeText}>{item?.leaveType}</AppText>
            </View>
        </View>

        <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#777" />
            <AppText style={styles.infoText}>{moment(item?.startDate).format("MMM DD")} - {moment(item?.endDate).format("MMM DD, YYYY")}</AppText>
        </View>

        <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#777" />
            <AppText style={styles.infoText}>{item?.numberOfDays} days</AppText>
        </View>

        <AppText numberOfLines={3} style={styles.reason}>{item?.reason}</AppText>

        <View style={styles.actions}>

            {
                item?.status == "PENDING" ? <>
                    <Button loading={approveLoading} title={"Approve"} onPress={async () => {
                        setApproveLoading(true)
                        await onApprove(item.id);
                        setApproveLoading(false)
                    }} background={colors.success} />
                    <Button title={"Reject"} onPress={() => setShowModal(true)} background={colors.danger} />
                </> : item?.status == "APPROVED" ? <View style={{
                    padding: 12,
                    backgroundColor: "#e0ffec",
                    borderRadius: 8,
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8
                }}>
                    <Ionicons name="checkmark-outline" size={18} color={colors.success} />
                    <AppText style={{ color: colors.success }}>Approved</AppText>
                </View> : <View style={{
                    padding: 12,
                    backgroundColor: "#ffe0e0",
                    borderRadius: 8,
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 8
                }}>
                    <Ionicons name="close-outline" size={20} color={colors.danger} />
                    <AppText style={{ color: colors.danger }}>Rejected</AppText>
                </View>
            }

        </View>

        <ConfirmModal
            visible={showModal}
            header={"Reject Leave Request ?"}
            confirmBg={colors.danger}
            confirmText={"Reject"}
            desc={"Are you sure you want to reject this leave request"}
            onCancel={() => setShowModal(false)}
            onConfirm={async () => {
                setRejectLoading(true)
                await onReject(item.id)
                setShowModal(false)
                setRejectLoading(false)
            }}
            loading={rejectLoading}
        />
    </Card>
};

const Button = ({ loading = false, title, onPress, background }) => {
    return (
        <TouchableOpacity disabled={loading} onPress={onPress} style={[styles.button, { backgroundColor: background }]}>
            {
                loading ? <ActivityIndicator size={24} animating={true} color={colors.white} /> : <>
                    <Ionicons name="checkmark" size={18} color={colors.white} />
                    <AppText style={styles.btnText}>{title}</AppText>
                </>
            }
        </TouchableOpacity>
    );
}


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
        gap: 12,
    },

    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
    },

    headerRight: {
        flexDirection: "row",
        gap: 16,
    },

    subText: {
        fontSize: 12,
        color: "#777",
    },

    stats: {
        flexDirection: "row",
        backgroundColor: colors.white,
        paddingVertical: 14,
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 20
    },

    statItem: {
        alignItems: "center",
    },

    statValue: {
        fontSize: 28,
        fontWeight: "700",
    },

    statLabel: {
        fontSize: 12,
        color: "#777",
    },

    divider: {
        width: 1,
        height: 30,
        backgroundColor: "#E5E5E5",
    },

    content: {
        padding: 16,
        paddingBottom: 30,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    userRow: {
        flexDirection: "row",
        gap: 10,
    },

    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    name: {
        fontFamily: typography.bold,
    },

    leaveType: {
        paddingHorizontal: 20,
        paddingVertical: 4,
        borderRadius: 14,
        height: 28,
        justifyContent: "center",
    },

    leaveTypeText: {
        fontSize: 12,
        fontWeight: "500",
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },

    infoText: {
        fontSize: 12,
        color: "#555",
    },

    reason: {
        fontSize: 13,
        color: "#444",
        marginVertical: 8,
    },

    actions: {
        flexDirection: "row",
        gap: 12,
        marginTop: 10,
    },

    button: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        width: "48%",
    },

    btnText: {
        color: colors.white,
        fontWeight: "600",
    },
});



export default LeaveRequestScreen;

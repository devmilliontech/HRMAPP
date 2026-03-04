import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Modal,
    RefreshControl,
    StatusBar,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import AppText from "../../components/common/AppText";
import Card from "../../layout/Card";
import AppButton from "../../components/common/AppButton";
import { colors } from "../../constants/colors";
import { useApi } from "../../hooks/useApi";
import userApi from "../../api/user";
import AppLoading from "../../components/common/AppLoading";
import moment from "moment";
import AppPicker from "../../components/common/AppPicker";
import AppDatePicker from "../../components/common/AppDatePicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReportStore } from "../../store/useReportStore";
import { typography } from "../../constants/typography";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";

const normalizeDate = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();


const ReportViewScreen = () => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false)
    const { reports, setReports } = useReportStore()
    const [filterReports, setFilterdReports] = useState(null);
    const [date, setDate] = useState(moment().format())
    const [team, setTeam] = useState(null);

    const [refresh, setRefresh] = useState(false)

    const onRefresh = async () => {
        setRefresh(true)
        await setReports()
        setRefresh(false)
    }

    const handleReset = () => {
        setDate(null)
        setTeam(null);
    };

    const fetchReports = async () => {
        setLoading(true)
        await setReports()
        setLoading(false)
    }

    useEffect(() => {
        if (!reports) {
            fetchReports();
        }
    }, []);

    useEffect(() => {
        if (!reports?.length) return;

        let filtered = [...reports];

        if (date) {
            const d1 = normalizeDate(new Date(date))
            filtered = filtered.filter((item) => {
                const d2 = normalizeDate(new Date(item?.date))
                return d1 == d2
            })
        }

        if (team?.value) {
            filtered = filtered.filter(
                item => item?.user?.team?.toLowerCase() === team.value.toLowerCase()
            );
        }

        setFilterdReports(filtered);
    }, [reports, date, team]);

    return (
        <View style={[styles.container, { marginBottom: insets.bottom }]}>
            <AppLoading visible={loading} />
            <ScrollView contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
            >

                <Card>
                    <View
                        style={{
                            width: "100%",
                        }}
                    >
                        <AppText style={styles.label}>Date</AppText>
                        <AppDatePicker
                            date={date}
                            onSelectDate={(date) => setDate(date)}
                            placeholder={"Select Date"}
                        />
                        <View style={{ marginBottom: 16 }}></View>

                        <AppText style={styles.label}>Team</AppText>
                        <AppPicker
                            placeholder="Select Team"
                            selectedItem={team}
                            onSelectItem={(item) => setTeam(item)}
                            items={[
                                { label: "Development", value: "Development" },
                                { label: "Seo", value: "Seo" },
                                { label: "Digital Marketing", value: "Digital Marketing" },
                                { label: "Sales", value: "Sales" },
                            ]}
                        />
                    </View>

                    <TouchableOpacity style={{ marginTop: 8 }} onPress={handleReset}>
                        <AppText style={{ color: colors.primary, textAlign: "right" }}>x clear all filter</AppText>
                    </TouchableOpacity>
                </Card>

                {
                    filterReports?.length == 0 ? <Card>
                        <AppText style={{ textAlign: "center" }}>No Report Available</AppText>
                    </Card> : filterReports?.map((report) => (
                        <ReportCard key={report?.id} report={report} />
                    ))
                }
            </ScrollView>
        </View>
    );
};

const ReportCard = ({ report }) => {

    const [showReport, setShowReport] = useState(false);
    const { request } = useApi(userApi.markAsReadReport)
    const user = report?.user;

    const start = report?.logInTime;
    const end = report?.logOutTime;

    const startTime = moment.utc(start);
    const endTime = moment.utc(end);

    const diffMinutes = endTime.diff(startTime, "minutes");

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    const duration = `${hours}h ${minutes}m`;

    const markAsRead = async (id) => {
        if (!report?.read) {
            request(id)
        }
        setShowReport(true)
    }

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["90%"], []);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (showReport) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [showReport]);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                opacity={0.5}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
            />
        ),
        []
    );

    const fullName = `${user?.firstName} ${user?.middleName ? user?.middleName + " " : ""}${user?.lastName}`

    return (
        <Card>
            <View style={styles.reportHeader}>
                <View style={styles.userRow}>
                    <Image source={{ uri: user?.image_url }} style={styles.avatar} />
                    <View>
                        <AppText numberOfLines={1} style={styles.name}>
                            {fullName}
                        </AppText>
                        <AppText style={styles.subText}>{user?.team}</AppText>
                    </View>
                </View>

                {
                    report?.read ? <View style={[styles.badge, { backgroundColor: "#ebffea" }]}>
                        <AppText style={[styles.badgeText, { color: colors.success }]}>Read</AppText>
                    </View> : <View style={styles.badge}>
                        <AppText style={styles.badgeText}>Pending review</AppText>
                    </View>
                }

            </View>

            <AppText style={styles.reportText}>
                {report?.completedTasks?.slice(0, 2).join(", ")}
            </AppText>
            <View style={styles.metaRow}>
                <View style={styles.meta}>
                    <Ionicons name="time-outline" size={14} />
                    <AppText style={styles.metaText}>{duration}</AppText>
                </View>
                <View style={styles.meta}>
                    <Ionicons name="calendar-outline" size={14} />
                    <AppText style={styles.metaText}>
                        {moment(report?.submittedAt).format("MMM DD, YYYY")}
                    </AppText>
                </View>
            </View>

            <AppButton
                title="View Details"
                style={styles.filterBtn}
                onPress={() => markAsRead(report.id)}
            />

            <BottomSheetModal
                style={{ marginTop: insets.top }}
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                onDismiss={() => setShowReport(false)}
            >

                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 20,
                        paddingVertical: 16
                    }}
                >
                    <AppText style={{ fontSize: 20, fontWeight: "700" }}>Report Details</AppText>
                </View>

                <View style={{ height: 1, backgroundColor: colors.light }} />

                <BottomSheetScrollView
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        paddingBottom: 80
                    }}
                >
                    <Info
                        label="Date"
                        value={moment(report?.date).format("MMM DD, YYYY")}
                    />
                    <Info label="Summary" value={report?.summary} />

                    <AppText style={{ color: colors.medium, fontSize: 14 }}>Completed Tasks</AppText>
                    {
                        report?.completedTasks?.map((r, idx) => <View key={idx}>
                            <AppText>{idx + 1}. {r}</AppText>
                        </View>)
                    }

                    <View style={{ marginBottom: 16 }} />

                    <AppText style={{ color: colors.medium, fontSize: 14 }}>Upcoming Tasks</AppText>

                    {
                        report?.upcomingTasks?.map((r, idx) => <View key={idx}>
                            <AppText>{idx + 1}. {r}</AppText>
                        </View>)
                    }

                    <View style={{ marginBottom: 16 }} />
                    <Info
                        label="Hurdles"
                        value={report?.hurdles || "No hurdles reported"}
                    />
                    <Info label="Working Duration" value={`${hours}h ${minutes}m`} />

                    <Info
                        label="Submitted At"
                        value={moment(report?.submittedAt).format(
                            "MMM DD, YYYY • hh:mm A",
                        )}
                    />

                </BottomSheetScrollView>

            </BottomSheetModal>

        </Card>
    );
};

const Info = ({ label, value }) => (
    <View style={{ marginBottom: 12 }}>
        <AppText style={{ color: colors.medium, fontSize: 14 }}>{label}</AppText>
        <AppText>{value}</AppText>
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },

    modal: {
        backgroundColor: colors.white,
    },

    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        backgroundColor: colors.primary,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerTitle: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "600",
    },

    content: {
        padding: 16,
    },

    label: {
        marginBottom: 6,
    },

    dateRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },

    filterBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#F4F5F9",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        width: "48%",
    },

    filterBtn: {
        marginTop: 6,
        height: 50,
    },


    reportHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    userRow: {
        flexDirection: "row",
        gap: 10,
    },

    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
    },

    name: {
        fontFamily: typography.bold,
        width: 130
    },

    subText: {
        fontSize: 13,
        color: "#777",
    },

    badge: {
        backgroundColor: "#fffde8",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        height: 26,
    },

    badgeText: {
        fontSize: 12,
        color: colors.pending,
    },

    reportText: {
        fontSize: 14,
        color: "#444",
        marginVertical: 8,
    },

    metaRow: {
        flexDirection: "row",
        gap: 14,
        marginBottom: 10,
    },

    meta: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
    },

    metaText: {
        fontSize: 12,
        color: "#777",
    },
});

export default ReportViewScreen;

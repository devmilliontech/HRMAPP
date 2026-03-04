import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import CircularProgress from "../components/specific/CircularProgress";
import AppText from "../components/common/AppText";
import Card from "../layout/Card";
import { colors } from "../constants/colors";
import AppPicker from "../components/common/AppPicker";
import { months, years } from "../constants/data";
import AppLoading from "../components/common/AppLoading";
import { getPreviousMonthYear } from "../utils/helper";
import { usePerformance } from "../store/usePerformanceStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PerformanceScreen = () => {
    const insets = useSafeAreaInsets()
    const { month: initialMonth, year: initialYear } = getPreviousMonthYear();
    const [loading, setLoading] = useState(false)
    const [month, setMonth] = useState(months.find(m => m.value == initialMonth));
    const [year, setYear] = useState(years.find(y => y.value == initialYear));
    const { performance, setPerformance } = usePerformance()
    const [filterdReport, setFilterdReport] = useState([])

    const fetchPerformance = async () => {
        setLoading(true)
        await setPerformance()
        setLoading(false)
    }

    useEffect(() => {
        fetchPerformance()
    }, [])

    useEffect(() => {
        if (!performance) return;


        let filtered = performance;

        if (month?.value) {
            filtered = filtered.filter(
                item => item.month === month.value
            );
        }

        if (year?.value) {
            filtered = filtered.filter(
                item => item.year === year.value
            );
        }

        setFilterdReport(filtered);
    }, [performance, month, year]);


    return (
        <View style={[styles.container, { marginBottom: insets.bottom }]}>
            <AppLoading visible={loading} />
            <ScrollView contentContainerStyle={styles.content}>
                <Card>
                    <AppText style={styles.sectionTitle}>Review Period</AppText>

                    <View style={styles.toggleRow}>
                        <AppPicker selectedItem={month} onSelectItem={(value) => setMonth(value)} width={"48%"} placeholder={"Month"} items={months} />
                        <AppPicker selectedItem={year} onSelectItem={(value) => setYear(value)} width={"48%"} placeholder={"Year"} items={years} />
                    </View>
                </Card>

                <Card>
                    <AppText style={{ textAlign: "center", marginBottom: 20 }}>Overall Performance</AppText>

                    <CircularProgress maxScore={150} percentScore={filterdReport[0]?.performanceScore} />

                    <AppText style={styles.rating}>{filterdReport[0]?.status} PERFORMER</AppText>
                </Card>
                <Card>
                    <AppText style={{ marginBottom: 20 }}>Performance Parameters</AppText>

                    <Parameter label="Tasks" value={filterdReport[0]?.taskCompletionScore} color="#3B82F6" />
                    <Parameter label="Quality" value={filterdReport[0]?.workQuality} color="#EF4444" />
                    <Parameter label="Attendance" value={filterdReport[0]?.attendanceScore} color="#F97316" />

                    <Parameter label="Client Feedback" value={filterdReport[0]?.clientFeedbackScore} color="#EAB308" />
                </Card>

                <Card>
                    <View style={styles.managerHeader}>
                        <View style={styles.avatar} >
                            <Image source={{ uri: filterdReport[0]?.evaluator?.image_url }} style={{ height: "100%", width: "100%" }} resizeMode="contain" />
                        </View>
                        <View>
                            <AppText style={styles.managerName}>Feedback</AppText>
                            <AppText style={styles.subText}>
                                HR
                            </AppText>
                        </View>
                    </View>

                    <AppText style={styles.comment}>
                        "{filterdReport[0]?.hrComment}"
                    </AppText>

                </Card>

                <Card>
                    <View style={styles.managerHeader}>
                        <View style={styles.avatar} >
                            <Image source={{ uri: filterdReport[0]?.evaluator?.image_url }} style={{ height: "100%", width: "100%" }} resizeMode="contain" />
                        </View>
                        <View>
                            <AppText style={styles.managerName}>Feedback</AppText>
                            <AppText style={styles.subText}>
                                Team Lead
                            </AppText>
                        </View>
                    </View>

                    <AppText style={styles.comment}>
                        "{filterdReport[0]?.tlComment}"
                    </AppText>

                </Card>

                <Card>
                    <View style={styles.managerHeader}>
                        <View style={styles.avatar} >
                            <Image source={{ uri: filterdReport[0]?.evaluator?.image_url }} style={{ height: "100%", width: "100%" }} resizeMode="contain" />
                        </View>
                        <View>
                            <AppText style={styles.managerName}>Feedback</AppText>
                            <AppText style={styles.subText}>
                                Manager
                            </AppText>
                        </View>
                    </View>

                    <AppText style={styles.comment}>
                        "{filterdReport[0]?.managerComment}"
                    </AppText>

                </Card>
            </ScrollView>
        </View>
    );
};

const Parameter = ({ label, value, color }) => (
    <View style={styles.paramRow}>
        <View style={styles.paramLeft}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <AppText style={{ width: 120 }}>{label}</AppText>
        </View>

        <View style={styles.paramRight}>
            <View style={styles.bar}>
                <View
                    style={[
                        styles.barFill,
                        { width: `100%`, backgroundColor: color },
                    ]}
                />
            </View>
            <AppText style={styles.value}>{value?.toFixed(1)}</AppText>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        padding: 16,
        paddingBottom: 40,
    },

    toggleRow: {
        width: "100%",
        flexDirection: "row",
        borderRadius: 10,
        padding: 4,
        justifyContent: "space-between",
    },

    toggleBtn: {
        width: "48%",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },

    sectionTitle: {
        marginBottom: 10,
    },

    subText: {
        fontSize: 12,
        color: "#777",
    },

    score: {
        marginTop: 12,
        fontSize: 32,
        fontWeight: "700",
        textAlign: "center",
        color: colors.primary
    },

    rating: {
        textAlign: "center",
        color: "#777",
        marginTop: 12,
    },

    paramRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        backgroundColor: "#F1F2F6",
        padding: 12,
        borderRadius: 10,
    },

    paramLeft: {
        flexDirection: "row",
        alignItems: "center",
        width: "45%",
        gap: 8,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },

    paramRight: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 8,
    },

    bar: {
        width: "75%",
        height: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
    },

    barFill: {
        height: "100%",
        borderRadius: 3,
    },

    value: {
        fontWeight: "700",
    },

    managerHeader: {
        flexDirection: "row",
        gap: 10,
        marginBottom: 8,
    },

    avatar: {
        width: 40,
        height: 40,
        paddingTop: 6,
        overflow: "hidden",
        borderRadius: 20,
        backgroundColor: "#ddd",
    },

    managerName: {
        fontWeight: "600",
    },

    comment: {
        fontSize: 13,
        color: "#444",
        marginTop: 6,
    },
});

export default PerformanceScreen;

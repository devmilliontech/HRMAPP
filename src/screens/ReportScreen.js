import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Modal,
    TouchableHighlight,
    Alert,
} from "react-native";
import AppText from "../components/common/AppText";
import { colors } from "../constants/colors";
import AppButton from "../components/common/AppButton";
import Card from "../layout/Card";
import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { STYLES } from "../constants/styles";
import moment from "moment";
import AppDatePicker from "../components/common/AppDatePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApi } from "../hooks/useApi";
import userApi from "../api/user";
import AppLoading from "../components/common/AppLoading";
import attendanceApi from "../api/attendance";
import useUserStore from "../store/userStore";
import { timeToISOString } from "../utils/helper";
import ConfirmModal from "../components/specific/ConfirmModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { typography } from "../constants/typography";

const ReportScreen = () => {
    const { user } = useUserStore()
    const insets = useSafeAreaInsets()
    const [report, setReport] = useState({
        completedTasks: ["", "", ""],
        logInTime: user?.checkIn?.time ? moment(user?.checkIn?.time).utc().format("hh:mm A") : moment().format("hh:mm A"),
        logOutTime: moment().format("hh:mm A"),
        summary: "",
        hurdles: "",
        upcomingTasks: ["", "", ""],
    });
    const [showSubmitReportModal, setShowSubmitReportModal] = useState(false);

    const { loading, request } = useApi(userApi.submitReport)
    const attendance = useApi(attendanceApi.getCheckin)

    const handleChange = (key, value) => {
        setReport((prev) => ({ ...prev, [key]: value }));
    };

    const handleChangeTasks = (text, key, idx) => {
        setReport((prev) => ({
            ...prev,
            [key]: prev[key].map((t, id) => (id == idx ? text : t)),
        }));
    };

    const handleRemoveTask = (key, idx) => {
        setReport((prev) => ({
            ...prev,
            [key]: prev[key].filter((item, id) => idx != id),
        }));
    };
    const handleAddTask = (key) => {
        setReport((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
    };


    const handleSubmitReport = async () => {
        const transformTasks = report?.completedTasks?.filter(t => t)
        const transformUpcomingTask = report?.upcomingTasks?.filter(t => t)

        const updatedReport = {
            logInTime: timeToISOString(moment().format("Y-MM-DD"), report.logInTime),
            logOutTime: timeToISOString(moment().format("Y-MM-DD"), report.logOutTime),
            completedTasks: transformTasks,
            upcomingTasks: transformUpcomingTask,
            summary: report.summary
        }

        if (report.hurdles) {
            updatedReport.hurdles = report.hurdles
        }

        const response = await request(updatedReport);
        setShowSubmitReportModal(false)
        if (response.ok) {
            setReport({
                completedTasks: ["", "", ""],
                logInTime: null,
                logOutTime: "",
                summary: "",
                hurdles: "",
                upcomingTasks: ["", "", ""],
            })
            Alert.alert("Report Submitted", "Your report has been successfully!")
            await handleResetLocalStorage()
        }
    }

    const startTime = moment(report?.logInTime, "hh:mm A");
    const endTime = moment(report?.logOutTime, "hh:mm A");

    const diffMinutes = moment.duration(endTime.diff(startTime));

    const hours = Math.floor(diffMinutes.asHours());
    const minutes = diffMinutes.minutes();
    const time = `${hours}h ${minutes}m`;

    const handleSaveReport = async () => {
        await AsyncStorage.setItem("report", JSON.stringify(report));
    };

    const handleResetLocalStorage = async () => {
        await AsyncStorage.removeItem("report")
    }

    const LoadReport = async () => {
        const savedReport = JSON.parse(await AsyncStorage.getItem("report"));
        const currentTime = moment().format("hh:mm A")

        if (savedReport) {
            setReport((prev) => ({
                ...prev,
                logOutTime: currentTime,
                completedTasks: savedReport?.completedTasks,
                summary: savedReport?.summary,
                upcomingTasks: savedReport?.upcomingTasks,
                hurdles: savedReport?.hurdles
            }))
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSaveReport();
        }, 1000);

        return () => clearTimeout(timer);
    }, [report]);

    useEffect(() => {
        LoadReport();
    }, []);
    return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1, marginBottom: insets.bottom }}>
            <AppLoading visible={attendance.loading} />
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 30 }}
                keyboardShouldPersistTaps="handled"
            >
                <Card>
                    <View style={[styles.row, { marginBottom: 0 }]}>
                        <View style={[styles.icon, { backgroundColor: "#e8f0ff" }]}>
                            <AntDesign name="calendar" color={colors.primary} size={24} />
                        </View>
                        <View>
                            <AppText style={styles.label}>Report Date</AppText>
                            <AppText
                                style={[STYLES.header, { marginBottom: 0 }]}
                            >{`${moment().format("DD MMM,YYYY")}`}</AppText>
                        </View>
                    </View>
                </Card>

                <Card>
                    <View style={styles.row}>
                        <View style={[styles.icon, { backgroundColor: "#ebffe8" }]}>
                            <FontAwesome6
                                name="circle-check"
                                color={colors.success}
                                size={24}
                            />
                        </View>
                        <AppText style={[STYLES.header, { marginBottom: 0 }]}>
                            Tasks Completed
                        </AppText>
                    </View>
                    {report?.completedTasks?.map((item, idx) => (
                        <INPUT
                            item={item}
                            key={idx}
                            setterKey={"completedTasks"}
                            idx={idx}
                            handleChangeTasks={handleChangeTasks}
                            handleRemoveTask={handleRemoveTask}
                        />
                    ))}

                    <TouchableOpacity
                        style={styles.addTask}
                        onPress={() => handleAddTask("completedTasks")}
                    >
                        <AppText style={styles.addTaskText}>＋ Add Task</AppText>
                    </TouchableOpacity>
                </Card>

                <Card>
                    <View style={styles.row}>
                        <View style={[styles.icon, { backgroundColor: "#ffe9fc" }]}>
                            <Ionicons name="time" color={"#d100ae"} size={24} />
                        </View>
                        <AppText style={[STYLES.header, { marginBottom: 0 }]}>
                            Time Log
                        </AppText>
                    </View>

                    <View style={styles.timeRow}>
                        <View style={{ width: "48%" }}>
                            <AppText style={styles.label}>Start Time</AppText>
                            <AppDatePicker
                                date={report.logInTime}
                                mode="time"
                                placeholder={"Start Time"}
                                onSelectDate={(time) => handleChange("logInTime", time)}
                                editable={false}
                            />
                        </View>

                        <View style={{ width: "48%" }}>
                            <AppText style={styles.label}>End Time</AppText>
                            <AppDatePicker
                                date={report.logOutTime}
                                mode="time"
                                placeholder={"End Time"}
                                onSelectDate={(time) => handleChange("logOutTime", time)}
                            />
                        </View>
                    </View>

                    <View style={styles.totalHours}>
                        <AppText>Total Hours</AppText>
                        <AppText style={styles.totalText}>{time ? time : "0 Hour"}</AppText>
                    </View>
                </Card>

                <Card>
                    <View style={styles.row}>
                        <View style={[styles.icon, { backgroundColor: "#f7e8ff" }]}>
                            <Ionicons
                                name="document-text-outline"
                                color={"#c600e0"}
                                size={24}
                            />
                        </View>
                        <AppText style={[STYLES.header, { marginBottom: 0 }]}>
                            Summary Note
                        </AppText>
                    </View>

                    <View style={styles.textArea}>
                        <TextInput
                            style={{ fontFamily: typography.medium, color: "black" }}
                            placeholderTextColor={colors.medium}
                            multiline={true}
                            maxLength={255}
                            placeholder="Write a brief summary of your day’s work..."
                            onChangeText={(text) => setReport(prev => ({ ...prev, summary: text }))}
                        />
                    </View>

                    <AppText style={styles.charCount}>
                        Min. 50 characters · 0 / 500
                    </AppText>
                </Card>

                <Card>
                    <View style={styles.row}>
                        <View style={[styles.icon, { backgroundColor: "#fff2e8" }]}>
                            <AntDesign name="calendar" color={"#e97400"} size={24} />
                        </View>

                        <AppText style={[STYLES.header, { marginBottom: 0, flex: 1 }]}>
                            Hurdles / Shortcomings
                        </AppText>
                        <AppText style={styles.optional}>Optional</AppText>
                    </View>

                    <View style={styles.textArea}>
                        <TextInput
                            style={{ fontFamily: typography.medium, color: "black" }}
                            placeholderTextColor={colors.medium}
                            multiline={true}
                            maxLength={255}
                            placeholder="Mention any challenges faced..."
                        />
                    </View>


                </Card>

                <Card>
                    <View style={styles.row}>
                        <View style={[styles.icon, { backgroundColor: "#e8f4ff" }]}>
                            <AntDesign name="calendar" color={colors.secondary} size={24} />
                        </View>
                        <AppText style={[STYLES.header, { marginBottom: 0 }]}>
                            Upcoming Tasks
                        </AppText>
                    </View>

                    {report?.upcomingTasks?.map((item, idx) => (
                        <INPUT
                            item={item}
                            idx={idx}
                            key={idx}
                            setterKey={"upcomingTasks"}
                            handleChangeTasks={handleChangeTasks}
                            handleRemoveTask={handleRemoveTask}
                        />
                    ))}

                    <TouchableOpacity
                        style={styles.addTask}
                        onPress={() => handleAddTask("upcomingTasks")}
                    >
                        <AppText style={styles.addTaskText}>＋ Add Task</AppText>
                    </TouchableOpacity>
                </Card>

                <ConfirmModal
                    visible={showSubmitReportModal}
                    header={"Submit Report?"}
                    desc={"Are you sure you want to submit your daily report?"}
                    confirmText={"Submit Report"}
                    onCancel={() => setShowSubmitReportModal(false)}
                    onConfirm={handleSubmitReport}
                    confirmBg={colors.primary}
                    loading={loading}
                />

                <AppButton title="Submit Report" onPress={() => setShowSubmitReportModal(true)} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const INPUT = ({
    item,
    setterKey,
    idx,
    handleChangeTasks,
    handleRemoveTask,
}) => {
    return (
        <View style={styles.input}>
            <AppText style={styles.taskIndex}>{idx + 1}</AppText>
            <TextInput
                placeholderTextColor={colors.medium}
                style={styles.placeholder}
                value={item}
                onChangeText={(text) => handleChangeTasks(text, setterKey, idx)}
                placeholder="Enter the task..."
            />
            <TouchableOpacity onPress={() => handleRemoveTask(setterKey, idx)}>
                <AppText style={styles.remove}>×</AppText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.white,
    },

    icon: {
        padding: 12,
        borderRadius: 8,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
    },

    label: {
        fontSize: 14,
        color: "#777",
        marginBottom: 4,
        fontFamily: typography.medium
    },

    content: {
        padding: 14,
        paddingBottom: 100,
    },

    card: {
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
    },

    cardTitle: {
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 10,
    },

    datePicker: {
        marginTop: 4,
    },

    input: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F4F5F9",
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 8,
    },

    taskIndex: {
        width: 24,
        height: 24,
        borderRadius: 11,
        backgroundColor: colors.primary,
        color: colors.white,
        textAlign: "center",
        lineHeight: 22,
        marginRight: 8,
        fontSize: 12,
    },

    placeholder: {
        flex: 1,
        fontSize: 15,
        fontFamily: typography.medium,
        color: "black",
    },

    remove: {
        fontSize: 18,
        color: "#999",
        marginLeft: 8,
    },

    addTask: {
        marginTop: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: "#E3E5EF",
        borderRadius: 10,
        alignItems: "center",
    },

    addTaskText: {
        color: colors.primary,
        fontWeight: "600",
    },

    timeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    time: {
        fontWeight: "600",
        marginTop: 4,
    },

    totalHours: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#F4F5F9",
        padding: 12,
        borderRadius: 10,
    },

    totalText: {
        fontFamily: typography.bold,
        color: colors.primary,
    },

    textArea: {
        height: 90,
        backgroundColor: "#F4F5F9",
        borderRadius: 10,
        paddingHorizontal: 10
    },
    charCount: {
        marginTop: 6,
        fontSize: 11,
        color: "#999",
        textAlign: "right",
        fontFamily: typography.regular
    },

    optionalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    optional: {
        fontSize: 12,
        color: "#999",
    },

    checkbox: {
        width: 18,
        height: 18,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
    },

    footer: {
        padding: 16,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },

    dragIndicator: {
        position: "absolute",
        top: 8,
        alignSelf: "center",
        width: 48,
        height: 4,
        borderRadius: 999,
        backgroundColor: "#d4d4d8", // zinc-300
    },

    title: {
        fontSize: 24,
        fontWeight: "500",
        marginTop: 24,
        marginBottom: 16,
    },

    subtitle: {
        fontSize: 14,
        color: "#52525b", // zinc-600
    },
});

export default ReportScreen;

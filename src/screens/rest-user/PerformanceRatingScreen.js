import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Modal,
    Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import AppText from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import Card from "../../layout/Card";
import AppButton from "../../components/common/AppButton";
import AppDatePicker from "../../components/common/AppDatePicker";
import { useApi } from "../../hooks/useApi";
import userApi from "../../api/user";
import cache from "../../utils/cache";
import { STYLES } from "../../constants/styles";
import AppPicker from "../../components/common/AppPicker";
import AppTextField from "../../components/common/AppTextField";
import { months, years } from "../../constants/data";
import moment from "moment";
import { useUsersStore } from "../../store/allUsersStore";
import SectionHeader from "../../components/specific/SectionHeader";
import AttendanceMetric from "../../components/specific/AttendanceMetric";

import TaskPerformance from "../../components/specific/TaskPerformance";
import AppSlider from "../../components/specific/AppSlider";
import PerformanceReviewSummary from "../../components/specific/PerformanceReviewSummary";
import UploadScreen from "../UploadScreen";
import performanceApi from "../../api/performance";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppLoading from "../../components/common/AppLoading";

const PerformanceRatingScreen = () => {
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState(0);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(months[moment().month()]);
    const [selectedYear, setSelectedYear] = useState({
        label: moment().year(),
        value: moment().year(),
    });

    const performance = useApi(performanceApi.createPerformanceReport);

    const { users, setUsers } = useUsersStore()
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState();
    const [uploadVisible, setUploadVisible] = useState(false);

    const handleUploadProgress = (progress) => {
        setProgress(progress);
    };

    const [formData, setFormData] = useState({
        presentDays: 0,
        absentDays: 0,
        halfDays: 0,
        lateArrivalDays: 0,
        uninformedLeaves: 0,
        wfhDays: 0,

        totalProjects: 0,
        completedProjects: 0,
        carrieForward: 0,
        missedDeadLine: 0,
        completedBeforeDeadline: 0,

        clientPositiveFeedback: 0,
        clientNegativeFeedback: 0,
        clientsOnboarded: 0,
        clientLost: 0,

        hrComment: "",
        tlComment: "",
        managerComment: "",
        workQuality: 0,
    });

    const handleChange = (key, value) => {
        value = Number(value);
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setUploadVisible(true);
        const response = await performance.request(
            {
                userId: selectedEmployee?.value?.id,
                month: selectedMonth?.value,
                year: selectedYear?.value,
                ...formData,
            },
            handleUploadProgress,
        );
        if (!response.ok) {
            setUploadVisible(false);
            return;
        }

        setFormData({
            presentDays: 0,
            absentDays: 0,
            halfDays: 0,
            lateArrivalDays: 0,
            uninformedLeaves: 0,
            wfhDays: 0,

            totalProjects: 0,
            completedProjects: 0,
            carrieForward: 0,
            missedDeadLine: 0,
            completedBeforeDeadline: 0,

            clientPositiveFeedback: 0,
            clientNegativeFeedback: 0,
            clientsOnboarded: 0,
            clientLost: 0,

            hrComment: "",
            tlComment: "",
            managerComment: "",
            workQuality: 0,
        })
        setStep(0)
        Alert.alert("Report created!", "Performance created successfully!")
    };

    const handleNext = () => {
        setStep((prev) => Math.min(prev + 1, 6));
    };

    const handlePrev = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const getAllUser = async () => {
        setLoading(true)
        await setUsers()
        setLoading(false)
    }

    useEffect(() => {
        if (!users) {
            getAllUser()
        }
    }, [])

    const usersLists = users?.map((item, idx) => {
        const fullName = `${item?.firstName} ${item?.middleName ? item?.middleName + " " : ""}${item?.lastName}`
        return {
            label: fullName,
            value: item
        }
    })

    return (
        <KeyboardAvoidingView behavior="padding" style={[styles.container, { marginBottom: insets.bottom }]}>
            <AppLoading visible={loading} />
            <AppLoading visible={performance.loading} text="Report generating..." />
            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 10 }]}>
                {step == 0 && (
                    <Card>
                        <AppText style={styles.label}>Employee</AppText>
                        <AppPicker
                            style={styles.input}
                            items={usersLists}
                            placeholder={"Choose an employee..."}
                            onSelectItem={(value) => setSelectedEmployee(value)}
                            selectedItem={selectedEmployee}
                        />

                        <AppText style={styles.label}>Rating Period</AppText>
                        <View
                            style={{ flexDirection: "row", justifyContent: "space-between" }}
                        >
                            <AppPicker
                                width="48%"
                                style={styles.input}
                                items={months}
                                placeholder={"Month"}
                                onSelectItem={(value) => setSelectedMonth(value)}
                                selectedItem={selectedMonth}
                            />
                            <AppPicker
                                width="48%"
                                style={styles.input}
                                items={years}
                                placeholder={"Year"}
                                onSelectItem={(value) => setSelectedYear(value)}
                                selectedItem={selectedYear}
                            />
                        </View>
                    </Card>
                )}

                {step == 0 && (
                    <AttendanceMetric formData={formData} onChange={handleChange} />
                )}

                {step == 1 && (
                    <TaskPerformance formData={formData} onChange={handleChange} />
                )}
                {step == 2 && (
                    <View>
                        <SectionHeader
                            icon={"grid"}
                            iconColor={"#0044ff"}
                            title={"HR Score"}
                        />
                        <Card>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginBottom: 8,
                                }}
                            >
                                <AppText>Work quality</AppText>
                                <AppText>{formData?.workQuality}</AppText>
                            </View>
                            <AppSlider
                                minVal={-10}
                                maxVal={10}
                                value={formData?.workQuality}
                                editable={true}
                                color={colors.success}
                                onChange={(val) => handleChange("workQuality", val)}
                            />
                        </Card>

                        <Card>
                            <AppText>HR Feedback </AppText>
                            <TextInput
                                value={formData?.hrComment}
                                onChangeText={(text) =>
                                    setFormData((prev) => ({ ...prev, hrComment: text }))
                                }
                                multiline={true}
                                placeholder="HR Feedback for user"
                            />
                        </Card>

                        <Card>
                            <AppText>Team Lead Feedback </AppText>
                            <TextInput
                                value={formData?.tlComment}
                                onChangeText={(text) =>
                                    setFormData((prev) => ({ ...prev, tlComment: text }))
                                }
                                multiline={true}
                                placeholder="Team Lead Feedback for user"
                            />
                        </Card>

                        <Card>
                            <AppText>Manager Feedback </AppText>
                            <TextInput
                                value={formData?.managerComment}
                                onChangeText={(text) =>
                                    setFormData((prev) => ({ ...prev, managerComment: text }))
                                }
                                multiline={true}
                                placeholder="Manager Feedback for user"
                            />
                        </Card>
                    </View>
                )}
                {step == 3 && <PerformanceReviewSummary formData={formData} />}

                {step == 0 && <AppButton title={"Next"} onPress={handleNext} />}

                {step > 0 ? (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 16,
                        }}
                    >
                        <TouchableOpacity
                            onPress={handlePrev}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: colors.white,
                                borderRadius: 12,
                                padding: 8,
                                height: 60,
                                borderWidth: 1,
                                borderColor: colors.light,
                                width: "48%",
                            }}
                        >
                            <AppText>Previous</AppText>
                        </TouchableOpacity>

                        <AppButton
                            style={{ width: "48%", marginBottom: 0 }}
                            title={step == 3 ? "Submit" : "Next"}
                            onPress={step == 3 ? handleSubmit : handleNext}
                        />
                    </View>
                ) : null}
            </ScrollView>

            {/* <UploadScreen
                onDone={() => setUploadVisible(false)}
                visible={uploadVisible}
                progress={progress}
            /> */}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        padding: 16,
        paddingBottom: 20,
    },

    label: {
        marginBottom: 8,
    },
    input: {
        marginBottom: 12,
    },

    sectionTitle: {
        fontWeight: "700",
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
        fontWeight: "600",
    },

    subText: {
        fontSize: 14,
        color: colors.medium,
    },

    dateRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
    },

    ratingHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    ratingLabel: {
        fontWeight: "700",
    },

    ratingValue: {
        fontWeight: "700",
        color: colors.primary,
    },

    sliderMarks: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
    },

    mark: {
        fontSize: 14,
        color: "#999",
    },

    overallCard: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        alignItems: "center",
    },

    overallLabel: {
        color: "#E0E0FF",
        fontSize: 12,
    },

    overallValue: {
        color: "#fff",
        fontSize: 34,
        fontWeight: "700",
        marginVertical: 6,
    },

    stars: {
        color: "#FFD700",
        fontSize: 16,
    },

    ratingText: {
        color: "#E0E0FF",
        fontSize: 12,
        marginTop: 4,
    },

    textArea: {
        height: 120,
        backgroundColor: "#F4F5F9",
        borderRadius: 10,
        padding: 12,
        textAlignVertical: "top",
    },

    commentFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },

    charCount: {
        fontSize: 11,
        color: "#999",
    },

    voice: {
        fontSize: 11,
        color: colors.primary,
    },

    pdfBtn: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: colors.primary,
        marginTop: 10,
    },
});

export default PerformanceRatingScreen;

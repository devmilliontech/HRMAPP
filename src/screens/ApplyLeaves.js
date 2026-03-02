import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
} from "react-native";
import React, { useState } from "react";
import AppPicker from "../components/common/AppPicker";
import AppFormPicker from "../components/form/AppFormPicker";
import AppForm from "../components/form/AppForm";
import * as Yup from "yup";
import SubmitButton from "../components/form/SubmitButton";
import AppText from "../components/common/AppText";
import { colors } from "../constants/colors";
import AppFormDatePicker from "../components/form/AppFormDatePicker";
import TotalDuration from "../components/form/TotalDuration";
import AppFormField from "../components/form/AppFormField";
import Card from "../layout/Card";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useApi } from "../hooks/useApi";
import leavesApi from "../api/leaves"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDashboardStore } from "../store/useDashboardStore";
import { STYLES } from "../constants/styles";


const leaves = [
    { label: "Sick Leave", value: "SL" },
    { label: "Paid Leave", value: "PL" },
];

const validationSchema = Yup.object().shape({
    leaveType: Yup.object().required().label("Leave type"),
    startDate: Yup.date()
        .required()
        .max(Yup.ref("endDate"), "From date must be earlier than To date")
        .label("From date"),
    endDate: Yup.date()
        .required()
        .min(Yup.ref("startDate"), "To date must be later than From date")
        .label("To date"),
});

const ApplyLeaves = () => {
    const insets = useSafeAreaInsets();
    const { loading, request } = useApi(leavesApi.applyForLeave)
    const { data } = useDashboardStore()
    const handleSubmit = async (values) => {
        const response = await request(values)
        if (response.ok) {
            Alert.alert("Success", "You have successfully applied for leave.")
        }
    }

    return (
        <View>
            <KeyboardAvoidingView behavior="padding">
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ paddingBottom: insets.bottom + 34 }}
                >
                    <AppForm
                        initialValues={{ leaveType: "", reason: "", startDate: null, endDate: null }}
                        validationSchema={validationSchema}
                        onSubmit={(values) => handleSubmit(values)}
                    >
                        <Card style={styles.card}>
                            <AppText style={styles.label}>Leave Type</AppText>
                            <AppFormPicker
                                name={"leaveType"}
                                items={leaves}
                                placeholder={"Select leave type"}
                            />
                        </Card>

                        <Card style={styles.card}>
                            <AppText style={styles.label}>Date Range</AppText>

                            <View
                            // style={{
                            //     flexDirection: "row",
                            //     justifyContent: "space-between",
                            // }}
                            >

                                <AppText style={styles.subText}>From</AppText>
                                <AppFormDatePicker disablePast={true} disableNextDays={15} name={"startDate"} placeholder={"dd-mm-yyy"} />


                                <AppText style={styles.subText}>To</AppText>
                                <AppFormDatePicker disablePast={true} disableNextDays={15} name={"endDate"} placeholder={"dd-mm-yyy"} />
                            </View>

                            <TotalDuration />
                        </Card>

                        <Card style={styles.card}>
                            <AppText style={styles.label}>Reason</AppText>
                            <AppFormField
                                name={"reason"}
                                multiline={true}
                                numberOfLines={4}
                                maxLength={255}
                                placeholder="eg, Going on a trip"
                            />
                        </Card>

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
                        <SubmitButton loading={loading} title={"Submit Leave Request"} />
                    </AppForm>
                </ScrollView>

            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: colors.white,
    },
    label: {
        marginBottom: 8,
    },
    subText: {
        fontSize: 16,
        marginBottom: 8,
        color: colors.medium,
    },
    card: {
        paddingBottom: 12,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    box: {
        backgroundColor: colors.light,
        height: 80,
        width: "30%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
    },
    text: {
        color: colors.medium
    },
    value: {
        fontSize: 24,
        fontWeight: "700",
        color: colors.primary
    }
});

export default ApplyLeaves;

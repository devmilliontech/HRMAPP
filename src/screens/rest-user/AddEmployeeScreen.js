import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Alert } from "react-native";
import AppForm from "../../components/form/AppForm";
import AppFormField from "../../components/form/AppFormField";
import AppFormPicker from "../../components/form/AppFormPicker";
import SubmitButton from "../../components/form/SubmitButton";
import AppText from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import * as Yup from "yup";
import Card from "../../layout/Card";
import AppFormDatePicker from "../../components/form/AppFormDatePicker";
import useUserStore from "../../store/userStore";
import { useApi } from "../../hooks/useApi";
import userApi from "../../api/user"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { typography } from "../../constants/typography";
import { statusList, teams } from "../../constants/data";
import { useTeamsDropdown } from "../../store/useDropdown";

const hrAllowedRole = [
    { label: "Team Lead", value: "tl" },
    { label: "Employee", value: "employee" },
]

const AdminAllowedRole = [
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manager" },
    { label: "HR", value: "hr" },
];


const validationSchema = Yup.object().shape({
    empId: Yup.string().required("Employee ID is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string().email().required("Email is required"),
    mobile: Yup.string()
        .length(10, "Mobile must be 10 digits")
        .required("Mobile is required"),
    dateOfBirth: Yup.string().required("DOB is required"),
    aadhaarNo: Yup.string().required().length(12, "Addhar must be 12 digits").label("Aadhaar"),
    role: Yup.object().required("Role is required"),
    jobRole: Yup.string().required("Job role is required"),
    dateOfJoining: Yup.string().required("Joining Date is required"),
    baseSalary: Yup.number().required().label("Base Salary"),
    team: Yup.object().required("Team is required"),
    status: Yup.object().required("Status is required"),
    password: Yup.string()
        .matches(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric only")
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
});


const AddEmployeeScreen = () => {
    const insets = useSafeAreaInsets();
    const { user } = useUserStore()
    const { dropdown, setDropdown } = useTeamsDropdown()
    const [loading, setLoading] = useState(false)
    const userHook = useApi(userApi.createUser)

    const handleSubmit = async (values, resetForm) => {
        const payload = {
            email: values?.email?.trim(),
            password: values?.password?.trim(),
            mobile: values?.mobile?.trim(),
            empId: values?.empId?.trim(),
            firstName: values?.firstName?.trim(),
            lastName: values?.lastName?.trim(),
            dateOfBirth: values?.dateOfBirth,
            aadhaarNo: values?.aadhaarNo,
            panId: values?.panId ? values?.panId : null,
            jobRole: values?.jobRole?.trim(),
            dateOfJoining: values?.dateOfJoining,
            baseSalary: Number(values?.baseSalary),
            role: values?.role?.value,
            status: values?.status?.value,
            team: values?.team?.value
        }

        if (values?.middleName) payload.middleName = values?.middleName?.trim()
        if (values?.panId) payload.panId = values.panId

        const response = await userHook.request(payload)
        if (response.ok) {
            Alert.alert("User Added", "New User Created Successfully");
            resetForm()
        }
    };


    const fetchTemsDropDown = async () => {
        setLoading(true)
        await setDropdown()
        setLoading(false)
    }

    useEffect(() => {
        if (!dropdown) {
            fetchTemsDropDown()
        }
    }, [])

    return (
        <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 10 }]}>
                <AppForm
                    validationSchema={validationSchema}
                    initialValues={{
                        email: "",
                        password: "",
                        mobile: "",
                        empId: "",
                        firstName: "",
                        middleName: "",
                        lastName: "",
                        dateOfBirth: "",
                        aadhaarNo: "",
                        panId: "",
                        role: "",
                        jobRole: "",
                        team: "",
                        baseSalary: "",
                        dateOfJoining: "",
                        status: "",
                    }}
                    onSubmit={handleSubmit}
                >
                    <Card>
                        <CardHeader
                            icon="person"
                            title="Basic Details"
                            color={colors.primary}
                        />

                        <AppFormField
                            name="empId"
                            placeholder="Employee ID"
                            icon="badge-account-outline"
                        />

                        <AppFormField
                            name="firstName"
                            placeholder="First Name"
                            icon="account-outline"
                        />
                        <AppFormField
                            name="middleName"
                            placeholder="Middle Name"
                            icon="account-outline"
                        />


                        <AppFormField
                            name="lastName"
                            placeholder="Last Name"
                            icon="account-outline"
                        />

                        <AppFormDatePicker
                            name="dateOfBirth"
                            placeholder="Date of Birth"
                            icon="calendar"
                        />

                        <AppFormField
                            name="email"
                            placeholder="Email Address"
                            keyboardType="email-address"
                            icon="email-outline"
                        />

                        <AppFormField
                            name="mobile"
                            placeholder="Mobile Number"
                            keyboardType="phone-pad"
                            icon="phone-outline"
                            maxLength={10}
                        />
                    </Card>

                    <Card>
                        <CardHeader
                            icon="briefcase"
                            title="Work Details"
                            color="#22C55E"
                        />

                        <AppFormPicker
                            name="role"
                            placeholder="Select Role"
                            items={user?.role == "Admin" ? AdminAllowedRole : hrAllowedRole}
                            icon="account-tie-outline"
                        />

                        <AppFormField
                            name="jobRole"
                            placeholder="Job Role"
                            icon="briefcase-outline"
                        />

                        <AppFormPicker
                            name="team"
                            placeholder="Select Team"
                            items={dropdown}
                            icon="account-group-outline"
                        />

                        <AppFormField
                            name="baseSalary"
                            placeholder="Base Salary"
                            keyboardType="numeric"
                            icon="cash"
                        />

                        <AppFormDatePicker
                            name="dateOfJoining"
                            placeholder="Joining Date"
                            icon="calendar"
                        />

                        <AppFormPicker
                            name="status"
                            placeholder="Employment Status"
                            items={statusList}
                            icon="account-check-outline"
                        />
                    </Card>

                    <Card>
                        <CardHeader
                            icon="lock-closed"
                            title="Security & Identity"
                            color="#F59E0B"
                        />

                        <AppFormField
                            name="aadhaarNo"
                            placeholder="Aadhaar Number"
                            keyboardType="numeric"
                            icon="card-account-details-outline"
                            maxLength={12}
                        />

                        <AppFormField
                            name="panId"
                            placeholder="PAN ID"
                            icon="card-text-outline"
                            maxLength={10}
                        />

                        <AppFormField
                            name="password"
                            placeholder="Password"
                            secureTextEntry
                            icon="lock-outline"
                        />
                    </Card>

                    <SubmitButton loading={userHook.loading} title="Add Employee" />
                </AppForm>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const CardHeader = ({ icon, title, color }) => (
    <View style={styles.cardHeader}>
        <View
            style={[
                styles.iconBox,
                { backgroundColor: color + "20" },
            ]}
        >
            <Ionicons name={icon} size={20} color={color} />
        </View>
        <AppText style={styles.cardTitle}>{title}</AppText>
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
    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
    },
    iconBox: {
        width: 34,
        height: 34,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    cardTitle: {
        fontFamily: typography.bold
    },
});


export default AddEmployeeScreen;

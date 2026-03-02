import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
    Alert,
    Modal,
    TouchableHighlight,
    TextInput,
} from "react-native";
import AppText from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import { useUsersStore } from "../../store/allUsersStore";
import AppLoading from "../../components/common/AppLoading";
import ConfirmModal from "../../components/specific/ConfirmModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import userApi from "../../api/user";
import { useApi } from "../../hooks/useApi";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppFormField from "../../components/form/AppFormField";
import SubmitButton from "../../components/form/SubmitButton";
import { useKeyboard } from "../../hooks/useKeyboard";
import AppForm from "../../components/form/AppForm";
import * as Yup from "yup"
import auth from "../../api/auth";
import { typography } from "../../constants/typography";

const EmployeesScreen = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const { users, setUsers } = useUsersStore();
    const [filterdUsers, setFilterdUsers] = useState(users)
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const deleteUser = useApi(userApi.deleteUser)

    const onRefresh = async () => {
        setRefreshing(true);
        await setUsers();
        setRefreshing(false);
    };

    const handleEdit = (employee) => {
        navigation.navigate("EmployeeDetails", { user: employee });
    };

    const handleDeleteUser = async (id) => {
        const response = await deleteUser.request(id)
        if (response.ok) {
            await setUsers()
            Alert.alert("Reponse success", "User deleted successfully!")
        }
    }

    const getAllUsers = async () => {
        setLoading(true);
        await setUsers();
        setLoading(false);
    };

    useEffect(() => {
        if (!users) {
            getAllUsers();
        }
    }, []);

    useEffect(() => {
        if (users) {
            const filterd = users?.filter((u) => u.empId?.toLowerCase().includes(query.toLowerCase()))
            setFilterdUsers(filterd)
        }
    }, [query, users])


    return (
        <ScrollView keyboardDismissMode="none"
            keyboardShouldPersistTaps="always" style={[styles.container, { marginBottom: insets.bottom + 20 }]} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <AppLoading visible={loading} />

            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color={colors.medium} />
                <TextInput value={query} onChangeText={(text) => setQuery(text)} style={styles.input} placeholderTextColor={colors.medium} placeholder="Search by Employee ID" />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                <TouchableOpacity onPress={() => setQuery("")} style={{ padding: 12 }}>
                    <AppText style={{ fontSize: 14, color: colors.primary }}>Clear</AppText>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >

                <View>
                    <View style={[styles.row, styles.headerRow]}>
                        <Cell width={70} title={"Sl No"} header />
                        <Cell width={70} title="Image" header />
                        <Cell title="Employee ID" header />
                        <Cell title="Name" header />
                        <Cell title="Team" header />
                        <Cell title="Status" header />
                        <Cell title="Action" header />
                    </View>

                    {filterdUsers?.map((emp, idx) => (
                        <Row key={idx} emp={emp} index={idx} onEdit={handleEdit} onDelete={handleDeleteUser} />
                    ))}
                </View>
            </ScrollView>
        </ScrollView>
    );
};

const Row = ({ emp, index, onEdit, onDelete }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false)
    const [showResetModal, setShowResetModal] = useState(false)
    const { isOpen, keyboardHeight } = useKeyboard()
    const resetPassword = useApi(auth.resetPassword)
    const insets = useSafeAreaInsets()

    const handleResetPassword = async (values, resetForm) => {
        const response = await resetPassword.request(emp.id, values.password)
        if (response.ok) {
            setShowResetModal(false)
            resetForm()
            Alert.alert("Password Reset", "Password reset successfully!")
        }
    }

    return (
        <TouchableOpacity onPress={() => onEdit(emp)} style={[styles.row, { flexDirection: "row" }]}>
            <Cell width={70} title={index + 1} />
            <View style={[styles.cell, styles.imageCell]}>
                <Image source={{ uri: emp?.image_url }} style={styles.avatar} />
            </View>

            <Cell title={emp?.empId} />
            <Cell title={emp?.firstName} />
            <Cell title={emp?.team} />
            <Cell title={emp?.status} />

            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    width: 150,
                }}
            >
                <TouchableOpacity onPress={() => setShowModal(true)}>
                    <MaterialCommunityIcons name="delete" size={20} color={colors.danger} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setShowResetModal(true)}>
                    <MaterialCommunityIcons name="lock-reset" size={20} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <Modal
                visible={showResetModal}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setShowResetModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalBox,
                            isOpen && { paddingBottom: keyboardHeight + 12 },
                        ]}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <AppForm
                                validationSchema={Yup.object().shape({
                                    password: Yup.string()
                                        .matches(/^[a-zA-Z0-9]+$/, "Password must be alphanumeric only")
                                        .min(8, "Password must be at least 8 characters")
                                        .required("Password is required"),
                                })}
                                initialValues={{ password: "" }}
                                onSubmit={handleResetPassword}
                            >
                                <AppText style={styles.modalTitle}>Enter new password</AppText>

                                <AppFormField
                                    placeholder="password"
                                    name="password"
                                    icon="lock"
                                />

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginTop: 12,
                                        paddingBottom: insets.bottom + 10
                                    }}
                                >
                                    <View style={{ width: "48%" }}>
                                        <TouchableHighlight
                                            underlayColor={colors.medium}
                                            style={styles.cancel}
                                            onPress={() => setShowResetModal(false)}
                                        >
                                            <AppText>Cancel</AppText>
                                        </TouchableHighlight>
                                    </View>

                                    <View style={{ width: "48%" }}>
                                        <SubmitButton loading={resetPassword.loading} title="Save" style={styles.save} />
                                    </View>
                                </View>
                            </AppForm>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <ConfirmModal
                visible={showModal}
                header={"Delete Employee?"}
                desc={"Are you sure you want to delete this employee?"}
                confirmText={"Delete"}
                confirmBg={colors.danger}
                onCancel={() => setShowModal(false)}
                loading={loading}
                onConfirm={async () => {
                    setLoading(true)
                    await onDelete(emp.id)
                    setLoading(false)
                    setShowModal(false)

                }}
            />
        </TouchableOpacity>
    );
};

const Cell = ({ title, header, width = 150 }) => (
    <View style={[styles.cell, { width: width }, header && styles.headerCell]}>
        <AppText style={[styles.cellText, header && styles.headerText]}>
            {title}
        </AppText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },

    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
        alignItems: "center",
    },

    headerRow: {
        backgroundColor: "#F3F4F6",
    },

    cell: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    headerCell: {
        backgroundColor: "#F3F4F6",
    },

    cellText: {
        fontSize: 13,
    },

    headerText: {
        fontWeight: "600",
    },

    imageCell: {
        width: 70,
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    modalBox: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },

    modalTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },

    cancel: {
        backgroundColor: "#EEE",
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    save: {
        height: 50,
        borderRadius: 50,
        marginTop: 0
    },
    searchBar: {
        position: "relative",
        padding: 4,
        width: "100%",
        borderWidth: 1,
        borderColor: colors.light,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8
    },
    input: {
        fontFamily: typography.medium,
        flex: 1
    }
});

export default EmployeesScreen;

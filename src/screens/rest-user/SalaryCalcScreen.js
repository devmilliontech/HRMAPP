import React, { use, useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
    KeyboardAvoidingView,
    TouchableHighlight,
    Alert,
    Platform,
    RefreshControl,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppText from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import Card from "../../layout/Card";
import { STYLES } from "../../constants/styles";
import AppForm from "../../components/form/AppForm";
import AppFormField from "../../components/form/AppFormField";
import * as Yup from "yup";
import SubmitButton from "../../components/form/SubmitButton";
import { months, years } from "../../constants/data";
import moment from "moment";
import { useApi } from "../../hooks/useApi";
import salaryApi from "../../api/salary";
import AppLoading from "../../components/common/AppLoading";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useKeyboard } from "../../hooks/useKeyboard";
import AppPicker from "../../components/common/AppPicker";
import AppButton from "../../components/common/AppButton";
import AppTextField from "../../components/common/AppTextField";
import { useUsersDropdown } from "../../store/useDropdown";

const SalaryCalcScreen = () => {
    const { isOpen, keyboardHeight } = useKeyboard();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const insets = useSafeAreaInsets();
    const { dropdown, setDropdown } = useUsersDropdown();
    const salary = useApi(salaryApi.createSalary);

    const [seletecEmployee, setSelectedEmployee] = useState(null);
    const [month, setMonth] = useState(months[moment().month()]);
    const [year, setYear] = useState({
        label: moment().year(),
        value: moment().year(),
    });

    const [allowances, setAllowances] = useState([
        { name: "House Rent Allowance", amount: "00" },
        { name: "Transport Allowance", amount: "00" },
        { name: "Medical Allowance", amount: "00" },
    ]);

    const [deductions, setDeductions] = useState([
        { name: "Provident Fund", amount: "00" },
        { name: "Professional Tax", amount: "00" },
        { name: "Absent", amount: "00" },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(null);

    const onRefresh = async () => {
        setRefreshing(true);
        await setDropdown();
        setRefreshing(false);
    };

    const handleEmployeeSelect = (employee) => {
        const basic = Number(employee?.value?.baseSalary || 0);

        setSelectedEmployee(employee);

        const da = Math.round(basic * 0.5);
        const hra = Math.round(basic * 0.25);
        const ta = Math.round(basic * 0.25);
        const ma = Math.round(basic * 0.25);
        const other = Math.round(basic * 0.25);

        setAllowances([
            { name: "Dearness Allowance", amount: da },
            { name: "House Rent Allowance", amount: hra },
            { name: "Travel Allowance", amount: ta },
            { name: "Medical Allowance", amount: ma },
            { name: "Other Allowance", amount: other },
        ]);

        const pf = Math.round((basic + da) * 0.12);
        const pTax = 130;

        setDeductions([
            { name: "Provident Fund", amount: pf },
            { name: "Professional Tax", amount: pTax },
            { name: "Absent", amount: "00" },
        ]);
    };

    const handleCreateSalary = async () => {
        if (!seletecEmployee) {
            Alert.alert("Missing field", "Please select the employee!");
            return;
        }
        const payload = {
            month: Number(month.value),
            year: Number(year.value),
            allowances: allowances,
            deductions: deductions,
        };

        const reponse = await salary.request(seletecEmployee.value.id, payload);
        if (reponse.ok) {
            Alert.alert("Salary Created", "Salary report created successfully");
        }
    };

    const openModal = (type) => {
        setModalType(type);
        setModalVisible(true);
    };

    const handleChange = (setter, text, id) => {
        setter((prev) =>
            prev.map((item, idx) => (idx == id ? { ...item, amount: text } : item)),
        );
    };

    const handleRemove = (setter, i) => {
        setter((prev) => prev.filter((item, idx) => i != idx));
    };

    const saveModalItem = ({ itemName, itemAmount }) => {
        if (!itemName || !itemAmount) return;

        if (modalType === "allowance") {
            setAllowances((p) => [...p, { name: itemName, amount: itemAmount }]);
        } else {
            setDeductions((p) => [...p, { name: itemName, amount: itemAmount }]);
        }
        setModalVisible(false);
    };

    const getUsersdropdown = async () => {
        setLoading(true);
        await setDropdown();
        setLoading(false);
    };

    useEffect(() => {
        getUsersdropdown();
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.content,
                    { paddingBottom: insets.bottom + 10 },
                ]}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <AppLoading visible={loading} />

                <Card>
                    <SectionHeader
                        title="Select Employee"
                        icon={"calculator"}
                        iconBg={"#d9deff"}
                        iconColor={colors.primary}
                    />
                    <AppText style={styles.label}>Employee</AppText>
                    <AppPicker
                        style={styles.input}
                        items={dropdown}
                        placeholder={"Choose an employee..."}
                        selectedItem={seletecEmployee}
                        onSelectItem={(item) => handleEmployeeSelect(item)}
                    />
                    <AppText style={styles.label}>Base Amount</AppText>
                    <AppTextField
                        placeholder="Enter base salary"
                        icon="currency-rupee"
                        style={styles.input}
                        value={
                            seletecEmployee?.value?.baseSalary
                                ? String(seletecEmployee?.value?.baseSalary)
                                : "0"
                        }
                        keyboardType="numeric"
                        editable={false}
                    />
                    <AppText style={styles.label}>Salary Period</AppText>
                    <View style={styles.row}>
                        <View style={{ width: "48%" }}>
                            <AppPicker
                                style={styles.input}
                                items={months}
                                placeholder={"Month"}
                                selectedItem={month}
                                onSelectItem={(item) => setMonth(item)}
                            />
                        </View>
                        <View style={{ width: "48%" }}>
                            <AppPicker
                                style={styles.input}
                                items={years}
                                placeholder={"Year"}
                                selectedItem={year}
                                onSelectItem={(item) => setYear(item)}
                            />
                        </View>
                    </View>
                </Card>

                <Card>
                    <SectionHeader
                        title="Allowances"
                        icon={"add-circle"}
                        iconBg={"#d9ffdd"}
                        iconColor={colors.success}
                    />

                    {allowances.map((item, i) => (
                        <Row
                            key={i}
                            name={item.name}
                            amount={item.amount}
                            onChange={(text) => handleChange(setAllowances, text, i)}
                            onRemove={() => handleRemove(setAllowances, i)}
                        />
                    ))}
                    <AddButton onPress={() => openModal("allowance")} />
                </Card>

                <Card>
                    <SectionHeader
                        title="Deduction Rules"
                        icon={"remove-circle-sharp"}
                        iconBg={"#ffd9d9"}
                        iconColor={colors.danger}
                    />

                    {deductions.map((item, i) => (
                        <Row
                            key={i}
                            name={item.name}
                            amount={item.amount}
                            danger
                            onRemove={() => handleRemove(setDeductions, i)}
                            onChange={() => handleChange(setDeductions, i)}
                        />
                    ))}

                    <AddButton onPress={() => openModal("deduction")} />
                </Card>

                <AppButton
                    loading={salary.loading}
                    onPress={handleCreateSalary}
                    title="Generate Salary Report"
                />
            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setModalVisible(false)}
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
                                    itemName: Yup.string().required().label("This"),
                                    itemAmount: Yup.string().required().label("This"),
                                })}
                                initialValues={{ itemName: "", itemAmount: "" }}
                                onSubmit={saveModalItem}
                            >
                                <AppText style={styles.modalTitle}>
                                    {modalType === "allowance"
                                        ? "Add Allowance"
                                        : "Add Deduction"}
                                </AppText>

                                <AppFormField
                                    placeholder="Name"
                                    name="itemName"
                                    icon="rename-box-outline"
                                />

                                <AppFormField
                                    placeholder="Amount"
                                    keyboardType="numeric"
                                    name="itemAmount"
                                    icon="currency-rupee"
                                />

                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        marginTop: 12,
                                        paddingBottom: insets.bottom + 10,
                                    }}
                                >
                                    <View style={{ width: "48%" }}>
                                        <TouchableHighlight
                                            underlayColor={colors.medium}
                                            style={styles.cancel}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <AppText>Cancel</AppText>
                                        </TouchableHighlight>
                                    </View>

                                    <View style={{ width: "48%" }}>
                                        <SubmitButton title="Save" style={styles.save} />
                                    </View>
                                </View>
                            </AppForm>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const SectionHeader = ({ title, icon, iconColor, iconBg }) => (
    <View style={styles.sectionHeader}>
        <View
            style={{
                padding: 6,
                backgroundColor: iconBg,
                borderRadius: 8,
            }}
        >
            <Ionicons name={icon} color={iconColor} size={24} />
        </View>
        <AppText style={styles.sectionTitle}>{title}</AppText>
    </View>
);

const Row = ({ name, amount, danger, onChange, onRemove }) => (
    <View style={styles.row}>
        <AppText numberOfLines={1} style={{ width: "50%" }}>
            {name}
        </AppText>
        <View style={styles.amount}>
            <AppText>₹</AppText>
            <TextInput
                value={`${amount}`}
                onChangeText={(text) => onChange(text)}
                style={[{ flex: 1 }, danger && { color: colors.danger }]}
                keyboardType="numeric"
            />
        </View>
        <TouchableOpacity onPress={onRemove} style={{ padding: 4 }}>
            <MaterialCommunityIcons
                size={18}
                name="minus-circle"
                color={colors.danger}
            />
        </TouchableOpacity>
    </View>
);

const AddButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.addBtn}>
        <AppText style={styles.addText}>+ Add New</AppText>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 16, paddingBottom: 20 },

    progressTrack: {
        height: 6,
        backgroundColor: "#E5E7EB",
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 6,
    },

    progressFill: {
        height: "100%",
        borderRadius: 3,
    },

    slider: {
        transform: [{ scaleY: 1.3 }],
    },

    sectionHeader: {
        flexDirection: "row",
        marginBottom: 16,
        alignItems: "center",
    },

    sectionTitle: {
        ...STYLES.header,
        marginBottom: 0,
        flex: 1,
        marginLeft: 12,
    },
    label: { marginBottom: 6 },

    input: {
        marginBottom: 12,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    amount: {
        width: "30%",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: colors.light,
        paddingHorizontal: 4,
        borderRadius: 12,
    },

    disabled: { backgroundColor: "#EEE", color: "#999" },

    addBtn: {
        paddingVertical: 10,
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 10,
        borderColor: "#CCC",
        alignItems: "center",
        marginTop: 8,
    },

    addText: { color: colors.primary, fontWeight: "600" },

    /* MODAL */
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
        marginTop: 0,
    },
});

export default SalaryCalcScreen;

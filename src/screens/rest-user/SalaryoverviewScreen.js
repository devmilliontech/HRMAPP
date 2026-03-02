import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from "react-native";
import AppText from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import Card from "../../layout/Card";
import { STYLES } from "../../constants/styles";
import { months, years } from "../../constants/data";
import { useApi } from "../../hooks/useApi";
import salaryApi from "../../api/salary";
import AppPicker from "../../components/common/AppPicker";
import AppLoading from "../../components/common/AppLoading";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "../../components/common/AppButton";
import ConfirmModal from "../../components/specific/ConfirmModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSalaries } from "../../store/useSalaryStore";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { getPreviousMonthYear } from "../../utils/helper";
import { useTeamsDropdown } from "../../store/useDropdown";

const status = [
    {
        statusColor: colors.success,
        label: "Locked",
        status: "LOCKED",
        value: "Disbursed",
        subText: "Salary disbursed",
    },
    {
        statusColor: colors.pending,
        label: "Pending",
        status: "PENDING",
        value: "Created",
        subText: "Salary created",
    },
];

const SalaryoverviewScreen = ({ navigation }) => {
    const { month: initialMonth, year: initialYear } = getPreviousMonthYear();
    const { salaries, setSalaries } = useSalaries()
    const { dropdown, setDropdown } = useTeamsDropdown()
    const lockAllSalary = useApi(salaryApi.lockAllSalary)
    const [filterdSalary, setFilterSalary] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [filterData, setFilterData] = useState({
        month: months.find(m => m.value == initialMonth) || "",
        year: years.find(y => y.value == initialYear) || "",
        team: "",
    });

    const onRefresh = async () => {
        setRefreshing(true)
        await setSalaries()
        setRefreshing(false)
    }

    const handleChange = (key, value) => {
        setFilterData((prev) => ({ ...prev, [key]: value }));
    };

    const handleUpdateStatus = async (status, id) => {
        if (status == "LOCKED") {
            await salaryApi.updateSalaryAsLocked(id)
        } else {
            await salaryApi.updateSalaryAsPending(id)
        }
        await setSalaries()
    };

    const handleLockAllSalary = async () => {
        await lockAllSalary.request()
    }

    const handleResetFilter = () => {
        setFilterData({ month: "", year: "", team: "" });
    };

    const fetchSalaries = async () => {
        setLoading(true)
        await setSalaries();
        await setDropdown();
        setLoading(false)
    }

    useEffect(() => {
        if (!salaries) {
            fetchSalaries()
        }
    }, []);

    useEffect(() => {
        if (salaries) {
            setFilterSalary(salaries || []);
        }
    }, []);

    useEffect(() => {
        if (salaries) {
            let filerdSalary = [...salaries]
            if (filterData?.month) {
                filerdSalary = filerdSalary?.filter((s, i) => s.month == filterData.month.value)
            }
            if (filterData?.year) {
                filerdSalary = filerdSalary.filter((s, i) => s.year == filterData.year.value)
            }
            if (filterData?.team) {
                filerdSalary = filerdSalary.filter((s, i) => s?.user?.team?.toLowerCase() == filterData?.team?.value?.toLowerCase())
            }
            setFilterSalary(filerdSalary)
        }
    }, [filterData, salaries])

    const totalSalary = filterdSalary.reduce(
        (acc, item) => acc + (item?.grossSalary || 0),
        0,
    );

    const isPending = filterdSalary?.some(item => item.status == "PENDING")

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom }]}>
            <AppLoading visible={loading} />
            <ScrollView contentContainerStyle={styles.content} refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                <Card>
                    <View
                        style={{ flexDirection: "row", justifyContent: "space-between" }}
                    >
                        <View style={{ width: "48%" }}>
                            <AppText style={styles.label}>Month</AppText>
                            <AppPicker
                                selectedItem={filterData.month}
                                placeholder={"Select month"}
                                onSelectItem={(val) => handleChange("month", val)}
                                items={months}
                            />
                        </View>

                        <View style={{ width: "48%" }}>
                            <AppText style={styles.label}>Year</AppText>
                            <AppPicker
                                selectedItem={filterData.year}
                                onSelectItem={(val) => handleChange("year", val)}
                                placeholder={"Select year"}
                                items={years}
                            />
                        </View>
                    </View>
                    <View style={{ marginBottom: 16 }} />

                    <AppText style={styles.label}>Team</AppText>
                    <AppPicker
                        selectedItem={filterData.team}
                        onSelectItem={(val) => handleChange("team", val)}
                        placeholder={"Select Team"}
                        items={dropdown}
                    />

                    <TouchableOpacity onPress={handleResetFilter}>
                        <AppText
                            style={{
                                color: colors.primary,
                                fontSize: 14,
                                marginTop: 8,
                                textAlign: "right",
                            }}
                        >
                            x clear all filter
                        </AppText>
                    </TouchableOpacity>
                </Card>

                <View style={styles.payrollCard}>
                    <View>
                        <AppText style={styles.payrollLabel}>Total Payroll</AppText>
                        <AppText style={styles.payrollValue}>
                            ₹{totalSalary?.toLocaleString() || "000"}
                        </AppText>
                    </View>

                    <View style={styles.payrollRow}>
                        <View>
                            <AppText style={styles.payrollSmall}>Employees</AppText>
                            <AppText style={styles.payrollSmallValue}>
                                {filterdSalary?.length || 0}
                            </AppText>
                        </View>
                        <View>
                            <AppText style={styles.payrollSmall}>Avg. Salary</AppText>
                            <AppText style={styles.payrollSmallValue}>
                                ₹{(totalSalary / filterdSalary?.length) ? (totalSalary / filterdSalary?.length)?.toFixed(0) : "0"}
                            </AppText>
                        </View>
                    </View>
                </View>

                <View style={styles.employeeHeader}>
                    <AppText style={styles.heading}>Employees Salary</AppText>
                </View>

                {filterdSalary.length == 0 ? (
                    <AppText style={{ textAlign: "center", marginTop: 14 }}>
                        No data available
                    </AppText>
                ) : (
                    filterdSalary?.map((item, id) => (
                        <SalaryCard
                            onPress={() => navigation.navigate("salarybreakdown", { salaryData: item })}
                            key={id}
                            item={item}
                            onUpdateStatus={handleUpdateStatus}
                        />
                    ))
                )}

                {isPending && <AppButton title={"Bulk Disbursed"} onPress={() => setShowModal(true)} />}

                <ConfirmModal
                    visible={showModal}
                    confirmBg={colors.primary}
                    header={"Bulk Disbursed ?"}
                    desc={"Are you sure you want to lock all salary"}
                    confirmText={"Bulk Disbursed"}
                    onCancel={() => setShowModal(false)}
                    onConfirm={async () => {
                        await handleLockAllSalary()
                        setShowModal(false)
                    }}
                    loading={lockAllSalary.loading}
                />

            </ScrollView>
        </View>
    );
};

const SalaryCard = ({ onPress, item, onUpdateStatus }) => {
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["60%"], []);
    const isPending = item?.status == "PENDING";
    const [showModal, setShowModal] = useState(false);

    const [loading, setLoading] = useState(false)
    const user = item?.user;

    useEffect(() => {
        if (showModal) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [showModal]);
    const insets = useSafeAreaInsets()

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

    return (
        <TouchableOpacity activeOpacity={1} onPress={onPress}>
            <Card>
                <View style={styles.salaryHeader}>
                    <View style={styles.userRow}>
                        <Image source={{ uri: user?.image_url }} style={styles.avatar} />
                        <View>
                            <AppText style={styles.name}>{user?.firstName}</AppText>
                            <AppText style={styles.subText}>{user?.team}</AppText>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.status,
                            { backgroundColor: isPending ? "#FFF3D6" : "#E8FFF1" },
                        ]}
                    >
                        <TouchableOpacity onPress={() => setShowModal(true)}>
                            <AppText
                                style={{
                                    fontSize: 12,
                                    color: isPending ? "#E6A700" : colors.success,
                                }}
                            >
                                {item?.status == "LOCKED" ? " DISBURSED" : "CREATED"}
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: colors.light,
                        marginVertical: 8,
                    }}
                />

                <Row label="Gross Salary" value={item?.grossSalary} />
                <Row label="Deductions" value={item?.totalDeduction} danger />
                <View
                    style={{
                        height: 1,
                        width: "100%",
                        backgroundColor: colors.light,
                        marginVertical: 8,
                    }}
                />
                <Row label="Net Salary" value={item?.netSalary} highlight />

                <BottomSheetModal
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    backdropComponent={renderBackdrop}
                    onDismiss={() => setShowModal(false)}
                >
                    <BottomSheetView
                        style={[styles.modal, { paddingBottom: insets.bottom + 20 }]}
                    >

                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginBottom: 28,
                            }}
                        >
                            <View style={{ flexDirection: "row", gap: 6 }}>
                                <Ionicons name="settings" size={24} color={"#022cff"} />
                                <AppText style={{ fontSize: 18 }}>
                                    Change Salary Report Status
                                </AppText>
                            </View>

                        </View>

                        {status.map((s, idx) => (
                            <TouchableOpacity
                                onPress={async () => {
                                    if (s.status == item.status) {
                                        return
                                    }
                                    setLoading(true)
                                    await onUpdateStatus(s.status, item.id)
                                    setLoading(false)
                                    setShowModal(false)
                                }}
                                key={idx}
                                style={{
                                    padding: 16,
                                    borderWidth: 2,
                                    borderRadius: 12,
                                    backgroundColor:
                                        s.status == item.status ? "#d1e0ff" : "#eeeeee",
                                    borderColor:
                                        s.status == item.status ? colors.secondary : "#c8c8c8",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 12,
                                }}
                            >
                                <View
                                    style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                                >
                                    <View
                                        style={{
                                            height: 12,
                                            width: 12,
                                            backgroundColor: s.statusColor,
                                            borderRadius: 50,
                                        }}
                                    ></View>
                                    <View>
                                        <AppText style={{ fontWeight: "700", color: "#4a4a4a" }}>
                                            {s.label}
                                        </AppText>
                                        <AppText style={{ fontSize: 14, color: colors.medium }}>
                                            {s.subText}
                                        </AppText>
                                    </View>
                                </View>
                                {s.status == item.status && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        color={"#0040ff"}
                                        size={20}
                                    />
                                )}

                                {loading && s.status != item.status && <ActivityIndicator animating={true} color={colors.secondary} />}

                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            onPress={() => setShowModal(false)}
                            style={{
                                padding: 16,
                                backgroundColor: "#dcdcdc",
                                marginTop: 16,
                                borderRadius: 12,
                                marginBottom: insets.bottom + 10
                            }}
                        >
                            <AppText style={{ textAlign: "center" }}>Cancel</AppText>
                        </TouchableOpacity>

                    </BottomSheetView>
                </BottomSheetModal>
            </Card>
        </TouchableOpacity>
    );
};

const Row = ({ label, value, danger, highlight }) => (
    <View style={styles.row}>
        <AppText style={styles.rowLabel}>{label}</AppText>
        <AppText
            style={[
                styles.rowValue,
                danger && { color: colors.danger },
                highlight && { color: colors.primary, fontWeight: "700" },
            ]}
        >
            {danger && "-"} ₹{value?.toLocaleString()}
        </AppText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "flex-end",
    },

    modal: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },

    heading: {
        ...STYLES.header,
        marginBottom: 0,
    },

    headerTitle: {
        color: colors.white,
        fontSize: 16,
        fontWeight: "600",
    },

    content: {
        padding: 16,
    },

    filterHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: "600",
    },

    reset: {
        fontSize: 12,
        color: colors.primary,
    },

    label: {
        marginBottom: 6,
    },

    filterBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#F4F5F9",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },

    payrollCard: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        padding: 16,
        marginBottom: 28,
    },

    payrollLabel: {
        color: colors.light,
        fontSize: 16,
    },

    payrollValue: {
        color: colors.white,
        fontSize: 28,
        fontWeight: "700",
        marginVertical: 10,
    },

    payrollRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    payrollSmall: {
        color: "#E0E0FF",
        fontSize: 16,
    },

    payrollSmallValue: {
        color: colors.white,
        fontSize: 18,
        fontWeight: "700",
    },

    employeeHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },

    salaryHeader: {
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
        fontWeight: "600",
    },

    subText: {
        fontSize: 12,
        color: "#777",
    },

    status: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        height: 26,
        justifyContent: "center",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },

    rowLabel: {
        fontSize: 14,
        color: "#777",
    },

    rowValue: {
        fontSize: 16,
        fontWeight: "700",
    },
});

export default SalaryoverviewScreen;

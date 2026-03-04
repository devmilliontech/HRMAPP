import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, ScrollView } from "react-native";
import AppText from "../components/common/AppText";
import AppButton from "../components/common/AppButton";
import Card from "../layout/Card";
import { colors } from "../constants/colors";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { STYLES } from "../constants/styles";
import { months, years } from "../constants/data"
import AppPicker from "../components/common/AppPicker";
import AppLoading from "../components/common/AppLoading";
import { generatePayslipPDF } from "../utils/generatePayslip";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOwnSalary } from "../store/useSalaryStore";
import { getPreviousMonthYear } from "../utils/helper";
import { typography } from "../constants/typography";


const Row = ({ item }) => {
    return (
        <View style={[styles.row, { paddingVertical: 16 }]}>
            <View>
                <AppText style={{ color: colors.medium }}>{item.title}</AppText>
                <AppText style={styles.amount}>₹{item?.amount?.toLocaleString("en-IN")}</AppText>
            </View>
            <View style={{ height: 40, width: 35, alignItems: "center", justifyContent: "center", borderRadius: 4, backgroundColor: item.iconBg ? item.iconBg : "#6b669e" }}>
                <Feather name={item.icon} size={20} color={colors.white} />
            </View>
        </View>
    )
}

const ListItem = ({ item }) => {
    return <View style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 16 }}>
        <AppText style={{ color: colors.medium, flex: 1 }}>{item.name}</AppText>
        <AppText style={{ fontFamily: typography.bold }}>₹{Number(item?.amount)?.toLocaleString("en-IN")}</AppText>
    </View>
}


export default function SalaryScreen() {
    const { month: initialMonth, year: initialYear } = getPreviousMonthYear();
    const insets = useSafeAreaInsets()
    const [filterdSalary, setFilterdSalary] = useState([]);
    const { salary, setSalary } = useOwnSalary()
    const [month, setMonth] = useState(initialMonth);
    const [year, setYear] = useState(initialYear);
    const [loading, setLoading] = useState(false)

    const handleDownloadPaySlip = async () => {
        setLoading(true)
        await generatePayslipPDF({ salaryData, month, year })
        setLoading(false)
    }
    const fetchSalary = async () => {
        setLoading(true)
        await setSalary()
        setLoading(false)
    }

    useEffect(() => {
        fetchSalary()
    }, [])

    useEffect(() => {
        if (!salary?.length) return;

        const filtered = salary.filter(
            item => item.month === month && item.year === year
        );

        setFilterdSalary(filtered);
    }, [salary, month, year]);

    const salaryData = filterdSalary[0];

    return (
        <View style={{ flex: 1, marginBottom: insets.bottom }}>
            <ScrollView style={styles.
                container} contentContainerStyle={{ paddingBottom: 40 }}>

                <AppLoading visible={loading} />

                <Card style={{ marginTop: 12, flexDirection: "row", justifyContent: "space-between" }}>
                    <View style={{ width: "48%" }}>
                        <AppText style={styles.label}>Select Month</AppText>
                        <AppPicker
                            items={months}
                            selectedItem={months.find(m => m.value === month)}
                            placeholder="Select Month"
                            onSelectItem={(item) => setMonth(item.value)}
                            containerStyle={styles.picker}
                        />

                    </View>
                    <View style={{ width: "48%" }}>
                        <AppText style={styles.label}>Select Year</AppText>
                        <AppPicker
                            items={years}
                            selectedItem={years.find(y => y.value === year)}
                            placeholder="Select Year"
                            onSelectItem={(item) => setYear(item.value)}
                            containerStyle={styles.picker}
                        />
                    </View>

                </Card>


                <Card style={{ backgroundColor: colors.primary }}>
                    <View style={styles.row}>
                        <AppText style={[STYLES.header, { marginBottom: 0, color: colors.light }]}>Salary Summary</AppText>
                        <FontAwesome5 name="wallet" size={24} color={colors.light} />
                    </View>
                    <Row item={{ title: "Gross Salary", amount: salaryData?.grossSalary || 0, icon: "arrow-up" }} />
                    <View style={styles.line} />
                    <Row item={{ title: "Total Deduction", amount: salaryData?.totalDeduction || 0, icon: "arrow-down" }} />
                    <View style={styles.line} />
                    <Row item={{ title: "Net Pay", amount: salaryData?.netSalary || 0, icon: "check", iconBg: colors.success }} />
                </Card>

                {!salaryData ? (
                    <Card>
                        <AppText>No salary available for selected month</AppText>
                    </Card>) : <>
                    <AppText style={STYLES.header}>Salary Breakdown</AppText>
                    <Card>
                        <View style={styles.row}>
                            <AppText style={{ fontFamily: typography.bold }}>Earnings</AppText>
                            <AppText style={{ fontFamily: typography.bold, color: colors.success }}>₹{salaryData?.grossSalary?.toLocaleString()}</AppText>
                        </View>

                        {
                            [{ name: "Base Salary", amount: salaryData?.user?.baseSalary }, ...salaryData?.allowances]?.map((item, idx) => <View key={idx}>
                                <ListItem item={item} key={idx} />
                                {idx != [{ name: "Base Salary", amount: salaryData?.user?.baseSalary }, ...salaryData?.allowances]?.length - 1 && <View style={styles.line} />}
                            </View>
                            )
                        }

                    </Card>

                    <Card>
                        <View style={styles.row}>
                            <AppText style={{ fontFamily: typography.bold }}>Deductions</AppText>
                            <AppText style={{ fontFamily: typography.bold, color: colors.danger }}>₹{salaryData?.totalDeduction?.toLocaleString()}</AppText>
                        </View>
                        {
                            salaryData?.deductions?.map((item, idx) => <View key={idx}>
                                <ListItem item={item} key={idx} />
                                {idx != salaryData?.deductions?.length - 1 && <View style={styles.line} />}
                            </View>
                            )
                        }
                    </Card>
                </>
                }

                {/* <AppButton
                loading={loading}
                icon={"download"}
                title="Download Payslip (PDF)"
                onPress={() => {
                    handleDownloadPaySlip()
                }}
            /> */}

            </ScrollView>
        </View>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.white,
    },
    label: {
        marginBottom: 8
    },
    amount: {
        fontSize: 22,
        fontWeight: 700,
        color: colors.white
    },

    line: {
        height: 1,
        width: "100%",
        backgroundColor: colors.light
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    rowLabel: {
        color: colors.gray,
    },

    rowValue: {
        fontWeight: "600",
    },

    button: {
        marginTop: 20,
    },
});

import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { typography } from "../../constants/typography";
import { STYLES } from "../../constants/styles";
import { colors } from "../../constants/colors";
import Card from "../../layout/Card";
import AppButton from "../../components/common/AppButton";
import AppText from "../../components/common/AppText";
import { generatePayslipPDF } from "../../utils/generatePayslip";
import { months } from "../../constants/data";


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


export default function EmployeeSalaryBreakdown({ route }) {
    const insets = useSafeAreaInsets()
    const [loading, setLoading] = useState(false)

    const { salaryData } = route.params;

    const handleDownloadPaySlip = async () => {
        setLoading(true)
        const year = salaryData?.year
        const month = months.find(m => m.value == salaryData.month)?.label
        await generatePayslipPDF({ salaryData, month, year })
        setLoading(false)
    }

    return (
        <ScrollView style={styles.
            container} contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}>

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

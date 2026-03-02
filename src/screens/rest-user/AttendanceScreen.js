import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AppText from "../../components/common/AppText";
import { colors } from "../../constants/colors";
import AppPicker from "../../components/common/AppPicker";
import Card from "../../layout/Card";
import AppButton from "../../components/common/AppButton";
import { getPreviousMonthYear, jsonToCSV } from "../../utils/helper";
import AppLoading from "../../components/common/AppLoading";
import * as FileSystem from "expo-file-system/legacy";
import { months } from "../../constants/data";
import { useUsersStore } from "../../store/allUsersStore";
import { StorageAccessFramework } from "expo-file-system/legacy";
import { Platform } from "react-native";
import { useAttendance } from "../../store/useAttendanceStore";
import { useUsersDropdown } from "../../store/useDropdown";

const AttendanceScreen = () => {
    const { month: initialMonth } = getPreviousMonthYear();
    const { dropdown, setDropdown } = useUsersDropdown()
    const { attendance, setAttendance } = useAttendance()
    const [downloading, setDownloading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [filterdAttendance, setFilterdAttendance] = useState([])
    const [filters, setFilters] = useState({
        employee: null,
        month: months.find(m => m.value == initialMonth)
    });

    const setFilter = (key, value) =>
        setFilters((p) => ({ ...p, [key]: value }));

    const handleReset = () => {
        setFilters({
            employee: null,
            month: null,
        })
    }

    const downloadJsonAsCSV = async (jsonData) => {
        setDownloading(true);
        try {
            const csvData = jsonToCSV(jsonData);

            if (Platform.OS !== "android") {
                alert("Direct download is only supported on Android");
                return;
            }

            const permissions =
                await StorageAccessFramework.requestDirectoryPermissionsAsync();

            if (!permissions.granted) {
                alert("Permission denied");
                return;
            }

            const fileUri = await StorageAccessFramework.createFileAsync(
                permissions.directoryUri,
                `Attendance_${Date.now()}.csv`,
                "text/csv"
            );

            await FileSystem.writeAsStringAsync(fileUri, csvData);

            Alert.alert("Downloaded", "CSV downloaded successfully!");
        } catch (err) {
            console.log("CSV download failed:", err);
        } finally {
            setDownloading(false);
        }
    };

    const fetchAttendance = async () => {
        setLoading(true)
        await setAttendance()
        await setDropdown()
        setLoading(false)
    }

    useEffect(() => {
        fetchAttendance()
    }, [])

    useEffect(() => {
        if (attendance) {
            setFilterdAttendance(attendance)
        }
    }, [attendance])

    useEffect(() => {
        if (!attendance) return;

        let filterData = [...attendance];

        if (filters.employee) {
            filterData = filterData.filter(
                i => i
                    .empId === filters.employee.value.empId
            );
        }

        if (filters.month) {
            filterData = filterData.filter(d => {
                const month = new Date(d.date).getUTCMonth() + 1;
                return month === filters.month.value;
            });
        }
        setFilterdAttendance(filterData);
    }, [filters, attendance]);

    return (
        <View style={styles.container}>
            <AppLoading visible={loading} />
            <Card>
                <View style={styles.row}>
                    <View style={{ width: "48%" }}>
                        <AppText style={styles.label}>Employee</AppText>
                        <AppPicker
                            placeholder="Choose Employee"
                            items={dropdown}
                            selectedItem={filters.employee}
                            onSelectItem={(item) => setFilter("employee", item)}

                        />
                    </View>

                    <View style={{ width: "48%" }}>
                        <AppText style={styles.label}>Month</AppText>
                        <AppPicker
                            placeholder="Select Month"
                            items={months}
                            selectedItem={filters.month}
                            onSelectItem={(item) => setFilter("month", item)}
                        />
                    </View>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <TouchableOpacity onPress={handleReset}>
                        <AppText style={{ color: colors.primary }}>x clear all filters</AppText>
                    </TouchableOpacity>

                </View>
                <AppButton loading={downloading} style={{ height: 50, marginTop: 12 }} title={"Export as CSV"} onPress={() => downloadJsonAsCSV(filterdAttendance)} />
            </Card>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    label: {
        marginBottom: 8,
        fontSize: 14,
    },

    name: {
        fontWeight: "600",
        fontSize: 15,
        marginBottom: 2,
    },

    meta: {
        fontSize: 12,
        color: "#666",
    },
});

export default AttendanceScreen;

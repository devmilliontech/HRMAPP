import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import AppText from "../components/common/AppText";
import { colors } from "../constants/colors";
import { useLeaveCalender } from "../store/useLeavesStore";
import AppLoading from "../components/common/AppLoading";

const LeaveCalendarScreen = () => {
    const [loading, setLoading] = useState(false)
    const { leaveDate, setLeaveDate } = useLeaveCalender()

    const markedDates = useMemo(() => {
        const marks = {};

        const today = new Date().toISOString().split("T")[0];
        marks[today] = {
            selected: true,
            selectedColor: "#16A34A",
        };

        if (!leaveDate) return marks;

        leaveDate.forEach((leave) => {

            if (!marks[leave.date]) {
                marks[leave.date] = { dots: [] };
            }

            marks[leave.date].dots = marks[leave.date].dots || [];

            let dotColor = "#16A34A";

            if (leave.type === "sl") dotColor = "#DC2626";
            if (leave.type === "pl") dotColor = "#2563EB";

            const alreadyExists = marks[leave.date].dots.some(
                d => d.key === leave.type
            );

            if (!alreadyExists) {
                marks[leave.date].dots.push({
                    key: leave.type,
                    color: dotColor,
                });
            }
        });

        return marks;

    }, [leaveDate]);



    const getAllLeavesCalender = async () => {
        setLoading(true)
        await setLeaveDate()
        setLoading(false)
    }

    useEffect(() => {
        getAllLeavesCalender()
    }, [])

    return (
        <View style={styles.container}>
            <AppLoading visible={loading} />
            <Calendar
                markingType={"multi-dot"}
                markedDates={markedDates}
                theme={{
                    todayTextColor: colors.primary,
                    arrowColor: colors.primary,
                }}
            />

            <View style={styles.legend}>
                <Legend color="#DC2626" label="Sick Leave (SL)" />
                <Legend color="#2563EB" label="Paid Leave (PL)" />
            </View>
        </View>
    );
};

const Legend = ({ color, label }) => (
    <View style={{ flexDirection: "row", alignItems: "center", marginRight: 16 }}>
        <View
            style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                backgroundColor: color,
                marginRight: 6,
            }}
        />
        <AppText>{label}</AppText>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding: 16,
    },
    legend: {
        flexDirection: "row",
        marginTop: 20,
    },
});


export default LeaveCalendarScreen;

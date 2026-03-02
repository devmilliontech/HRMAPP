import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Card from "../layout/Card";
import AppText from "../components/common/AppText";
import AppButton from "../components/common/AppButton";
import AppToggle from "../components/common/AppToggle";
import { colors } from "../constants/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const NotificationSettingScreen = () => {
    const [settings, setSettings] = useState({
        attendance: true,
        leaveStatus: true,
        payslip: false,
        performance: true,
        dailyReport: false,
        weekend: false,
        push: true,
        email: true,
        sms: false,
    });

    const toggle = (key) =>
        setSettings((p) => ({ ...p, [key]: !p[key] }));

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Attendance Alerts */}
                <NotificationItem
                    icon="calendar-check"
                    color="#6366F1"
                    title="Attendance Alerts"
                    desc="Get notified about check-in/out reminders"
                    value={settings.attendance}
                    onToggle={() => toggle("attendance")}
                />

                {/* Leave Status */}
                <NotificationItem
                    icon="calendar"
                    color="#22C55E"
                    title="Leave Status Updates"
                    desc="Updates on leave approvals and rejections"
                    value={settings.leaveStatus}
                    onToggle={() => toggle("leaveStatus")}
                />

                {/* Payslip */}
                <NotificationItem
                    icon="file-document"
                    color="#F59E0B"
                    title="Payslip Notifications"
                    desc="Monthly payslip generation alerts"
                    value={settings.payslip}
                    onToggle={() => toggle("payslip")}
                />

                {/* Performance */}
                <NotificationItem
                    icon="chart-line"
                    color="#A855F7"
                    title="Performance Review Alerts"
                    desc="Reminders for performance evaluations"
                    value={settings.performance}
                    onToggle={() => toggle("performance")}
                />

                {/* Daily Report */}
                <NotificationItem
                    icon="bell"
                    color="#EC4899"
                    title="Daily Report Reminders"
                    desc="Daily task and report submission alerts"
                    value={settings.dailyReport}
                    onToggle={() => toggle("dailyReport")}
                />

                {/* Timing */}
                <Card>
                    <AppText style={styles.sectionTitle}>Notification Timing</AppText>

                    <View style={styles.rowBetween}>
                        <AppText style={styles.label}>Quiet Hours</AppText>
                        <AppText style={styles.value}>10:00 PM - 8:00 AM</AppText>
                    </View>

                    <View style={styles.rowBetween}>
                        <AppText style={styles.label}>Weekend Notifications</AppText>
                        <AppToggle
                            value={settings.weekend}
                            onChange={() => toggle("weekend")}
                        />
                    </View>
                </Card>

                {/* Methods */}
                <Card>
                    <AppText style={styles.sectionTitle}>Notifications</AppText>

                    <ToggleRow
                        label="Push Notifications"
                        value={settings.push}
                        onChange={() => setSettings(prev => ({ ...prev, push: !prev.push }))}
                    />
                    <ToggleRow
                        label="Email Notifications"
                        value={settings.email}
                        onChange={() => setSettings(prev => ({ ...prev, email: !prev.email }))}
                    />
                    <ToggleRow
                        label="SMS Notifications"
                        value={settings.sms}
                        onChange={() => setSettings(prev => ({ ...prev, sms: !prev.sms }))}
                    />
                </Card>

                <AppButton title="Save Preferences" />
            </ScrollView>
        </View>
    );
};

const NotificationItem = ({
    icon,
    color,
    title,
    desc,
    value,
    onToggle,
}) => (
    <Card>
        <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: color + "20" }]}>
                <MaterialCommunityIcons name={icon} size={20} color={color} />
            </View>

            <View style={{ flex: 1 }}>
                <AppText style={styles.title}>{title}</AppText>
                <AppText style={styles.desc}>{desc}</AppText>
            </View>

            <AppToggle value={value} onChange={onToggle} />
        </View>
    </Card>
);

const ToggleRow = ({ label, value, onChange }) => (
    <View style={styles.rowBetween}>
        <AppText style={styles.label}>{label}</AppText>
        <AppToggle value={value} onChange={onChange} />
    </View>
);


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 16, paddingBottom: 40 },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
    },

    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    title: { fontWeight: "600" },
    desc: { fontSize: 12, color: "#666", marginTop: 2 },

    sectionTitle: { fontWeight: "600", marginBottom: 6 },

    label: { color: "#666" },
    value: { fontWeight: "600", color: colors.primary },

    methodRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 10,
    },

    methodText: { fontSize: 14 },
});




export default NotificationSettingScreen;

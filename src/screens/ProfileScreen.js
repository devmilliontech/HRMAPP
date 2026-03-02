import React, { useContext, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import AppText from "../components/common/AppText";
import Card from "../layout/Card";
import { colors } from "../constants/colors";
import { STYLES } from "../constants/styles";
import useUserStore from "../store/userStore";

const ProfileScreen = () => {

    const { user } = useUserStore()

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

            <View style={styles.profileSection}>
                <Image
                    source={{ uri: user?.image_url || "https://www.w3schools.com/howto/img_avatar.png" }}
                    style={styles.avatar}
                />

                <AppText style={styles.name}>{user?.firstName || "NULL"} {user?.lastName || "Doe"}</AppText>
                <AppText style={styles.role}>{user?.jobRole || "NULL"}</AppText>
                <AppText style={styles.team}>{user?.team || "NULL"}</AppText>
            </View>

            <View style={styles.content}>
                <Card style={styles.personalDetails}>
                    <SectionHeader title="Personal Details" />

                    <InfoRow label="Phone Number" value={user?.mobile || "+1 (555) 123-4567"} />
                    <InfoRow label="Date of Birth" value={`${user?.dateOfBirth?.split("T")[0]}`} />
                    <InfoRow label="Email Address" value={user?.email || "michael.anderson@company.com"} />
                    <InfoRow
                        label="Address"
                        value={user?.address || "NULL"}
                    />
                </Card>

                <Card style={{ marginTop: 275 }}>
                    <SectionHeader title="Job Details" />

                    <InfoRow label="Job Role" value={user?.jobRole || "NULL"} />
                    <InfoRow label="Team" value={user?.team || "NULL"} />
                    <InfoRow label="Employee ID" value={user?.empId || "NULL"} />
                    <InfoRow label="Joining Date" value={user?.dateOfJoining?.split("T")[0] || "NULL"} />
                    <InfoRow label="Status" value={user?.status || "NULL"} />
                </Card>

                <Card>
                    <SectionHeader title="Bank Details" />

                    <InfoRow label="Bank Name" value={user?.bankName || "NULL"} />
                    <InfoRow label="Account Number" value={user?.bankAccNo || "NULL"} />
                    <InfoRow label="IFSC Code" value={user?.ifsc || "NULL"} />
                    <InfoRow
                        label="Account Holder Name"
                        value={user?.accHolderName || "NULL"}
                    />
                </Card>

                <Card>
                    <SectionHeader title="Emergency Contact" />

                    <InfoRow label="Contact Name" value={user?.emergencyContactName || "NULL"} />
                    <InfoRow label="Relationship" value={user?.emergencyContactRelation || "NULL"} />
                    <InfoRow label="Phone Number" value={user?.emergencyContactNo || "NULL"} />
                </Card>

            </View>

        </ScrollView>
    );
}

const SectionHeader = ({ title }) => (
    <AppText style={STYLES.header}>{title}</AppText>
);

const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <AppText style={styles.label}>{label}</AppText>
        <AppText style={styles.value}>{value}</AppText>
    </View>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        padding: 16
    },

    profileSection: {
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        height: 300
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: colors.white,
        marginTop: 12,
    },

    name: {
        color: colors.white,
        ...STYLES.header,
        marginBottom: 0,
        marginTop: 10,
    },

    role: {
        color: colors.light,
        fontSize: 14,
        marginTop: 4,
    },

    team: {
        color: colors.light,
        fontSize: 12,
    },
    personalDetails: {
        position: "absolute",
        top: -50,
        zIndex: 10,
        width: "100%",
        marginHorizontal: 16,
    },

    infoRow: {
        marginBottom: 10,
    },

    label: {
        fontSize: 14,
        color: "#777",
    },

    value: {
        fontSize: 16,
        fontWeight: "500",
        marginTop: 2,
    }

});


export default ProfileScreen

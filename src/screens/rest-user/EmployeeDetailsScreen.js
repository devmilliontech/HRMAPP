import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    Modal,
    FlatList,
} from "react-native";
import AppText from "../../components/common/AppText";
import Card from "../../layout/Card";
import { colors } from "../../constants/colors";
import { STYLES } from "../../constants/styles";
import SectionHeader from "../../components/specific/SectionHeader";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AppButton from "../../components/common/AppButton";
import { typography } from "../../constants/typography";
import { useApi } from "../../hooks/useApi";
import userApi from "../../api/user";
import { useUsersStore } from "../../store/allUsersStore";
import AppBottomSheet from "../../components/common/AppBottomSheet";
import * as ImagePicker from "expo-image-picker";
import AppDatePicker from "../../components/common/AppDatePicker";
import { statusList, teams } from "../../constants/data";


const EmployeeDetailScreen = ({ route }) => {
    const [personalDetailsEditable, setPersonalDetailsEditable] = useState(false);
    const [workDetailsEditable, setWorkDetailsEditable] = useState(false);
    const [bankDetailsEditable, setBankDetailsEditable] = useState(false);
    const [emergencyDetailsEditable, setEmergencyDetailsEditable] =
        useState(false);
    const updateUser = useApi(userApi.updateUser);
    const { setUsers } = useUsersStore();
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);

    const { user } = route.params;
    console.log(user)

    const [formData, setFormData] = useState({
        image_url: user.image_url || "",
        fullName:
            `${user?.firstName} ${user?.middleName ? user?.middleName + " " : ""}${user?.lastName}` ||
            "",
        mobile: user?.mobile || "",
        email: user?.email || "",
        dateOfBirth: user.dateOfBirth || "",
        address: user?.address || "",
        jobRole: user?.jobRole || "",
        status: statusList.find((s) => s.value == user?.status) || "",
        team: teams.find((t) => t?.value?.toLowerCase() == user?.team?.toLowerCase()) || "",
        baseSalary: user?.baseSalary || "",
        dateOfJoining: user?.dateOfJoining || "",
        bankName: user?.bankName || "",
        bankAccNo: user?.bankAccNo || "",
        ifsc: user?.ifsc || "",
        accHolderName: user.accHolderName || "",
        emergencyContactName: user?.emergencyContactName || "",
        emergencyContactRelation: user?.emergencyContactRelation || "",
        emergencyContactNo: user?.emergencyContactNo || "",
    });

    const handleChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSelectImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Permission required");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (!result.canceled) {
            const fileSize = result.assets[0].fileSize;

            if (fileSize > 1024 * 1024) {
                alert("Image must be less than 1 MB");
                return;
            }

            setFormData((prev) => ({
                ...prev,
                image_url: result.assets[0].uri,
            }));
        }
    };

    const handleSubmit = async () => {
        const {
            fullName,
            mobile,
            email,
            address,
            jobRole,
            baseSalary,
            team,
            status,
            bankName,
            bankAccNo,
            ifsc,
            accHolderName,
            emergencyContactName,
            emergencyContactRelation,
            emergencyContactNo,
        } = formData;

        if (
            !fullName ||
            !mobile ||
            !email ||
            !address ||
            !jobRole ||
            !baseSalary ||
            !team ||
            !status ||
            !bankName ||
            !bankAccNo ||
            !ifsc ||
            !accHolderName ||
            !emergencyContactName ||
            !emergencyContactRelation ||
            !emergencyContactNo
        ) {
            Alert.alert("Missing Required Fields", "All Fields are required");
            return;
        }

        const response = await updateUser.request(user?.id, {
            ...formData,
            status: formData.status.value,
            team: formData.team.value,
        });
        if (response.ok) {
            Alert.alert("Response successFull", "User updated successfully!");
            setUsers();
        }
    };

    return (
        <KeyboardAvoidingView behavior="height">
            <ScrollView
                keyboardShouldPersistTaps="always"
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={() => handleSelectImage()}>
                        <Image
                            source={{
                                uri:
                                    formData.image_url ||
                                    "https://www.w3schools.com/howto/img_avatar.png",
                            }}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>

                    <AppText style={styles.name}>
                        {user?.firstName || "NOT_SET"} {user?.middleName} {user?.lastName}
                    </AppText>
                    <AppText style={styles.role}>{user?.jobRole || "NOT_SET"}</AppText>
                    <AppText style={styles.team}>
                        {user?.team || "NOT_SET"}
                    </AppText>
                </View>

                <View style={styles.content}>
                    <Card style={styles.personalDetails}>
                        <Header
                            title={"Personal Details"}
                            icon={"person"}
                            editable={personalDetailsEditable}
                            onEdit={(value) => setPersonalDetailsEditable(value)}
                        />

                        <InfoRow
                            placeholder={"John Doe"}
                            editable={personalDetailsEditable}
                            label="Full Name"
                            value={formData?.fullName}
                            onChange={(value) => handleChange("fullName", value)}
                        />
                        <InfoRow
                            placeholder={"+1 (555) 123-4567"}
                            editable={personalDetailsEditable}
                            label="Phone Number"
                            value={formData?.mobile}
                            onChange={(value) => handleChange("mobile", value)}
                        />
                        <InfoRow
                            placeholder={"example@gmail.com"}
                            editable={personalDetailsEditable}
                            label="Email Address"
                            value={formData?.email}
                            onChange={(value) => handleChange("email", value)}
                        />

                        <AppText style={styles.label}>Date of Birth</AppText>
                        <AppDatePicker
                            style={[
                                styles.value,
                                {
                                    borderWidth: 0,
                                    borderRadius: 0,
                                    height: 45,
                                    backgroundColor: personalDetailsEditable
                                        ? "#F3F8FF"
                                        : "#f4f4f4",
                                    paddingVertical: 8,
                                    paddingHorizontal: 4,
                                    marginBottom: 12,
                                },
                            ]}
                            date={formData?.dateOfBirth}
                            onSelectDate={(date) => handleChange("dateOfBirth", date)}
                            placeholder={"Select date of birth"}
                            editable={personalDetailsEditable}
                        />

                        <InfoRow
                            placeholder={"eg, 123 kolkata "}
                            editable={personalDetailsEditable}
                            label="Address"
                            value={formData?.address}
                            onChange={(value) => handleChange("address", value)}
                        />
                    </Card>

                    <Card style={{ marginTop: 445 }}>
                        <Header
                            title={"Job Details"}
                            icon={"bag"}
                            editable={workDetailsEditable}
                            onEdit={(value) => setWorkDetailsEditable(value)}
                        />

                        <InfoRow
                            placeholder={"Backend Developer"}
                            editable={workDetailsEditable}
                            label="Job Role"
                            value={formData?.jobRole}
                            onChange={(value) => handleChange("jobRole", value)}
                        />
                        <AppText style={styles.label}>Team</AppText>
                        <TouchableOpacity
                            onPress={() => setShowTeamModal(true)}
                            disabled={!workDetailsEditable}
                            style={[
                                styles.value,
                                {
                                    backgroundColor: workDetailsEditable ? "#F3F8FF" : "#f4f4f4",
                                    paddingVertical: 8,
                                    paddingHorizontal: 4,
                                    marginBottom: 12,
                                },
                            ]}
                        >
                            {!formData.team ? (
                                <AppText style={{ color: colors.medium }}>
                                    eg, App Development
                                </AppText>
                            ) : (
                                <AppText style={{ fontFamily: typography.medium }}>
                                    {formData?.team?.label}
                                </AppText>
                            )}
                        </TouchableOpacity>
                        <InfoRow
                            placeholder={"eg, EMPID002"}
                            editable={false}
                            label="Employee ID"
                            value={user?.empId}
                            onChange={(value) => handleChange("empId", value)}
                        />
                        <InfoRow
                            placeholder={"eg, 10000"}
                            editable={workDetailsEditable}
                            label="Base Salary"
                            keyboardType="numeric"
                            value={String(formData?.baseSalary)}
                            onChange={(value) => handleChange("baseSalary", value)}
                        />

                        <AppText style={styles.label}>Joining Date</AppText>
                        <AppDatePicker
                            style={[
                                styles.value,
                                {
                                    borderWidth: 0,
                                    borderRadius: 0,
                                    height: 45,
                                    backgroundColor: workDetailsEditable ? "#F3F8FF" : "#f4f4f4",
                                    paddingVertical: 8,
                                    paddingHorizontal: 4,
                                    marginBottom: 12,
                                },
                            ]}
                            date={formData?.dateOfJoining}
                            onSelectDate={(date) => handleChange("dateOfJoining", date)}
                            placeholder={"Select date of joining"}
                            editable={workDetailsEditable}
                        />

                        <AppText style={styles.label}>Status</AppText>
                        <TouchableOpacity
                            onPress={() => setShowStatusModal(true)}
                            disabled={!workDetailsEditable}
                            style={[
                                styles.value,

                                {
                                    backgroundColor: workDetailsEditable ? "#F3F8FF" : "#f4f4f4",
                                    paddingVertical: 8,
                                    paddingHorizontal: 4,
                                },
                            ]}
                        >
                            {!formData.status ? (
                                <AppText style={{ color: colors.medium }}>
                                    Change Status
                                </AppText>
                            ) : (
                                <AppText style={{ fontFamily: typography.medium }}>
                                    {formData?.status?.label}
                                </AppText>
                            )}
                        </TouchableOpacity>
                    </Card>

                    <Card>
                        <Header
                            title={"Bank Details"}
                            icon={"lock-closed"}
                            editable={bankDetailsEditable}
                            onEdit={(value) => setBankDetailsEditable(value)}
                        />
                        <InfoRow
                            placeholder={"eg, HDFC"}
                            editable={bankDetailsEditable}
                            label="Bank Name"
                            value={formData?.bankName}
                            onChange={(value) => handleChange("bankName", value)}
                        />
                        <InfoRow
                            placeholder={"123456789"}
                            editable={bankDetailsEditable}
                            label="Account Number"
                            keyboardType="numeric"
                            value={String(formData?.bankAccNo)}
                            onChange={(value) => handleChange("bankAccNo", value)}
                        />
                        <InfoRow
                            placeholder={"eg, HDFC0002911"}
                            editable={bankDetailsEditable}
                            label="IFSC"
                            value={formData?.ifsc}
                            onChange={(value) => handleChange("ifsc", value)}
                        />
                        <InfoRow
                            editable={bankDetailsEditable}
                            label="Account Holder Name"
                            value={formData?.accHolderName}
                            placeholder={"eg, John Doe"}
                            onChange={(value) => handleChange("accHolderName", value)}
                        />
                    </Card>

                    <Card>
                        <Header
                            title={"Emergency Contact"}
                            icon={"person-circle"}
                            editable={emergencyDetailsEditable}
                            onEdit={(value) => setEmergencyDetailsEditable(value)}
                        />
                        <InfoRow
                            placeholder={"Name"}
                            editable={emergencyDetailsEditable}
                            label="Contact Name"
                            value={formData?.emergencyContactName}
                            onChange={(value) => handleChange("emergencyContactName", value)}
                        />
                        <InfoRow
                            placeholder={"eg, Spouse"}
                            editable={emergencyDetailsEditable}
                            label="Relationship"
                            value={formData?.emergencyContactRelation}
                            onChange={(value) =>
                                handleChange("emergencyContactRelation", value)
                            }
                        />
                        <InfoRow
                            placeholder={"+1 (555) 987-6543"}
                            editable={emergencyDetailsEditable}
                            label="Phone Number"
                            value={formData?.emergencyContactNo}
                            onChange={(value) => handleChange("emergencyContactNo", value)}
                        />
                    </Card>

                    <AppButton
                        loading={updateUser.loading}
                        title={"Save Changes"}
                        onPress={handleSubmit}
                    />
                </View>
            </ScrollView>

            <AppBottomSheet
                visible={showStatusModal}
                listItem={statusList}
                onSelect={(value) => handleChange("status", value)}
                onCancel={() => setShowStatusModal(false)}
            />

            <AppBottomSheet
                visible={showTeamModal}
                listItem={teams}
                onSelect={(value) => handleChange("team", value)}
                onCancel={() => setShowTeamModal(false)}
            />
        </KeyboardAvoidingView>
    );
};

const Header = ({ editable, title, icon, onEdit }) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <SectionHeader icon={icon} title={title} />
        {editable ? (
            <TouchableOpacity onPress={() => onEdit(false)}>
                <Ionicons name="close-outline" size={20} />
            </TouchableOpacity>
        ) : (
            <TouchableOpacity onPress={() => onEdit(true)}>
                <FontAwesome5 name="edit" size={20} />
            </TouchableOpacity>
        )}
    </View>
);

const InfoRow = ({
    editable,
    label,
    placeholder,
    value,
    onChange,
    keyboardType = "default",
}) => (
    <View style={styles.infoRow}>
        <AppText style={styles.label}>{label}</AppText>
        <TextInput
            placeholderTextColor={colors.medium}
            keyboardType={keyboardType}
            onChangeText={(text) => onChange(text)}
            placeholder={placeholder}
            editable={editable}
            value={value}
            style={[
                styles.value,
                { backgroundColor: editable ? "#F3F8FF" : "#f4f4f4" },
            ]}
        />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    content: {
        padding: 16,
    },

    profileSection: {
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        height: 300,
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
        fontFamily: typography.bold,
        marginTop: 4,
    },

    team: {
        color: colors.light,
        fontSize: 12,
        fontFamily: typography.bold,
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
        fontFamily: typography.medium,
        marginTop: 2,
    },

    documentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    uploadBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
    },

    uploadText: {
        color: colors.white,
        fontSize: 12,
    },

    documentItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#F4F5F9",
        padding: 10,
        borderRadius: 10,
        marginBottom: 8,
    },

    docTitle: {
        fontWeight: "600",
        fontSize: 13,
    },

    docSubtitle: {
        fontSize: 11,
        color: "#777",
    },

    download: {
        fontSize: 16,
        color: colors.primary,
    },
});

export default EmployeeDetailScreen;

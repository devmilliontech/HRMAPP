import React, { useState } from "react";
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AppText from "../../components/common/AppText";
import AppButton from "../../components/common/AppButton";
import Card from "../../layout/Card";
import { colors } from "../../constants/colors";
import { STYLES } from "../../constants/styles";

const PerformanceParametersScreen = () => {
    const [params, setParams] = useState([
        { id: 1, name: "Quality of Work", weight: 25 },
        { id: 2, name: "Timeliness", weight: 20 },
        { id: 3, name: "Team Collaboration", weight: 30 },
        { id: 4, name: "Innovation", weight: 25 },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [newName, setNewName] = useState("");
    const [newWeight, setNewWeight] = useState("");

    const totalWeight = params.reduce((sum, p) => sum + Number(p.weight), 0);
    const isValid = totalWeight === 100;

    const updateWeight = (id, value) => {
        setParams((prev) =>
            prev.map((p) =>
                p.id === id ? { ...p, weight: value.replace(/[^0-9]/g, "") } : p
            )
        );
    };

    const removeParam = (id) => {
        setParams((prev) => prev.filter((p) => p.id !== id));
    };

    const addParam = () => {
        if (!newName || !newWeight) return;

        setParams((prev) => [
            ...prev,
            {
                id: Date.now(),
                name: newName,
                weight: Number(newWeight),
            },
        ]);

        setNewName("");
        setNewWeight("");
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Card>
                    <View style={styles.infoRow}>
                        <View style={{
                            padding: 12,
                            borderRadius: 50,
                            backgroundColor: "#d0d8ff"
                        }}>
                            <Ionicons name="information" size={28} color={colors.primary} />
                        </View>

                        <View style={{ flex: 1 }}>
                            <AppText style={styles.infoTitle}>Configure Parameters</AppText>
                            <AppText style={styles.infoText}>
                                Set up performance evaluation parameters with custom weights.
                            </AppText>
                        </View>
                    </View>
                </Card>

                <View style={styles.headerRow}>
                    <AppText style={styles.header}>Parameters List</AppText>
                    <AppText style={styles.count}>{params.length} items</AppText>
                </View>



                {params.map((item) => (
                    <Card key={item.id}>
                        <View style={styles.paramHeader}>
                            <AppText>{item.name}</AppText>
                            <TouchableOpacity onPress={() => removeParam(item.id)}>
                                <MaterialIcons name="delete-outline" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>

                        <AppText style={styles.label}>Weight (%)</AppText>
                        <TextInput
                            value={String(item.weight)}
                            keyboardType="numeric"
                            onChangeText={(v) => updateWeight(item.id, v)}
                            style={styles.input}
                        />

                        <AppText style={styles.label}>Input Type</AppText>
                        <View style={styles.inputDisabled}>
                            <AppText>Rating 1–5</AppText>
                        </View>
                    </Card>
                ))}

                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => setModalVisible(true)}
                >
                    <AppText style={styles.addText}>＋ Add Parameter</AppText>
                </TouchableOpacity>


                <Card>
                    <View style={styles.totalRow}>
                        <View style={styles.totalLeft}>
                            <Ionicons
                                name={isValid ? "checkmark-circle" : "alert-circle"}
                                size={22}
                                color={isValid ? colors.success : colors.danger}
                            />
                            <AppText style={styles.totalText}>
                                Total Weight {totalWeight}%
                            </AppText>
                        </View>

                        <View
                            style={[
                                styles.status,
                                { backgroundColor: isValid ? "#E8FFF3" : "#FFECEC" },
                            ]}
                        >
                            <AppText
                                style={{ color: isValid ? colors.success : colors.danger }}
                            >
                                {isValid ? "Valid" : "Invalid"}
                            </AppText>
                        </View>
                    </View>
                </Card>

                <AppButton title="Save Changes" disabled={!isValid} />
            </ScrollView>

            <Modal transparent animationType="slide" visible={modalVisible}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <AppText style={styles.modalTitle}>Add Parameter</AppText>

                        <TextInput
                            placeholder="Parameter Name"
                            value={newName}
                            onChangeText={setNewName}
                            style={styles.input}
                        />

                        <TextInput
                            placeholder="Weight (%)"
                            value={newWeight}
                            onChangeText={setNewWeight}
                            keyboardType="numeric"
                            style={styles.input}
                        />

                        <AppButton title="Add" onPress={addParam} />
                        <AppButton
                            title="Cancel"
                            onPress={() => setModalVisible(false)}
                            style={styles.cancel}
                        />
                    </View>
                </View>
            </Modal>
        </View >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { padding: 16, paddingBottom: 40 },

    infoRow: { flexDirection: "row", gap: 12 },
    infoTitle: { fontWeight: "600" },
    infoText: { fontSize: 12, color: "#666" },

    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    header: { ...STYLES.header, marginBottom: 0 },
    count: { fontSize: 14, color: "#999" },

    paramCard: {
        backgroundColor: "#F9FAFC",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },

    paramHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    paramTitle: { fontWeight: "600" },

    label: { fontSize: 12, color: "#777", marginBottom: 4 },

    input: {
        backgroundColor: "#F1F2F6",
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
    },

    inputDisabled: {
        backgroundColor: "#EEE",
        borderRadius: 10,
        padding: 10,
    },

    addBtn: {
        borderStyle: "dashed",
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 6,
    },

    addText: { color: colors.primary, fontWeight: "600" },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    totalLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    totalText: { fontWeight: "600" },

    status: {
        paddingHorizontal: 12,
        paddingVertical: 4,
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

    modalTitle: { fontWeight: "600", fontSize: 16, marginBottom: 10 },
    cancel: { backgroundColor: "#EEE", marginTop: 8 },
});

export default PerformanceParametersScreen;

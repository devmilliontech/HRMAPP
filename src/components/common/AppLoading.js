import { View, Modal, StyleSheet, ActivityIndicator, Text } from "react-native";
import React from "react";
import { colors } from "../../constants/colors";
import AppText from "./AppText";

const AppLoading = ({ visible, text = "Please Wait..." }) => {
    return (
        <Modal transparent={true} visible={visible}>
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <View
                        style={{

                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <ActivityIndicator color={colors.primary} animating size={40} />
                        <AppText style={styles.modalText}>{text}</AppText>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        padding: 80,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 6,
        paddingVertical: 16,
        paddingHorizontal: 20,
        height: 120,
        flexDirection: "column",
        justifyContent: "center",
    },
    modalText: {
        fontSize: 16,
        color: "black",
        textAlign: "center"
    },
});

export default AppLoading;

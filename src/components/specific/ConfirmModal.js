import React, { useRef, useEffect, useMemo, useCallback } from "react";
import { TouchableHighlight, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AppText from "../common/AppText";
import { colors } from "../../constants/colors";

const ConfirmModal = ({
    header,
    desc,
    confirmText,
    confirmBg = colors.primary,
    visible,
    onCancel,
    onConfirm,
    loading
}) => {

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["40%"], []);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [visible]);

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
        <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            onDismiss={onCancel}
        >
            <BottomSheetView
                style={[styles.modal, { paddingBottom: insets.bottom + 20 }]}
            >

                <AppText style={styles.title}>{header}</AppText>

                <AppText style={styles.subtitle}>
                    {desc}
                </AppText>

                <TouchableOpacity
                    disabled={loading}
                    onPress={onConfirm}
                    activeOpacity={0.7}
                    style={[styles.submitBtn, { backgroundColor: confirmBg }]}
                >
                    {
                        loading ? <ActivityIndicator animating={true} size={24.5} color={colors.white} /> : <AppText style={styles.submitText}>
                            {confirmText}
                        </AppText>
                    }
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onCancel}
                    style={styles.cancelBtn}
                >
                    <AppText style={styles.cancelText}>
                        Go Back
                    </AppText>
                </TouchableOpacity>

            </BottomSheetView>
        </BottomSheetModal>
    );
};

export default ConfirmModal;

const styles = StyleSheet.create({

    modal: {
        padding: 24,
    },

    title: {
        fontSize: 24,
        fontWeight: "500",
        marginTop: 10,
        marginBottom: 16,
    },

    subtitle: {
        fontSize: 14,
        color: "#52525b",
    },

    submitBtn: {
        marginTop: 24,
        padding: 16,
        borderRadius: 999,
    },

    submitText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "500",
    },

    cancelBtn: {
        marginTop: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#a1a1aa",
        borderRadius: 999,
        backgroundColor: "#fff",
    },

    cancelText: {
        textAlign: "center",
        fontWeight: "500",
    },

});

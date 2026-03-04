import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    Modal,
    FlatList,
    TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { colors } from "../../constants/colors";
import AppText from "./AppText";
import AppBottomSheet from "./AppBottomSheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AppPicker = ({
    style,
    items,
    editable = true,
    icon,
    placeholder,
    selectedItem,
    onSelectItem,
    ...other
}) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={[styles.container, style]} {...other}>
            {icon && (
                <MaterialCommunityIcons name={icon} color={colors.medium} size={20} />
            )}
            <TouchableWithoutFeedback onPress={() => {
                if (editable) {
                    setOpen(true)
                }
            }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                    {selectedItem ? (
                        <AppText numberOfLines={1} style={styles.label}>{selectedItem.label}</AppText>
                    ) : (
                        <AppText numberOfLines={1} style={styles.placeholder}>{placeholder}</AppText>
                    )}
                    <MaterialCommunityIcons
                        name="chevron-down"
                        size={25}
                        color={colors.medium}
                    />
                </View>
            </TouchableWithoutFeedback>

            <AppBottomSheet
                visible={open}
                listItem={items}
                onCancel={() => setOpen(false)}
                onSelect={(item) => {
                    setOpen(false);
                    onSelectItem(item);
                }}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.light,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        gap: 4
    },
    label: {
        flex: 1,
    },
    placeholder: {
        flex: 1,
        color: colors.medium,
    },
    input: {
        flex: 1,
        fontSize: 18,
    },
    seperator: {
        height: 1,
        backgroundColor: colors.light,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
    },

    modal: {
        width: "85%",
        maxHeight: 300,
        marginHorizontal: "auto",
        backgroundColor: "#fff",
        borderRadius: 12,
    },

});

export default AppPicker;

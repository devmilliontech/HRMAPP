import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React, { useState, useMemo } from "react";
import { colors } from "../../constants/colors";
import AppText from "./AppText";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { format } from "date-fns";

const AppDatePicker = ({
    style,
    placeholder,
    date,
    onSelectDate,
    mode = "date",
    editable = true,
    // 🔥 New Props
    disablePast = false,
    disableNextDays = 0, // e.g., 14
}) => {
    const [show, setShow] = useState(false);

    // ✅ Compute minimum selectable date
    const minimumDate = useMemo(() => {
        if (!disablePast && disableNextDays === 0) return undefined;

        if (disablePast && disableNextDays === 0) {
            return new Date(); // only disable past
        }

        if (disablePast && disableNextDays > 0) {
            return moment().add(disableNextDays, "days").toDate();
        }

        return undefined;
    }, [disablePast, disableNextDays]);

    const handleConfirm = (selectedDate) => {
        if (mode === "time") {
            const time = format(selectedDate, "hh:mm a");
            onSelectDate(time);
        } else {
            onSelectDate(selectedDate);
        }

        hideDatePicker();
    };

    const hideDatePicker = () => {
        setShow(false);
    };

    return (
        <>
            <TouchableWithoutFeedback disabled={!editable} onPress={() => setShow(true)}>
                <View style={[styles.container, style]}>
                    {date ? (
                        <AppText numberOfLines={1} style={styles.date}>
                            {mode === "date" ? moment(date).format("DD MMM YYYY") : date}
                        </AppText>
                    ) : (
                        <AppText numberOfLines={1} style={styles.placeHolder}>
                            {placeholder}
                        </AppText>
                    )}
                    <Ionicons
                        name={mode === "date" ? "calendar" : "time"}
                        size={20}
                        color={colors.medium}
                    />
                </View>
            </TouchableWithoutFeedback>

            <DateTimePicker
                isVisible={show}
                mode={mode}
                minimumDate={minimumDate}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderWidth: 1,
        borderColor: colors.light,
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 12,
        height: 53,
    },
    date: {
        flex: 1,
    },
    placeHolder: {
        flex: 1,
        color: colors.medium,
    },
});
export default AppDatePicker;

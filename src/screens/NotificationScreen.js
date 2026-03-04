import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import AppText from "../components/common/AppText";
import { useDashboardStore } from "../store/useDashboardStore";
import { colors } from "../constants/colors";
import { Swipeable } from "react-native-gesture-handler";
import { RectButton } from "react-native-gesture-handler";
import { useApi } from "../hooks/useApi";
import notification from "../api/notification";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NotificationScreen = () => {
    const insets = useSafeAreaInsets()
    const [notifications, setNotifications] = useState([]);
    const deleteHook = useApi(notification.deleteNotification)
    const marksAsReadHook = useApi(notification.markAsReadNotifications)
    const { data, setData } = useDashboardStore();

    const handleDeleteNotification = (id) => {
        setNotifications((prev) => prev.filter(i => i.id != id))
        deleteHook.request(id)
        setData()
    };

    const markAsReadNotifications = async () => {
        await marksAsReadHook.request()
        await setData();
    }

    const renderRightActions = (id) => {
        return (
            <RectButton
                style={styles.deleteButton}
                onPress={() => handleDeleteNotification(id)}
            >
                <Ionicons name="trash" size={22} color="#fff" />
                <AppText style={styles.deleteText}>Delete</AppText>
            </RectButton>
        );
    };

    const renderItem = ({ item }) => {
        const isUnread = !item.read;

        return (
            <Swipeable
                renderRightActions={() => renderRightActions(item?.id)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={[
                        styles.itemContainer,
                        isUnread && styles.unreadItem,
                    ]}
                >
                    <Ionicons
                        name={
                            item?.type == "INFO"
                                ? "information-circle-outline"
                                : item?.type == "SUCCESS"
                                    ? "checkmark-circle-outline"
                                    : item?.type == "FAILURE"
                                        ? "close-circle-outline"
                                        : "help-circle-outline"
                        }
                        size={28}
                        color={"#0A66C2"}
                    />

                    <View style={styles.contentContainer}>
                        <AppText style={styles.contentText}>
                            {item.content}
                        </AppText>

                        <AppText style={styles.timeText}>
                            {moment(item.createdAt.replace('Z', '')).fromNow()}
                        </AppText>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    };


    useEffect(() => {
        if (data) {
            setNotifications(data?.notifications);
        }
    }, [data]);

    useEffect(() => {
        return () => {
            if (notifications.length > 0) {
                const isUnRead = notifications.some(
                    (item) => item.read === false
                );

                if (isUnRead) {
                    markAsReadNotifications();
                }
            }
        };
    }, [notifications]);

    return (
        <View style={[styles.container, { marginBottom: insets.bottom }]}>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 40 }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    itemContainer: {
        flexDirection: "row",
        padding: 20,
        alignItems: "flex-start",
        backgroundColor: "white"
    },

    unreadItem: {
        backgroundColor: "#F3F8FF",
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#0A66C2",
        marginRight: 8,
        marginTop: 6,
    },

    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },

    contentContainer: {
        flex: 1,
        marginLeft: 8,
    },

    contentText: {
        fontSize: 14,
        lineHeight: 20,
    },

    timeText: {
        fontSize: 12,
        color: "#666",
        marginTop: 4,
    },

    separator: {
        height: 1,
        backgroundColor: colors.light,
    },

    deleteButton: {
        backgroundColor: "#EF4444",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
    },

    deleteText: {
        color: "#fff",
        fontSize: 12,
        marginTop: 4,
    },

});

export default NotificationScreen;

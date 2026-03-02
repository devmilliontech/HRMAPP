import { create } from "zustand";
import user from "../api/user";
import { Alert } from "react-native";
import notification from "../api/notification";

export const useUsersDropdown = create((set) => ({
    dropdown: null,
    setDropdown: async () => {
        const response = await notification.userDropDowns()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ dropdown: response.data.data.dropdowns })
    },
    resetDropdown: () => set({ dropdown: null })
}))

export const useTeamsDropdown = create((set) => ({
    dropdown: null,
    setDropdown: async () => {
        const response = await notification.teamDropDowns()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ dropdown: response.data.data.dropdowns })
    },
    resetDropdown: () => set({ dropdown: null })
}))
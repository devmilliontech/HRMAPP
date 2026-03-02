import { create } from "zustand";
import user from "../api/user";
import { Alert } from "react-native";

export const useUsersStore = create((set) => ({
    users: null,
    setUsers: async () => {
        const response = await user.getAllUsers()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ users: response.data.data.users })
    },
    resetUsers: () => set({ users: null })
}))
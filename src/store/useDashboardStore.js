import { create } from "zustand";
import user from "../api/user";
import { Alert } from "react-native";

export const useDashboardStore = create((set) => ({
    data: null,
    setData: async () => {
        const response = await user.getDashboardData()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return;
        }
        set({ data: response.data.data })
    },
    resetData: () => set({ data: null })
}))

export const useHRDashboardStore = create((set) => ({
    data: null,
    setData: async () => {
        const response = await user.getHrDashboard()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ data: response.data.data })
    },
    resetData: () => set({ data: null })
}))
import { create } from "zustand";
import user from "../api/user";
import { Alert } from "react-native";

export const useReportStore = create((set) => ({
    reports: null,
    setReports: async () => {
        const response = await user.getReports()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ reports: response.data.data.reports })
    },
    resetReport: () => set({ reports: null })
}))
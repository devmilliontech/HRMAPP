import { create } from "zustand";
import { Alert } from "react-native";
import performanceApi from "../api/performance"


export const usePerformance = create((set) => ({
    performance: null,
    setPerformance: async () => {
        const response = await performanceApi.getUserPerformance()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ performance: response.data.data.performances })
    },
    resetPerformance: () => set({ performance: null })
}))

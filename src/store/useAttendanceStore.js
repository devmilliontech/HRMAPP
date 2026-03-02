import { create } from "zustand";
import { Alert } from "react-native";
import attendance from "../api/attendance";

export const useAttendance = create((set) => ({
    attendance: null,
    setAttendance: async () => {
        const response = await attendance.getAllAttendance()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return;
        }
        set({ attendance: response.data.data.attendances })
    },
    resetAttendance: () => set({ attendance: null })
}))
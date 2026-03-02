import { create } from "zustand";
import { Alert } from "react-native";
import leavesApi from "../api/leaves"

export const useLeave = create((set) => ({
    leaves: null,
    setLeaves: async () => {
        const response = await leavesApi.getAllLeaves()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ leaves: response.data.data.leaveRequests })
    },
    resetLeaves: () => set({ leaves: null })
}))

export const useLeaveCalender = create((set) => ({
    leaveDate: null,
    setLeaveDate: async () => {
        const response = await leavesApi.getLeaveCalender()

        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ leaveDate: response.data.data.leaves })
    },
    resetLeaveDate: () => set({ leaveDate: null })
}))
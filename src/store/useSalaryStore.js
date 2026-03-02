import { create } from "zustand";
import { Alert } from "react-native";
import salary from "../api/salary";

export const useSalaries = create((set) => ({
    salaries: null,
    setSalaries: async () => {
        const response = await salary.getAllSalaries()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ salaries: response.data.data.salaries })
    },
    resetSalaries: () => set({ salaries: null })
}))

export const useOwnSalary = create((set) => ({
    salary: null,
    setSalary: async () => {
        const response = await salary.getOwnSalary()
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ salary: response.data.data?.salaries })
    },
    resetSalary: () => set({ salary: null })
}))


export const useSalary = create((set) => ({
    salary: null,
    setSalary: async (id) => {
        const response = await salary.getSalary(id)
        if (!response.ok) {
            Alert.alert("Response Error", response.data.message);
            return
        }
        set({ salary: response.data.data })
    },
    resetSalary: () => set({ salary: null })
}))

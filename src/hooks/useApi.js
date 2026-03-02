import { useState } from "react"
import { Alert } from "react-native";

export const useApi = (apiFunc) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)

    const request = async (...args) => {
        setLoading(true);
        const response = await apiFunc(...args);
        setLoading(false);

        if (!response.ok) {
            const message = response.data.message.split(" ").map((m) => m[0].toUpperCase() + m.slice(1)).join(" ")
            Alert.alert("Error", message)
            return response;
        }
        setData(response.data.data)
        return response;
    }

    return {
        loading, data, request, setData
    }
}

import * as SecureStore from "expo-secure-store"

const key = "auth-token"

const storeToken = async (token) => {
    try {
        await SecureStore.setItemAsync(key, JSON.stringify(token))
    } catch (error) {
        console.log("Error in storing auth token", error)
    }
}

const getToken = async () => {
    try {
        return JSON.parse(await SecureStore.getItemAsync(key))
    } catch (error) {
        console.log("Error in getting auth token", error)
    }
}

const removeToken = async () => {
    try {
        await SecureStore.deleteItemAsync(key)
    } catch (error) {
        console.log("Error in removing auth token", error)
    }
}

const storeRole = async (role) => {
    try {
        await SecureStore.setItemAsync("user-role", JSON.stringify(role))
    } catch (error) {
        console.log("Error in storing user role", error)
    }
}

const getRole = async () => {
    try {
        return JSON.parse(await SecureStore.getItemAsync("user-role"))
    } catch (error) {
        console.log("Error in getting user role", error)
    }
}

const removeRole = async () => {
    try {
        await SecureStore.deleteItemAsync("user-role")
    } catch (error) {
        console.log("Error in removing user role", error)
    }
}

export default {
    storeToken,
    getToken,
    removeToken,
    storeRole,
    getRole,
    removeRole
}
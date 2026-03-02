import { api } from "./client";

const login = (email, password) => {
    return api.post("/auth/login", { email, password })
}

const logout = () => {
    return api.get("/auth/logout")
}

const resetPassword = (id, password) => {
    return api.post(`/api/users/${id}/reset-password`, { password })
}

export default {
    login,
    logout,
    resetPassword
}
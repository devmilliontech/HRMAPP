import { api } from "./client"


const createUser = (userData) => {
    return api.post("/api/users", userData)
}

const updateUser = (id, formData) => {
    const fd = new FormData();

    Object.keys(formData).forEach(key => {

        if (key === "image_url" && formData.image_url) {
            fd.append("image", {
                uri: formData.image_url,
                type: "image/jpeg",
                name: `image_${Date.now()}.jpg`,
            });
        }

        else if (key === "team") {
            fd.append("team", formData.team?.toLowerCase() || "");
        }

        else if (key === "bankAccNo") {
            fd.append("bankAccNo", formData.bankAccNo);
        }

        else if (key === "baseSalary") {
            fd.append("baseSalary", formData.baseSalary);
        }

        else {
            fd.append(key, formData[key] ?? "");
        }
    });
    return api.patch(`/api/users/${id}`, fd, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

const deleteUser = (id) => {
    return api.delete(`/api/users/${id}`)
}

const getDashboardData = () => {
    return api.get("/app/dashboard")
}

const getHrDashboard = () => {
    return api.get("/app/hr-central")
}

const getUser = () => {
    return api.get("/api/users/me")
}

const getAllUsers = () => {
    return api.get("/api/users")
}

const submitReport = (reportData) => {
    return api.post("/api/reports", reportData)
}

const getReports = () => {
    return api.get("/api/reports")
}

const markAsReadReport = (id) => {
    return api.post(`api/reports/${id}/read`)
}


export default {
    createUser,
    updateUser,
    deleteUser,
    getDashboardData,
    getHrDashboard,
    getUser,
    submitReport,
    getReports,
    getAllUsers,
    markAsReadReport
}
import { api } from "./client"

const createPerformanceReport = (data, onUploadProgress) => {
    return api.post(`api/performances/`, data, {
        onUploadProgress: (progress) => onUploadProgress(progress.loaded / progress.total)
    })
}

const getUserPerformance = (id) => {
    return api.get("/api/performances/me")
}

export default {
    createPerformanceReport,
    getUserPerformance
}
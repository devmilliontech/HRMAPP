import { api } from "./client"

const checkIn = () => {
    return api.post("/api/checkins")
}

const checkOut = () => {
    return api.post("/api/checkouts")
}

const getCheckin = (id) => {
    return api.get(`/api/users/${id}/checkin`)
}

const getAllAttendance = () => {
    return api.get("/api/attendances")
}

export default {
    checkIn,
    checkOut,
    getCheckin,
    getAllAttendance
}
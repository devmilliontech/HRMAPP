import { api } from "./client"

const applyForLeave = (data) => {

    // formData.append("leaveType", data.leaveType.value);
    // formData.append("startDate", data.startDate);
    // formData.append("endDate", data.endDate);
    // formData.append("numberOfDays", Number(data.numberOfDays));
    // formData.append("reason", data.reason);
    // formData.append("image")

    const payload = {
        "leaveType": data.leaveType.value,
        "startDate": data.startDate,
        "endDate": data.endDate,
        "reason": data.reason
    }

    return api.post("api/leaves", payload);
}

const getAllLeaves = () => {
    return api.get("/api/leaves")
}

const approveLeave = (id) => {
    return api.post(`/api/leaves/${id}/approve`)
}

const rejectLeave = (id) => {
    return api.post(`/api/leaves/${id}/reject`)
}

const getLeaveCalender = () => {
    return api.get("/api/leaves/calendar")
}

export default {
    applyForLeave,
    getAllLeaves,
    approveLeave,
    rejectLeave,
    getLeaveCalender
}
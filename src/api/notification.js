import { api } from "./client"

const deleteNotification = (id) => {
    return api.delete(`app/notifications/${id}`)
}

const deleteAllNotification = (id) => {
    return api.delete(`app/notifications`)
}

const markAsReadNotifications = () => {
    return api.post("app/notifications")
}

const userDropDowns = () => {
    return api.get("/app/dropdowns/users")
}

const teamDropDowns = () => {
    return api.get("/app/dropdowns/teams")
}

export default {
    deleteNotification,
    deleteAllNotification,
    markAsReadNotifications,
    userDropDowns,
    teamDropDowns
}
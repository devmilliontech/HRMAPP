import { api } from "./client"

const createSalary = (id, payload) => {
    return api.post(`/api/users/${id}/salary`, payload)
}

const getSalary = (id) => {
    return api.get(`/api/users/${id}/salary`)
}

const getAllSalaries = () => {
    return api.get(`/api/salaries`);
};

const getOwnSalary = () => {
    return api.get(`api/salaries/me`)
}

const updateSalaryAsLocked = (id) => {
    return api.post(`api/salaries/${id}/lock`)
}

const updateSalaryAsPending = (id) => {
    return api.post(`api/salaries/${id}/pending`)
}

const lockAllSalary = () => {
    return api.post("api/salaries/lock-all")
}

export default {
    createSalary,
    getSalary,
    getAllSalaries,
    getOwnSalary,
    updateSalaryAsLocked,
    lockAllSalary,
    updateSalaryAsPending
}
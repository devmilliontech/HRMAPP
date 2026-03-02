import { create } from "apisauce";
import { BASE_URL } from "../config/server.config";
import storage from "../utils/storage";
import cache from "../utils/cache";

export const api = create({
    baseURL: BASE_URL
})

api.addAsyncRequestTransform(async (request) => {
    const token = await storage.getToken()
    if (!token) return;
    request.headers = {
        ...request.headers,
        Authorization: `Bearer ${token}`,
    };
})

// const get = api.get;
// api.get = async (url, params, axiosConfig) => {
//     const response = await get(url, params, axiosConfig);

//     if (response.ok) {
//         await cache.store(url, response.data.data);
//         return response
//     }

//     const data = await cache.get(url);

//     return data ? { ok: true, data } : response
// }
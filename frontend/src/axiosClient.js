import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true,
    withXSRFToken: true,

})
axiosClient.defaults.headers.get.Accept = "application/json";
// axiosClient.interceptors.request.use(async (config) => {
//     if (config.method !== "get") {
//         await axiosClient.get("/csrf-cookie").then()
//     }
//     return config;
// })
export default axiosClient

import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: "application/json"
    }
})
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) return Promise.reject(error);
        console.error(error)
        return Promise.reject(error)
    })
export default axiosClient

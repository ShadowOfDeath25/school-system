import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: "application/json"
    },
    paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value === null || value === undefined) return;
            if (Array.isArray(value)) {
                value.forEach(v => searchParams.append(`${key}[]`, v));
            } else {
                searchParams.append(key, value);
            }
        });
        return searchParams.toString();
    }
})


export default axiosClient

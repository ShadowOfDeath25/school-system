import axios from "axios";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: "application/json"
    }
})

// axiosClient.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response) {
//             // Handle validation errors (422)
//             if (error.response.status === 422) {
//                 return Promise.reject({
//                     response: {
//                         status: error.response.status,
//                         data: error.response.data
//                     }
//                 });
//             }
//         }
//         return Promise.reject(error);
//     }
// )

export default axiosClient

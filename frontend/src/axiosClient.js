import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
    withXSRFToken: true,
    withCredentials: true,
    headers: {
        Accept: 'application/json',
    },

});


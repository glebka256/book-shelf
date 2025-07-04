import axios from "axios";

const baseInstance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API_URL || 'http://localhost:8080/api/',
    withCredentials: true
});

export default baseInstance;

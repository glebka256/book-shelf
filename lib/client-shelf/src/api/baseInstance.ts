import axios from "axios";

const baseInstance = axios.create({
    baseURL: process.env.VITE_API_URL || 'http://localhost:8080/api/',
    withCredentials: true
});

export default baseInstance;

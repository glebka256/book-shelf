import axios from "axios";

const baseInstance = axios.create({
    baseURL: process.env.VITE_API_BASE_URL,
});

export default baseInstance;

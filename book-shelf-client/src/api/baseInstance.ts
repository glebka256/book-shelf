import axios from "axios";

const baseInstance = axios.create({
    baseURL: process.env.MAIN_API_BASE_URL || 'http://localhost:8080/'
});

export default baseInstance;

import axios from "axios";

const baseInstance = axios.create({
    baseURL: process.env.VITE_API_URL || 'https://book-shelf-5ah9.onrender.com/api/',
    withCredentials: true
});

export default baseInstance;

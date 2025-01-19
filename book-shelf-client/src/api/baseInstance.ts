import axios from "axios";

const baseInstance = axios.create({
    baseURL: process.env.MAIN_API_BASE_URL || 'http://localhost:8080/',
    withCredentials: true
});

export default baseInstance;

export const getLoginStatus = async () => {
    try {
        const response = await baseInstance.get('/auth/user');
        return true;
    } catch (error: any) {
        if (error.response && error.response.status === 403) {
            return false;
        } else {
            console.error("Error checking login status.");
        }
        return false;
    }
}

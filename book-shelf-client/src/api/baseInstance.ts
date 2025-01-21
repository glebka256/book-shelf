import axios, { isAxiosError } from "axios";

const baseInstance = axios.create({
    baseURL: process.env.MAIN_API_BASE_URL || 'http://localhost:8080/',
    withCredentials: true
});

export default baseInstance;

export const getLoginStatus = async () => {
    try {
        await baseInstance.get('/auth/user');
        return true;
    } catch (error: unknown) {
        if (isAxiosError(error) && error.response && error.response.status === 403) {
            return false;
        } else {
            console.log("User is not signed in.");
        }
        return false;
    }
}

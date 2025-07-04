import axios, { AxiosError } from "axios";

const baseInstance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API_URL || 'http://localhost:8080/api/',
    withCredentials: true
});

baseInstance.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
        // Centralized error handling
        if (error.response) {
            // Server responded with a status code outside 2xx
            switch (error.response.status) {
            case 400:
                alert('Bad Request:' + error.response.data);
                break;
            case 401:
                alert('Unauthorized. Maybe redirect to login?');
                break;
            case 500:
                alert('Internal Server Error');
                break;
            default:
                alert('Unhandled error:' + error.response);
            }
        } else if (error.request) {
            // No response received
            alert('Network error or server not reachable');
        } else {
            // Something happened in setting up the request
            alert('Axios error:' + error.message);
        }
    
        // Return a rejected Promise to allow further handling if needed
        return Promise.reject(error);
    }
);

export default baseInstance;
import { AxiosInstance } from "axios";
import { AuthAPI, useAuthAPI } from "./auth.api";
import { AuthService, useAuthService } from "./authService";

/** Provide axios instance of api on which authentication will run */
export function useAuth(baseInstance: AxiosInstance): { api: AuthAPI, service: AuthService } {
    const api: AuthAPI = useAuthAPI(baseInstance);
    const service: AuthService = useAuthService(api);

    return {
        api,
        service
    };
}
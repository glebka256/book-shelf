import { UserStats } from "@/types/User.types";
import baseInstance from "@/config/axios";

export const getUserStats = async (): Promise<UserStats> => {
    const response = await baseInstance.get<UserStats>(`/users/stats`);
    return response.data;
}
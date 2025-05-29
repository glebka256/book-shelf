import { StatRoutes, getStat } from "../stat-manager/stat.api";
import { DataSize } from "@/types";

export interface Stats {
    totalBooks: number,
    totalAuthors: number,
    totalUsers: number,
    dbSize: DataSize
}

export const formStats = async (): Promise<Stats> => {
    const [
        totalBooks, totalAuthors, totalUsers, dbSize
    ] = await Promise.all([
        getStat<number>(StatRoutes.BooksTotal),
        getStat<number>(StatRoutes.AuthorsTotal),
        getStat<number>(StatRoutes.UsersTotal),
        getStat<DataSize>(StatRoutes.DBSize)
    ]);

    return { totalBooks, totalAuthors, totalUsers, dbSize };
}
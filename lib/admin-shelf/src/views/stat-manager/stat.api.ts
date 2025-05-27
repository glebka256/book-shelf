import baseInstance from "@/config/axios";

export enum StatRoutes {
    BooksTotal = '/stats/books/total',
    SubjectsTotal = '/stats/books/subjects/total',
    AuthorsTotal = '/stats/books/authors/total',
    UsersTotal = '/stats/users/total',
    UsersActivity = '/stats/users/activity',
    WeeklyActivity = '/stats/users/activity/weekly',
    SubjectDivision = '/stats/books/subjects/division',
    PublicationTimeline = '/stats/books/subjects/timeline'
}

export const getStat = async <T>(route: StatRoutes): Promise<T> => {
    const response = await baseInstance.get<T>(route);
    return response.data;
}

export interface UsersActivity {
    totalUsers: number,
    totalFavorites: number,
    totalInteractions: number,
    avgFavoritesPerUser: number,
    avgInteractionsPerUser: number,
    maxFavorites: number,
    maxInteractions: number
}

export interface WeeklyFrequency {
    _id: {
        year: number,
        week: number
    },
    count: number,
    startOfWeek: string
}

export interface SubjectDivision {
    genre: string,
    count: number,
    percentage: number
}

export interface PublicationFrequency {
    year: number,
    books: number
}
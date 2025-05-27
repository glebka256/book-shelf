import {
    getStat,
    PublicationFrequency,
    StatRoutes,
    SubjectDivision,
    UsersActivity,
    WeeklyFrequency
} from "./stat.api";
import { ChartFrequency } from "@/component-lib/charts/frequencyChart.types";

export interface Stats {
    total: {
        books: number,
        subjects: number,
        authors: number,
        users: number
    },
    activity: {
        users: UsersActivity,
        weekly: WeeklyFrequency[],
    },
    subjectDistribution: SubjectDivision[],
    publicationTimeline: PublicationFrequency[]
}

export const formStats = async (): Promise<Stats> => {
    const [
        books, subjects, authors, users,
        userActivity, weeklyActivity,
        subjectDist, pubTimeline
    ] = await Promise.all([
        getStat<number>(StatRoutes.BooksTotal),
        getStat<number>(StatRoutes.SubjectsTotal),
        getStat<number>(StatRoutes.AuthorsTotal),
        getStat<number>(StatRoutes.UsersTotal),
        getStat<UsersActivity>(StatRoutes.UsersActivity),
        getStat<WeeklyFrequency[]>(StatRoutes.WeeklyActivity),
        getStat<SubjectDivision[]>(StatRoutes.SubjectDivision),
        getStat<PublicationFrequency[]>(StatRoutes.PublicationTimeline)
    ]);

    return {
        total: { books, subjects, authors, users },
        activity: { users: userActivity, weekly: weeklyActivity },
        subjectDistribution: subjectDist,
        publicationTimeline: pubTimeline
    };
}

export interface ActivityDataCell {
    param: string,
    total: number,
    avg: number,
    max: number
}

export const formActivityDataCell = (data: UsersActivity): ActivityDataCell[] => {
    return [
        {
            param: "Favorites",
            total: data.totalFavorites,
            avg: Number(data.avgFavoritesPerUser.toFixed(4)),
            max: data.maxFavorites,
        },
        {
            param: "Other Interactions",
            total: data.totalInteractions,
            avg: Number(data.avgInteractionsPerUser.toFixed(4)),
            max: data.maxInteractions,
        }
    ];
}

export const formPublicationData = (data: PublicationFrequency[]): ChartFrequency[] => {
    return data.map(item => ({
        time: item.year,
        count: item.books
    }));
}
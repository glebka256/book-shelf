import { getStat, PublicationFrequency, StatRoutes, SubjectDivision, UsersActivity, WeeklyFrequency } from "./stat.api";

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
export interface UserStats {
    totalFavorites: number,
    totalInteraction: number,
    users: {
        username: string,
        email: string,
        favoriteCount: number,
        interactionCount: number
    }[]
}
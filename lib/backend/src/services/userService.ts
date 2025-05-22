import { UserData } from "@app/interfaces/User"
import { UserStats } from "@app/interfaces/User";

export const getStats = async (users: UserData[]): Promise<UserStats> => {
    let totalFavorites = 0;
    let totalInteraction = 0;

    const userStats = users.map(user => {
        const favoriteCount = user.favorites.length;

        // Add favorites because they are not considered interactions in storage
        const interactionCount = user.interactions.length + favoriteCount;

        totalFavorites += favoriteCount;
        totalInteraction += interactionCount;

        return {
            username: user.username,
            email: user.email,
            favoriteCount,
            interactionCount,
        };
    });

    return {
        totalFavorites,
        totalInteraction,
        users: userStats
    };
}

const userService = {
    getStats
}

export default userService;
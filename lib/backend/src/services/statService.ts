import { UserData, UserStats } from "@app/interfaces/User";
import { UserModel } from "@app/models/user";

const countUserInteractions = async (users: UserData[]): Promise<UserStats> => {
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

const getUserActivityStats = () => {
    return UserModel.aggregate([
        {
            $project: {
                username: 1,
                favoritesCount: { 
                    $size: { 
                        $ifNull: ['$favorites', []] 
                    } 
                },
                interactionsCount: { 
                    $size: { 
                        $ifNull: ['$interactions', []] 
                    } 
                }
            }
        },
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                totalFavorites: { $sum: '$favoritesCount' },
                totalInteractions: { $sum: '$interactionsCount' },
                avgFavoritesPerUser: { $avg: '$favoritesCount' },
                avgInteractionsPerUser: { $avg: '$interactionsCount' },
                maxFavorites: { $max: '$favoritesCount' },
                maxInteractions: { $max: '$interactionsCount' }
            }
        }
    ]);
};

const getInteractionsByWeek = () => {
    return UserModel.aggregate([
        { $unwind: '$interactions' },
        {
            $group: {
                _id: {
                    year: { $year: '$interactions.timestamp' },
                    week: { $week: '$interactions.timestamp' }
                },
                count: { $sum: 1 },
                startOfWeek: {
                    $min: '$interactions.timestamp'
                }
            }
        },
        { $sort: { '_id.year': 1, '_id.week': 1 } }
    ]);
};

const statService = {
    countUserInteractions,
    getUserActivityStats,
    getInteractionsByWeek
};

export default statService;
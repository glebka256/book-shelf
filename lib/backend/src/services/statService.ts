import { UserData, UserStats } from "@app/interfaces/User";
import { UserModel } from "@app/models/user";
import { aggreageBooks, getBooks } from "@app/models/book";
import { GenreDistribution, PublicationFrequency, StorageBook } from "@app/interfaces/Books";
import { GenreChunk } from "./recommendation/genreService";
import { getGenreDivision } from "@app/controllers/statistics";

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

/**
 * Calculates percentage statistics from genre chunks
 */
const calculateGenreStatistics = (genreChunks: GenreChunk[]): GenreDistribution[] => {
    const totalBooks = genreChunks.reduce((sum, chunk) => sum + chunk.books, 0);
    
    return genreChunks
        .map(chunk => ({
            genre: chunk.genre,
            count: chunk.books,
            percentage: totalBooks > 0 ? (chunk.books / totalBooks) * 100 : 0
        }))
        .sort((a, b) => b.count - a.count); // Sort by count descending
}

const getTimelineData = async (): Promise<PublicationFrequency[]> => {
    const data = await aggreageBooks([
        {
            $group: {
                _id: '$publishedYear',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    return data.map(item => ({
        year: item._id,
        books: item.count
    }));
}

const statService = {
    countUserInteractions,
    getUserActivityStats,
    getInteractionsByWeek,
    calculateGenreStatistics,
    getTimelineData
};

export default statService;
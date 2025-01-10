import { StorageBook } from "@app/interfaces/Books";
import { aggreageBooks } from "@app/models/book";

export async function searchByQuery(query: string, start: number, limit: number): Promise<StorageBook[] | null> {
    try {
        const dbQuery = {
            $or: [
                { 'meta.isbn': { $regex: query, $options: 'i' } },
                { 'title': { $regex: query, $options: 'i' } },
                { 'author': { $regex: query, $options: 'i' } },
                { 'subject': { $regex: query, $options: 'i' } },
            ],
        };

        // I have no idea how this works, just copy paste and sincere prayer.
        const documents = await aggreageBooks([
            { $match: dbQuery },
            {
                $addFields: {
                    priority: {
                        $switch: {
                            branches: [
                                { case: { $regexMatch: { input: "$meta.isbn", regex: query, options: "i" } }, then: 1 },
                                { case: { $regexMatch: { input: "$title", regex: query, options: "i" } }, then: 2 },
                            ],
                            default: 5,
                        },
                    },
                },
            },
            { $sort: { priority: 1 } },
            { $skip: start },
            { $limit: limit },
        ]);
            
        return documents as StorageBook[];
    } catch (error) {
        console.error("Error searching books: ", error);
        return null;
    }
}

export async function searchDownloadable(query: string, start: number, limit: number): Promise<StorageBook[] | null> {
    const allBooks = await searchByQuery(query, start, limit);

    return allBooks.filter((book) => book.link && book.link.downloadUrl);
}

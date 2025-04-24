import * as genreService from '@app/services/recommendation/genreService';
import { getBooks, getBookById } from '@app/models/book';
import { loadBookRelationsSubject } from '../score/serialization';
import { extractBookFromDoc, shuffleArray, sortNumericRecord } from '@app/utils';
import { UserInteraction } from '@app/interfaces/User';
import { StorageBook } from '@app/interfaces/Books';

export class RecommendEngine {
    async getPopularBooks(): Promise<StorageBook[]> {
        const books = extractBookFromDoc(await getBooks());
        const sortedBooks = books
            .map(book => ({
                ...book,
                score: book.rating
            }))
            .sort((a, b) => b.score - a.score);

        return this.shuffleBooks(sortedBooks);
    }

    async getRecommendedIds(
        userInteractions: UserInteraction[], 
        perBookLimit: number = 10
    ): Promise<Map<string, string[]>> {
        const recommedationIds = new Map<string, string[]>();
        const allGenres = genreService.retrieveGenres();

        for (const interaction of userInteractions) {
            const book = await getBookById(interaction.bookId);
            const genre = genreService.getBookGenre(book.subject, allGenres);
            const relatives = await loadBookRelationsSubject(genre, book.id);

            const sortedRelatedIds = Object.keys(sortNumericRecord(relatives));
            recommedationIds.set(book.id, sortedRelatedIds.slice(perBookLimit));
        }

        return recommedationIds;
    }

    shuffleBooks(books: StorageBook[]): StorageBook[] {
        const seen = new Set<string>();
        const unique = books.filter(book => {
            if (seen.has(book.id)) return false;
            seen.add(book.id);
            return true;
        });

        return shuffleArray<StorageBook>(unique);
    }

    shuffleIds(bookIds: string[]): string[] {
        return shuffleArray<string>(bookIds);
    }
}

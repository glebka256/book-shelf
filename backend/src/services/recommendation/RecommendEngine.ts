import * as genreService from '@app/services/recommendation/genreService';
import { getBooks, getBookById } from '@app/models/book';
import { loadBookRelationsSubject } from '../score/serialization';
import { extractBookFromDoc, shuffleArray, sortNumericRecord } from '@app/utils';
import { UserInteraction } from '@app/interfaces/User';
import { StorageBook } from '@app/interfaces/Books';

export class RecommendEngine {
    async getPopularBooks(shuffleChunk = 100): Promise<StorageBook[]> {
        // Sort all books by rating
        const books = extractBookFromDoc(await getBooks());
        const sortedBooks = books
            .map(book => ({
                ...book,
                score: book.rating
            }))
            .sort((a, b) => b.score - a.score);

        // Shuffle popular books in some chunks to immitate randomness
        const result: StorageBook[] = [];
        for (let i = 0; i < sortedBooks.length; i+= shuffleChunk) {
            const chunk: StorageBook[] = sortedBooks.slice(i, i + shuffleChunk);
            const shuffled = this.shuffleArray<StorageBook>(chunk);
            result.push(...shuffled);
        }

        return result;
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

    // Copied from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffleArray <T>(array: T[]): T[] {
        // Return value not reference, dont modify original array
        const arr = [...array];
    
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    
        return arr;
    }
}
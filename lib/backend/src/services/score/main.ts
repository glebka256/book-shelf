import dotenv from 'dotenv';
import * as stringSimiliarity from 'string-similarity';
import * as genreService from '../recommendation/genreService';
import { connectDB } from '@app/config/db';
import { getBooks } from '@app/models/book';
import { saveRelations } from './serialization';
import { toUnderscore} from '@book-shelf/gckit';
import { StorageBook } from '@app/interfaces/Books';
import { ScoreBook, ScoreBookChunk, ScoreTable, ScoreTableChunk } from './interfaces';

const WEIGHTS = {
    "title": 10,
    "author": 40,
    "subject": 30,
    "rating": 20,
    "year": 10,
}
const MAX_WEIGHT = Object.values(WEIGHTS).reduce((sum, weight) => sum + weight, 0);

// Main
async function main() {
    console.log("Setting up environment...");
    
    await setup();

    console.log("Retrieving books from the DB...");

    const books: ScoreBook[] = await getDBbooks();

    console.log("Organizing books...");

    const bookChunks: ScoreBookChunk[] = divideBooksByGenre(books);

    console.log("Scoring books...");

    for (let i = 0; i < bookChunks.length; i++) {
        const chunk: ScoreBookChunk = bookChunks[i];

        console.log(`Processing chunk ${i} of genre: ${chunk.genre}`);

        const chunkTable: ScoreTable = calculateScores(Array.from(chunk.books));
        const chunkRecord: ScoreTableChunk = { 
            subject: toUnderscore(chunk.genre), 
            chunk: String(i), 
            data: chunkTable 
        };

        await saveRelations(chunkRecord);
    }

    console.log(`Processed ${books.length} books total.`);

    process.exit(0);
}

// Functions
async function setup(): Promise<void> {
    dotenv.config();    
    await connectDB();
}

async function getDBbooks(): Promise<ScoreBook[]> {
    const books = await getBooks() as StorageBook[];

    return books.map((book) => ({
        id: book.id,
        title: book.title,
        authors: book.author,
        subjects: book.subject,
        year: book.publishedYear,
        rating: book.rating
    }));
}

/** Divides a list of books into chunks of unique books grouped by genre.
 * Score books by chunks for optimal execution time
 * 
 * @param books - List of books of different genres to be grouped by
 * @returns An array of chunks containing genre and unique books
*/
function divideBooksByGenre(books: ScoreBook[]): ScoreBookChunk[] {
    const allGenres = genreService.retrieveGenres();
    let result: ScoreBookChunk[] = [];

    for (const book of books) {
        const genre = genreService.getBookGenre(book.subjects, allGenres);

        let chunk = result.find(chunk => chunk.genre === genre);

        if (!chunk) {
            chunk = { genre: genre, books: new Set<ScoreBook> };
            result.push(chunk);
        } else {
            chunk.books.add(book);
        }
    }

    return result;
}

/**
 * Creates a table where key is book id and values are it's similiarity score 
 * with other books of the group.
 */
function calculateScores(books: ScoreBook[]): ScoreTable {
    let completeTable: ScoreTable = {};
    const score_threshold = 0.05;

    for (let i = 0; i < books.length; i++) {
        for (let j = i; j < books.length; j++) {
            const main = books[i];
            const compared = books[j];

            if (main.id !== compared.id) {
                const score = scoreBooks(main, compared);

                // Scores less than threshold are irrelevant
                if (score < score_threshold) {
                    break;
                }

                if (!completeTable[main.id]) {
                    completeTable[main.id] = {};
                }
                if (!completeTable[compared.id]) {
                    completeTable[compared.id] = {};
                }

                completeTable[main.id][compared.id] = score;
                completeTable[compared.id][main.id] = score;
            }
        }
    }

    return completeTable;
}

function scoreBooks(book1: ScoreBook, book2: ScoreBook): number {
    let score = 0;

    const titleSimilarity = stringSimiliarity.compareTwoStrings(book1.title, book2.title);
    score += titleSimilarity * WEIGHTS.title;

    score += scoreArray(book1.authors, book2.authors, WEIGHTS.author);
    score += scoreArray(book1.subjects, book2.subjects, WEIGHTS.subject);

    score += scoreYearDifference(book1.year, book2.year);
    score += book1.rating * Math.min(1, WEIGHTS.rating);

    // Normalize in range 0 to 1
    return score / MAX_WEIGHT;
}

function scoreArray(array1: string[], array2: string[], weight: number): number {
    const matches = array1.filter(author => array2.includes(author));
    const maximumMatches = Math.max(array1.length, array2.length);
    
    // Normalizes score by the maximim number of possible mathces
    // This should prevent significant overlap for books with many subjects or authors.
    return (matches.length / maximumMatches) * weight;
}

function scoreYearDifference(year1: number, year2: number): number {
    const yearDifference = Math.abs(year1 - year2);

    // Assumes that maximum meaningful difference is provided in WEIGHTS.year, 10 for ex
    return Math.max(0, WEIGHTS.year - yearDifference);
}

// Execute
main();

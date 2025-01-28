import dotenv from 'dotenv';
import * as stringSimiliarity from 'string-similarity';
import { countBy, maxBy } from 'lodash';
import { connectDB } from '@app/config/db';
import { StorageBook } from '@app/interfaces/Books';
import { DataSerializer } from '../DataSerializer';
import { getBooks } from '@app/models/book';
import { saveRelations } from './serialization';
import { toWhitespace } from '@app/utils';

const WEIGHTS = {
    "title": 10,
    "author": 40,
    "subject": 30,
    "rating": 20,
    "year": 10,
}
const MAX_WEIGHT = Object.values(WEIGHTS).reduce((sum, weight) => sum + weight, 0);

// Interfaces
interface ScoreBook {
    id: string,
    title: string,
    authors: string[],
    subjects: string[],
    year: number,
    rating: number
}

interface CategorizedGenres {
    category: string[]
    main: string[],
    specific: string[]
}

interface ScoreBookChunk {
    genre: string,
    books: Set<ScoreBook>
}

export interface ScoreTable {
    [key: string]: {
        [key: string]: number
    }
}

export interface ScoreTableChunk {
    subject: string,
    chunk: string,
    data: ScoreTable
}

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
            subject: chunk.genre, 
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
    const allGenres = retrieveGenres();
    let result: ScoreBookChunk[] = [];

    for (const book of books) {
        const genre = getBookGenre(book.subjects, allGenres);

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

function retrieveGenres(): CategorizedGenres {
    const allGenres = DataSerializer.parseGenres();

    const categories: string[] = ['fiction', 'non-fiction', 'self-help'];
    let mainGenres: string[] = [];
    let specificGenres: string[] = [];

    for (const genre of allGenres) {
        mainGenres.push(toWhitespace(genre.name));
        
        let excludingMain = genre.subjects.filter(subject => subject !== genre.name);
        excludingMain = excludingMain.map((genre) => toWhitespace(genre));
        specificGenres = specificGenres.concat(excludingMain);
    }

    return { category: categories, main: mainGenres, specific: specificGenres };
}

/**
 * Determines most relavant book subject to be chosen as its genre.
 * If a subject can be a genre is determined by a list of possible genres in the system.
 * Priority is given to most frequent subject or the one that is less popular, in order to differentiate.
 * 'uncategorized' is used as fallback.
 * 
 * @param bookSubjects - An array of subjects associated with book
 * @returns Most relevant subject that could serve as genre
 */
function getBookGenre(bookSubjects: string[], genres: CategorizedGenres): string {
    bookSubjects = bookSubjects.map((subject) => subject.toLowerCase());
    const genreTypes = [genres.specific, genres.main, genres.category];

    for (const genre of genreTypes) {
        const result = findClosestGenre(bookSubjects, genre);
        if (result) {
            return result;
        }
    }

    return getMostFrequent(bookSubjects);
}

function findClosestGenre(subjects: string[], genres: string[]): string | undefined {
    let bestMatch: string | undefined;
    let bestMatchScore = 0;

    for (const subject of subjects) {
        const match = stringSimiliarity.findBestMatch(subject, genres);

        if (match.bestMatch.rating > bestMatchScore) {
            bestMatchScore = match.bestMatch.rating;
            bestMatch = match.bestMatch.target;
        }
    }

    return bestMatch;
}

function getMostFrequent(array: string[]): string {
    const frequency = countBy(array);

    if (Math.max(...Object.values(frequency)) > 1) {
        const mostFrequent = maxBy(Object.keys(frequency), o => frequency[o]);
        return mostFrequent;
    }

    return array.at(-1);
}

/**
 * Creates a table where key is book id and values are it's similiarity score 
 * with other books of the group.
 */
function calculateScores(books: ScoreBook[]): ScoreTable {
    let completeTable: ScoreTable = {};

    for (let i = 0; i < books.length; i++) {
        for (let j = i; j < books.length; j++) {
            const main = books[i];
            const compared = books[j];

            if (!completeTable[main.id]) {
                completeTable[main.id] = {};
            }
            if (!completeTable[compared.id]) {
                completeTable[compared.id] = {};
            }

            if (main.id !== compared.id) {
                const score = scoreBooks(main, compared);
                completeTable[main.id][compared.id] = score;
                completeTable[compared.id][main.id] = score;
            }
        }
    }

    return completeTable;
}

function scoreBooks(book1: ScoreBook, book2: ScoreBook): number {
    let score = 0;

    const titleSimilarity = areTitlesSimilar(book1.title, book2.title) ? 1 : 0;
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

// For now this method seems ok, change to some library if needed in future
function areTitlesSimilar(title1: string, title2: string): boolean {
    const normalize = (title: string) => title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedTitle1 = normalize(title1);
    const normalizedTitle2 = normalize(title2);

    return (
        normalizedTitle1.includes(normalizedTitle2) ||
        normalizedTitle2.includes(normalizedTitle1)
    );
}

// Execute
main();

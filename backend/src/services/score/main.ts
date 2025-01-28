import dotenv from 'dotenv';
import { connectDB } from '@app/config/db';
import { StorageBook } from '@app/interfaces/Books';
import { DataSerializer } from '../DataSerializer';
import { getBooks } from '@app/models/book';
import { ScrapingTypes } from '@app/interfaces/Data';
import { saveRelations } from './serialization';

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

    const subjects: string[] = DataSerializer.getParsingSubjects(ScrapingTypes.All);
    const books: ScoreBook[] = (await getDBbooks()).slice(0, 100);  // slice for testing purposes

    console.log("Scoring books...");
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

            // Log for each thousand
            const processedScores = i * books.length + j;
            if (processedScores % 1000 === 999) {
                console.log(`Calculated ${processedScores + 1} scores.`);
            }
        }
    }

    console.log(`Processed ${books.length} books total.`);

    const testChunk: ScoreTableChunk = {
        subject: "test",
        chunk: "test",
        data: completeTable
    }

    await saveRelations(testChunk);

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
    // This should prevent significant overlap for books with many subjects.
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

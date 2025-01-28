import dotenv from 'dotenv';
import { connectDB } from '@app/config/db';
import { StorageBook } from '@app/interfaces/Books';
import { DataSerializer } from '../DataSerializer';
import { getBooks } from '@app/models/book';
import { ScrapingTypes } from '@app/interfaces/Data';
import { dynamicLoader, dynamicOverwriteLog } from '@app/utils';
import { loadRelations, saveRelations } from './serialization';

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

    const stopLoader1 = dynamicLoader("Scoring books");

    let completeTable: ScoreTable = {};

    for (let i = 0; i < books.length; i++) {
        for (let j = i; j < books.length; j++) {

            if (!completeTable[books[i].id]) {
                completeTable[books[i].id] = {};
            }
            if (!completeTable[books[j].id]) {
                completeTable[books[j].id] = {};
            }

            const score = scoreBooks(books[i], books[j]);
            completeTable[books[i].id][books[j].id] = score;
            completeTable[books[j].id][books[i].id] = score;

            const nOfRecords = i * books.length + j;
            if (nOfRecords % 100 === 0) {
                dynamicOverwriteLog('Processed records: ', nOfRecords.toString());
            }
        }
    }

    stopLoader1();

    const testChunk: ScoreTableChunk = {
        subject: "test",
        chunk: "test",
        data: completeTable
    }

    await saveRelations(testChunk);
    
    const loaded = await loadRelations('test', 'test');
    console.log(loaded);

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

// For now this method seems ok, change to some library if needed in future.
function areTitlesSimilar(title1: string, title2: string): boolean {
    const normalize = (title: string) => title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedTitle1 = normalize(title1);
    const normalizedTitle2 = normalize(title2);

    return (
        normalizedTitle1.includes(normalizedTitle2) ||
        normalizedTitle2.includes(normalizedTitle1)
    );
}

function scoreBooks(book1: ScoreBook, book2: ScoreBook): number {
    let score = 0;

    const weights = {
        "title": 10,
        "author": 40,
        "subject": 30,
        "rating": 20,
        "year": 10,
    }

    const titleSimilarity = areTitlesSimilar(book1.title, book2.title) ? 1 : 0;
    score += titleSimilarity * weights.title;

    const authorMatches = book1.authors.filter(author => book2.authors.includes(author));
    score += authorMatches.length * weights.author;

    const subjectMatches = book1.subjects.filter(subject => book2.subjects.includes(subject));
    score += subjectMatches.length * weights.subject;

    const yearDifference = Math.abs(book1.year - book2.year);
    score += Math.max(0, weights.year - yearDifference);

    score += book1.rating * Math.min(1, weights.rating);

    return score;
}

// Execute
main();

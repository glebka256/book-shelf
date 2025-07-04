import * as stringSimiliarity from 'string-similarity';
import { countBy, maxBy } from 'lodash';
import { DataSerializer } from '@app/services/DataSerializer';
import { extractBookFromDoc } from '@app/utils';
import { toWhitespace } from '@book-shelf/gckit';
import { StorageBook } from '@app/interfaces/Books';
import { getBooks } from '@app/models/book';

interface CategorizedGenres {
    category: string[]
    main: string[],
    specific: string[]
}

export function retrieveGenres(): CategorizedGenres {
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
export function getBookGenre(bookSubjects: string[], genres: CategorizedGenres): string {
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

// TODO: replace all these methods with proper string comparisons and genre forming
export interface GenreChunk {
    genre: string;
    books: number;
}

/**
 * Divides books by genre and returns statistics
 * @param books - List of books to analyze (optional - will fetch all if not provided)
 * @returns Array of genre statistics with book counts
 */
export async function divideBooksByGenre(books?: StorageBook[]): Promise<GenreChunk[]> {
    // Complete list of main genres
    const mainGenres = [
        "fantasy", "science_fiction", "mystery", "romance", 
        "horror", "adventure", "science", "history", 
        "health", "arts", "self-help"
    ];
    
    // Get books only if not provided
    const allBooks = books || extractBookFromDoc(await getBooks());
    
    // Pre-process all book subjects once for efficiency
    const processedBooks = allBooks.map(book => ({
        ...book,
        processedSubjects: book.subject.map(subject => 
            normalizeGenre(subject)
        )
    }));
    
    const genreChunks: GenreChunk[] = [];
    let uncategorizedCount = 0;
    
    // Count books for each genre
    for (const genre of mainGenres) {
        const normalizedGenre = normalizeGenre(genre);
        let count = 0;
        
        for (const book of processedBooks) {
            if (book.processedSubjects.some(subject => 
                matchesGenre(subject, normalizedGenre)
            )) {
                count++;
            }
        }
        
        genreChunks.push({ genre, books: count });
    }
    
    // Count uncategorized books
    for (const book of processedBooks) {
        const hasGenre = mainGenres.some(genre => 
            book.processedSubjects.some(subject => 
                matchesGenre(subject, normalizeGenre(genre))
            )
        );
        
        if (!hasGenre) {
            uncategorizedCount++;
        }
    }
    
    if (uncategorizedCount > 0) {
        genreChunks.push({ genre: "other", books: uncategorizedCount });
    }
    
    return genreChunks;
}

/**
 * Normalizes genre/subject strings for consistent comparison
 */
function normalizeGenre(text: string): string {
    return text
        .toLowerCase()
        .replace(/[-_\s]+/g, '_') // Convert spaces/hyphens to underscores
        .trim();
}

/**
 * Checks if a subject matches a genre (allows partial matching)
 */
function matchesGenre(subject: string, genre: string): boolean {
    // Exact match
    if (subject === genre) return true;
    
    // Partial match (genre contained in subject)
    if (subject.includes(genre)) return true;
    
    // Handle common variations
    const variations: Record<string, string[]> = {
        'science_fiction': ['sci_fi', 'scifi', 'science_fiction'],
        'self_help': ['self_help', 'selfhelp', 'personal_development']
    };
    
    const genreVariations = variations[genre];
    if (genreVariations) {
        return genreVariations.some(variation => 
            subject.includes(variation)
        );
    }
    
    return false;
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
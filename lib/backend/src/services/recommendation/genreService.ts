import * as stringSimiliarity from 'string-similarity';
import { countBy, maxBy } from 'lodash';
import { DataSerializer } from '@app/services/DataSerializer';
import { toWhitespace } from '@app/utils';

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

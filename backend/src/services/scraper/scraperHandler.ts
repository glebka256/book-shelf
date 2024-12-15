import dotenv from "dotenv";
import { BookScraper } from "./BookScraper";
import { connectDB } from '@app/config/db';
import { dynamicLoader, dynamicLog } from "@app/utils";

const desiredSubjects = [
    "fiction", 
    "non-fiction", 
    "science", 
    "fantasy",
    "epic_fantasy",
    "dark_fantasy", 
    "mystery", 
    "romance", 
    "thriller", 
    "horror", 
    "historical_fiction", 
    "science_fiction", 
    "literary_fiction", 
    "young_adult", 
    "children's_books", 
    "classics", 
    "adventure", 
    "crime", 
    "paranormal", 
    "dystopian", 
    "biography", 
    "self-help", 
    "philosophy", 
    "psychology", 
    "sociology", 
    "politics", 
    "economics", 
    "business", 
    "arts", 
    "travel", 
    "health", 
    "cookbooks", 
    "poetry", 
    "religion", 
    "spirituality", 
    "parenting", 
    "sports", 
    "music", 
    "humor", 
    "true_crime", 
    "urban_fantasy", 
    "graphic_novels", 
    "magical_realism", 
    "mythology"
];

const additionalSubjects = [
    "steampunk", 
    "cyberpunk", 
    "post-apocalyptic", 
    "historical_romance", 
    "military_fiction", 
    "western", 
    "space_opera", 
    "speculative_fiction", 
    "satire", 
    "drama", 
    "folklore", 
    "fairy_tales", 
    "short_stories", 
    "nature", 
    "gardening", 
    "environmental", 
    "astronomy", 
    "astrology", 
    "physics", 
    "mathematics", 
    "engineering", 
    "computers_and_technology", 
    "art_history", 
    "design", 
    "architecture", 
    "history", 
    "military_history", 
    "education", 
    "linguistics", 
    "law", 
    "medicine", 
    "anatomy", 
    "nutrition", 
    "fitness", 
    "anthropology", 
    "archaeology", 
    "geography", 
    "ethics", 
    "fairy_fantasy", 
    "pirate_fiction", 
    "espionage", 
    "medical_thriller", 
    "political_thriller", 
    "noir"
];

const REQUEST_DELAY = 3000 // ms

function setupScraper(): void {
    dotenv.config();
    connectDB();
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
    console.log("Setting up scraper environment...");
    setupScraper();
    console.log(`Request timeout set to: ${REQUEST_DELAY}ms.`);

    console.log("Starting book scraper...");

    const scraper = new BookScraper();

    let booksSaved: number = 0;

    const stopLoader = dynamicLoader("Scraping books");

    for (const subject of additionalSubjects) {
        dynamicLog("Currently processed subject: ", subject);

        const booksOfGenre = await scraper.populateWithTopOfGenre([subject]);
        console.log(`Proccesed ${booksOfGenre} books of subject ${subject}`);

        booksSaved +=  booksOfGenre;
        await delay(REQUEST_DELAY);
    }

    stopLoader();

    console.log("Finished scraping, total books saved: ", booksSaved);
    process.exit(0);
}

main();

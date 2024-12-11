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

    for (const subject of desiredSubjects) {
        dynamicLog("Currently processed subject: ", subject);

        booksSaved += await scraper.populateWithTopOfGenre([subject]);
        await delay(REQUEST_DELAY);
    }

    stopLoader();

    console.log("Finished scraping, total books saved: ", booksSaved);
    process.exit(0);
}

main();

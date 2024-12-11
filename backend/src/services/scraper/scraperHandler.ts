import dotenv from "dotenv";
import { BookScraper } from "./BookScraper";
import { connectDB } from '@app/config/db';
import { dynamicLoader } from "@app/utils";

const desiredGenres = ["fiction", "non-fiction", "science"];

function setupScraper(): void {
    dotenv.config();
    connectDB();
}

async function main(): Promise<void> {
    console.log("Setting up scraper environment...");
    setupScraper();

    console.log("Starting book scraper...");

    const scraper = new BookScraper();

    let booksSaved: number = 0;

    const stopLoader = dynamicLoader("Scraping books");

    for (const genre of desiredGenres) {
        booksSaved += await scraper.populateWithTopOfGenre([genre]);
    }

    stopLoader();

    console.log("Finished scraping, total books saved: ", booksSaved);
    process.exit(0);
}

main();

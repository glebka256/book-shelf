import dotenv from "dotenv";
import { BookScraper } from "./BookScraper";
import { connectDB } from '@app/config/db';
import { TextLoader } from "@app/utils/TextLoader";
import { DataSerializer } from "../DataSerializer";
import { ScrapingTypes } from "@app/interfaces/Data";

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

    const desiredSubjects = DataSerializer.getParsingSubjects(ScrapingTypes.All);

    console.log("Starting book scraper...");

    const scraper = new BookScraper();

    let booksSaved: number = 0;

    const scrapingLoader = new TextLoader("Scraping books");
    scrapingLoader.start();

    for (const subject of desiredSubjects) {
        TextLoader.dynamicLog("Currently processed subject: ", subject, true);

        const booksOfGenre = await scraper.populateWithTopOfGenre([subject]);
        console.log(`Proccesed ${booksOfGenre} books of subject ${subject}`);

        booksSaved +=  booksOfGenre;
        await delay(REQUEST_DELAY);
    }

    scrapingLoader.stop();

    console.log("Finished scraping, total books saved: ", booksSaved);
    process.exit(0);
}

main();

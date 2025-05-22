import { UsersActivity, WeeklyInteraction } from "@app/interfaces/User";
import { createControllerHandler } from "./controllerHandler";
import * as bookModel from "@app/models/book";
import * as userModel from "@app/models/user";
import statService from "@app/services/statService";
import { GenreDistribution, PublicationFrequency } from "@app/interfaces/Books";
import { divideBooksByGenre, GenreChunk } from "@app/services/recommendation/genreService";

const NAMESPACE = "STATISTICS-REQUEST";
const controllerHandler = createControllerHandler(NAMESPACE);

export const getTotalBooks = controllerHandler(async (req, res) => {
    const total: number = await bookModel.getTotalEntries();
    res.status(200).json(total);
});

export const getTotalSubjects = controllerHandler(async (req, res) => {
    const total = await bookModel.getUniqueEntryCount('subject');
    res.status(200).json(total);
});

export const getTotalAuthors = controllerHandler(async (req, res) => {
    const total = await bookModel.getUniqueEntryCount('author');
    res.status(200).json(total);
});

export const getTotalUsers = controllerHandler(async (req, res) => {
    const total = await userModel.getTotalEntries();
    res.status(200).json(total);
});

export const getUserActivityStats = controllerHandler(async (req, res) => {
    const result: UsersActivity[] = await statService.getUserActivityStats();
    res.status(200).json(result[0]);
});

export const getInteractionsByWeek = controllerHandler(async (req, res) => {
    const result: WeeklyInteraction[] = await statService.getInteractionsByWeek();
    res.status(200).json(result);
});

export const getGenreDivision = controllerHandler(async (req, res) => {
    const stats: GenreChunk[] = await divideBooksByGenre();
    const percentages: GenreDistribution[] = statService.calculateGenreStatistics(stats);
    res.status(200).json(percentages);
});

export const getPublishingTimeline = controllerHandler(async (req, res) => {
    const result: PublicationFrequency[] = await statService.getTimelineData();
    res.status(200).json(result);
});
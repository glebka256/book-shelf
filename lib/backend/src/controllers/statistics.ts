import { UsersActivity } from "@app/interfaces/User";
import { createControllerHandler } from "./controllerHandler";
import * as bookModel from "@app/models/book";
import * as userModel from "@app/models/user";
import statService from "@app/services/statService";

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
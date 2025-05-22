import { createControllerHandler } from './controllerHandler';
import { CustomError } from '@app/errors/CustomError';
import { get } from 'lodash';
import * as userModel from "@app/models/user";
import userService from '@app/services/userService';
import { ClientInteraction , UserData, UserInteraction, UserStats } from '@app/interfaces/User';
import { ValidationResponse } from '@app/interfaces/Util';
import { InteractionService } from '@app/services/recommendation/InteractionService';
import { extractDocs } from '@app/utils';

const NAMESPACE = "USER-REQUEST";
const controllerHandler = createControllerHandler(NAMESPACE);

export const getAllUsers = controllerHandler(async (req, res) => {
    const users = await userModel.getUsers();
    res.status(200).json(users);
})

export const getUsersStats = controllerHandler(async (req, res) => {
    const userDoc = await userModel.getUsers();
    const users: UserData[] = extractDocs<UserData>(userDoc);

    const userStats: UserStats = await userService.getStats(users);
    res.status(200).json(userStats);
});

export const deleteUser = controllerHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) 
        throw new CustomError(400, "Request missing id parameter", false, NAMESPACE);

    const deletedUser = await userModel.deleteUserById(id);
    if (!deletedUser) 
        throw new CustomError(404, "User not found", false, NAMESPACE);

    res.status(200).json(deletedUser);
});

export const getFavoritesIds = controllerHandler(async (req, res) => {
    const userId = get(req, 'identity._id') as string;
    if (!userId) 
        throw new CustomError(400, "Request missing user identity", false, NAMESPACE);

    const user = await userModel.getUserWithFavoritesIds(userId);
    if (!user) 
        throw new CustomError(404, "User not found", false, NAMESPACE);

    res.status(200).json({ favorites: user.favorites });
});

export const getAllFavorites = controllerHandler(async (req, res) => {
    const userId = get(req, 'identity._id') as string;
    if (!userId) 
        throw new CustomError(400, "Request missing user identity", false, NAMESPACE);

    const populatedUser = await userModel.getUserWithFavoritesById(userId);
    if (!populatedUser) 
        throw new CustomError(404, "User not found", false, NAMESPACE);

    res.status(200).json({ favorites: populatedUser.favorites });
});

/** Adds or removes bookId from favorites based on it's presence given user and bookId. */
export const toggleFavorite = controllerHandler(async (req, res) => {
    const userId = get(req, 'identity._id') as string;
    if (!userId) 
        throw new CustomError(400, "Request missing user identity", false, NAMESPACE);
    
    const { bookId } = req.body;
    if (!bookId) 
        throw new CustomError(400, "Request body missing bookId field", false, NAMESPACE);

    const populatedUser = await userModel.getUserWithFavoritesIds(userId);
    if (!populatedUser) 
        throw new CustomError(404, "User not found", false, NAMESPACE);

    if (populatedUser.favorites.includes(bookId)) {
        populatedUser.favorites = populatedUser.favorites.filter(id => id.toString() !== bookId);
    } else {
        populatedUser.favorites.push(bookId);
    }

    await populatedUser.save();

    res.status(200).json({ favorites: populatedUser.favorites });
});

/** Overwrites all ID entries for user's bookId array. */
export const updateFavorites = controllerHandler(async (req, res) => {
    const userId = get(req, 'identity._id') as string;
    if (!userId) 
        throw new CustomError(400, "Request missing user identity", false, NAMESPACE);

    const { bookIds } = req.body;
    if (!bookIds) 
        throw new CustomError(400, "Request body missing array of bookIds", false, NAMESPACE);
    if (bookIds.length <= 0) 
        throw new CustomError(400, "At least one bookId is required", false, NAMESPACE);

    const populatedUser = await userModel.getUserWithFavoritesById(userId);
    if (!populatedUser) 
        throw new CustomError(404, "User not found", false, NAMESPACE);

    const newFavorites = await userModel.updateUserFavoritesById(userId, bookIds);

    res.status(200).json({ favorites: newFavorites });
});

export const storeInteractions = controllerHandler(async (req, res) => {
    const userId = get(req, 'identity._id') as string;
    if (!userId) 
        throw new CustomError(400, "Request missing user identity", false, NAMESPACE);

    const clientInteractions: ClientInteraction[] = req.body.interactions;
    if (!clientInteractions) 
        throw new CustomError(400, "Request body missing array of client interactions", false, NAMESPACE);
    if (clientInteractions.length <= 0) 
        throw new CustomError(400, "At least one clientInteraction is required", false, NAMESPACE);

    const interactionManager = new InteractionService(userId);
    const interactions: UserInteraction[] = interactionManager.parseInteractionArray(clientInteractions);

    const validation: ValidationResponse = interactionManager.validate(interactions);
    if (!validation.status) 
        throw new CustomError(400, "Invalid client interactions provided", false, NAMESPACE);

    await interactionManager.save(interactions);

    res.status(200).json({ message: "Interactions stored successfully." });
});
import { Request, Response } from 'express';
import { get } from 'lodash';
import {
    deleteUserById,
    getUserWithFavoritesIds,
    getUsers,
    getUserWithFavoritesById,
    updateUserFavoritesById
} from '@app/models/user';
import { ClientInteraction, UserInteraction } from '@app/interfaces/User';
import { ValidationResponse } from '@app/interfaces/Util';
import { InteractionService } from '@app/services/recommendation/InteractionService';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getUsers();

        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(400);
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);

        res.status(200).json(deletedUser);
    } catch (error) {
        console.log(error);
        res.status(400);
    }
}

export const getFavoritesIds = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = get(req, 'identity._id') as string;
        const user = await getUserWithFavoritesIds(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ favorites: user.favorites });
    } catch (error) {
        console.error("Error retrieving favorite book IDs for user: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = get(req, 'identity._id') as string;
        const populatedUser = await getUserWithFavoritesById(userId);

        if (!populatedUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({ favorites: populatedUser.favorites });
    } catch (error) {
        console.error("Error retrieving favorite books for user: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/** Adds or removes bookId from favorites based on it's presence given user and bookId. */
export const toggleFavorite = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = get(req, 'identity._id') as string;
        const { bookId } = req.body;

        if (!bookId) {
            res.status(400).json({ message: "Book ID is required" });
            return;
        }

        const populatedUser = await getUserWithFavoritesIds(userId);

        if (!populatedUser) {
            res.status(404).json({ message: "Current user not found" });
            return;
        }

        if (populatedUser.favorites.includes(bookId)) {
            populatedUser.favorites = populatedUser.favorites.filter(id => id.toString() !== bookId);
        } else {
            populatedUser.favorites.push(bookId);
        }

        await populatedUser.save();

        res.status(200).json({ favorites: populatedUser.favorites });
    } catch (error) {
        console.error("Error toggling favorite book for user by ID. Error: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

/** Overwrites all ID entries for user's bookId array. */
export const updateFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = get(req, 'identity._id') as string;
        const { bookIds } = req.body;

        if (!bookIds || bookIds.length <= 0) {
            res.status(400).json({ message: "At least one book ID is required" });
            return;
        }

        const populatedUser = await getUserWithFavoritesById(userId);

        if (!populatedUser) {
            res.status(404).json({ message: "Current user not found" });
            return;
        }

        const newFavorites = await updateUserFavoritesById(userId, bookIds);

        res.status(200).json({ favorites: newFavorites });
    } catch (error) {
        console.error("Error updating favorite book IDs for user. Error: ", error);
        res.status(400).json({ message: "Could not update users favorites." });
    }
}

export const storeInteractions = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = get(req, 'identity._id') as string;
        const clientInteractions: ClientInteraction[] = req.body.interactions;

        const interactionManager = new InteractionService(userId);
        const interactions: UserInteraction[] = interactionManager.parseInteractionArray(clientInteractions);

        const validation: ValidationResponse = interactionManager.validate(interactions);
        if (!validation.status) {
            res.status(400).json({ message: validation.message });
            return;
        }

        await interactionManager.save(interactions);

        res.status(200).json({ message: "Interactions stored successfully." });
    } catch (error) {
        console.error("Error storing interactions: ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

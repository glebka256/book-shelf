import mongoose from "mongoose";
import { InteractionTypes, UserInteraction } from "@app/interfaces/User";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false},
        sessionToken: { type: String, select: false },
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    interactions: [
        {
            type: { type: String, enum: Object.values(InteractionTypes), required: true },
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
            timestamp: { type: Date, required: true }
        }
    ]
});

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ favorites: 1 });

export const UserModel = mongoose.model('User', UserSchema);

// Get User
export const getUsers = () => UserModel.find();

export const getUserById = (id : string) => UserModel.findById(id);

export const getUserByEmail = (email: String) => UserModel.findOne({ email })

export const getUserCreditentialsByEmail = (email: String) => 
    UserModel.findOne({ email }).select('+authentication.password +authentication.sessionToken');

export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});

// Create, Delete, Update User
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });

export const updateUserById = async (id: string, values: Record<string, any>) => {
    return await UserModel.findByIdAndUpdate(id, values, { new: true}).exec();
}

// User Favorites
export const getUserWithFavoritesIds = (userId: string) => 
    UserModel.findById(userId).select("favorites").exec();

export const getUserWithFavoritesById = (id: string) =>
    UserModel.findById(id).populate("favorites");

export const updateUserFavoritesById = async (id: string, bookIds: mongoose.Types.ObjectId[]) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { favorites: bookIds },
        { new: true, select: "favorites" }
    ).exec();

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return updatedUser.favorites;
}

// User Interactions
export const getUserInteractions = (userId: string) =>
    UserModel.findById(userId).select("interactions").exec();

export const updateUserInteractions = async (userId: string, interactions: UserInteraction[]) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId, 
        { interactions },
        { new: true, select: "interactions" }
    ).exec();

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return updatedUser.interactions;
}

export const deleteUserInteractions = async (userId: string) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
        userId, 
        { interactions: [] },
        { new: true, select: "interactions" }
    ).exec();

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return updatedUser.interactions;
}

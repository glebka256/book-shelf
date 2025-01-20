import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
        password: { type: String, required: true, select: false},
        sessionToken: { type: String, select: false },
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
});

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ favorites: 1 });

export const UserModel = mongoose.model('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: String) => UserModel.findOne({ email })
export const getUserCreditentialsByEmail = (email: String) => 
    UserModel.findOne({ email }).select('+authentication.password +authentication.sessionToken');
export const getUserBySessionToken = (sessionToken: string) => UserModel.findOne({
    'authentication.sessionToken': sessionToken,
});

export const getUserById = (id : string) => UserModel.findById(id);
export const getUserWithFavoritesById = (id: string) =>
    UserModel.findById(id).populate("favorites");

export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findOneAndDelete({ _id: id });
export const updateUserById = async (id: string, values: Record<string, any>) => {
    return await UserModel.findByIdAndUpdate(id, values, { new: true}).exec();
}
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

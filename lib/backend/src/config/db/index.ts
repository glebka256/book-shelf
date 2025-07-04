import mongoose from 'mongoose';
import { Logger } from "@book-shelf/gckit";

const NAMESPACE = "DATABASE";

export const connectDB = async (): Promise<void> => {
    const connectionURI = process.env.MONGO_URI;

    if (!connectionURI) {
        Logger.error('Error: No URI specified for MongoDB connection.', NAMESPACE);
        process.exit(1);
    }

    try {
        mongoose.Promise = Promise;
        await mongoose.connect(connectionURI);
    } catch (error) {
        Logger.error('Could not connect to DB: ', NAMESPACE, error);
    }

    mongoose.connection.on('error', (error: Error) => {
        Logger.error('MongoDB connection error:', NAMESPACE, error);
    });
}

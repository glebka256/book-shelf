import { compareSync } from 'bcrypt';
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    const connectionURI = process.env.MONGO_URI;

    if (!connectionURI) {
        console.log('Error: No URI specified for MongoDB connection.');
        process.exit(1);
    }

    try {
        mongoose.Promise = Promise;
        await mongoose.connect(connectionURI);
    } catch (error) {
        console.log('Could not connect to DB: ', error);
    }

    mongoose.connection.on('error', (error: Error) => {
        console.error('MongoDB connection error:', error);
    });
}

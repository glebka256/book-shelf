import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserModel, getUserByEmail, updateUserById } from "../db/user";

export class AuthService {
    private static saltRounds = 12;

    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    static async comparePasswords(plainText: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainText, hashedPassword);
    }

    static generateAuthToken(userId: string, username: string): string {
        const payload = { userId, username };
        const secret = process.env.JWT_SECRET;
        return jwt.sign(payload, secret, { expiresIn: '1h' });
    }

    static verifyAuthToken(token: string): void {
        const secret = process.env.JWT_SECRET;
        try {
            const decoded = jwt.verify(token, secret);
            if (!decoded) {
                throw new Error('Invalid token');
            }
        } catch (err) {
            throw new Error('Invalid token');
        }
    }

    static async register(username: String, email: string, password: string): Promise<any> {
        const hashedPassword = await this.hashPassword(password);
        const newUser = new UserModel({
            username,
            email,
            authentication: {
                password: hashedPassword,
                sessionToken: ''
            }
        });

        await newUser.save();

        return newUser;
    }

    static async login(email: string, password: string): Promise<any> {
        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error('User not found.');
        }

        const isPasswordValid = await this.comparePasswords(password, user.authentication.password);
        if (!isPasswordValid) {
            throw new Error('Invalid user credentials.');
        }
        
        const token = this.generateAuthToken(user.id, user.username);
        updateUserById(user.id, { 'authentication.sessionToken': token });

        return user;
    }
}

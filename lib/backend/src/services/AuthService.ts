import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as userModel from "@app/models/user";
import { DecodedJWT, ValidationResult, User } from '@app/interfaces/User';

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

    static verifyAuthToken(token: string): DecodedJWT | null{
        const secret = process.env.JWT_SECRET;
        try {
            const decoded = jwt.verify(token, secret);
            if (!decoded) {
                return null;
            }
            return decoded as DecodedJWT;
        } catch (err) {
            return null;
        }
    }

    static async validateUser(token: string | undefined): Promise<ValidationResult> {
        if (!token)
            return { userId: null, status: 401, message: "Unauthorized" };
    
        const decoded = await AuthService.verifyAuthToken(token);
        if (decoded === null)
            return { userId: null, status: 401, message: "Unauthorized" };
    
        const user = await userModel.getUserById(decoded.userId) as User;
        if (!user) 
            return { userId: null, status: 404, message: "User not found" };
    
        return { userId: decoded.userId, status: 200, message: "OK" };
    }

    static async register(username: String, email: string, password: string): Promise<any> {      
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) {
            throw new Error('User already exists.');
        }
        
        const hashedPassword = await this.hashPassword(password);
        const newUser = new userModel.UserModel({
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
        const user = await userModel.getUserCreditentialsByEmail(email);
        if (!user) {
            throw new Error('User not found.');
        }

        const isPasswordValid = await this.comparePasswords(password, user.authentication.password);
        if (!isPasswordValid) {
            throw new Error('Invalid user credentials.');
        }
        
        const token = this.generateAuthToken(user.id, user.username);

        await userModel.updateUserById(user.id, { 'authentication.sessionToken': token });
        const newUser = await userModel.getUserCreditentialsByEmail(email);

        return newUser;
    }
}
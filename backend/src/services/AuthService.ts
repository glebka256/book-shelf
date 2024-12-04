import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { UserModel } from "../db/user";

class AuthService {
    private static saltRounds = 12;

    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    static async comparePasswords(plainText: string, hashedPassword: string) {
        return bcrypt.compare(plainText, hashedPassword);
    }
}
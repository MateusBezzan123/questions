import { PrismaClient, UserType } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function registerUser(username: string, password: string, type: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!Object.values(UserType).includes(type as UserType)) {
        throw new Error('Invalid user type');
    }
    
    return await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            type: type as UserType
        }
    });
}

export async function authenticateUser(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user.id, type: user.type }, 'your-secret-key', { expiresIn: '1h' });
        return token;
    } else {
        return null;
    }
}

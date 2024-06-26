import { Request, Response } from 'express';
import { registerUser, authenticateUser } from '../services/userService';

export async function createUser(req: Request, res: Response) {
    try {
        const { username, password, type } = req.body;
        const user = await registerUser(username, password, type);
        res.status(201).json(user);
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
}

export async function loginUser(req: Request, res: Response) {
    try {
        const { username, password } = req.body;
        const token = await authenticateUser(username, password);
        if (token) {
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: 'Authentication failed' });
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
}

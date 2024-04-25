import jwt from 'jsonwebtoken';

const authenticate = (req: any, res: any, next: any) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '')
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

export default authenticate;

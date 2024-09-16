// middleware/authenticateToken.js
import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    console.log('Token:', token); // Debugging line
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.', success: false });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.', success: false });

        req.user = user; // Attach user info to the request object
        console.log('User from token:', user); // Debugging line
        next();
    });
};

export default authenticateToken;

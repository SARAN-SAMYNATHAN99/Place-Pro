const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No token provided.' });

    const parts = token.split(' ');
    if (parts.length === 2) {
        jwt.verify(parts[1], process.env.JWT_SECRET, (err, decoded) => {
            if (err) return res.status(401).json({ error: 'Failed to authenticate token.' });
            req.userId = decoded.id;
            next();
        });
    } else {
        return res.status(403).json({ error: 'Token format invalid.' });
    }
};

module.exports = { verifyToken };

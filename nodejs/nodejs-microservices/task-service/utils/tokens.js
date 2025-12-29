const { sign, verify } = require('jsonwebtoken');

//generate access token
const generateToken = (payload) => {
    return sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });
};

const verifyToken = (token) => {
    try {
        return verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
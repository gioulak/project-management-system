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

//password reset token
const createPasswordResetToken = (userData) => {
    const { id, email} = userData;
    return sign(
        { id, email },
        process.env.RESET_TOKEN_SECRET,
        { expiresIn : '15m' }
    );
};

//verify passwword reset token
const verifyPasswordResetToken = (token) => {
    try {
        return verify(token, process.env.RESET_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken, createPasswordResetToken, verifyPasswordResetToken };
const { verifyToken } = require("./tokens");
const User = require("../models/userModel");

const protected = async (req, res, next) => {
    try {
        const authorization = req.headers["authorization"];
        if(!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(500).json({
                message: "No token",
                type: "error",
            });
        }

        const token = authorization.split(' ')[1];
        const decoded = verifyToken(token);

        if(!decoded) {
            return res.status(401).json({
                message: 'Invalid token',
                type: 'error',
            });
        }

        //get user from mysql
        const user = await User.findById(decoded.id);
        if(!user) {
            return res.status(404).json({
                message: 'User doesnt exist',
                type: 'error',
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(500).json({
            message: 'Authentication failed',
            type: 'error',
            error: error.message
        });
    }
};

module.exports = { protected };
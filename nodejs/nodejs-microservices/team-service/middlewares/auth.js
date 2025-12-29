const { verifyToken } = require('../utils/tokens');


const authenticate = (req, res, next) => {
    try {
        const authorization = req.headers['authorization'];
        if(!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'No token provided',
                typpe: 'error'
            });
        }

        const token = authorization.split(' ')[1];
        const decoded = verifyToken(token);
        if(!decoded) {
            return res.status(401).json({ 
                error: 'Invalid or expired token',
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

//check if user is admin
const isAdmin = (req, res, next) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(403).json({
            error: 'Access denied. Admin only.',
            type: 'error'
        });
    }
    next();
};

//check if user is team leader or admin
const isLeaderOrAdmin = (req, res, next) => {
    if(req.user.role !== 'TEAM_LEADER' && req.user.role !== 'ADMIN') {
        return res.status(403).json({
            error: 'Access denied. Team Leader or Admin only.',
            type: 'error'
        });
    }
    next();
};

module.exports = { authenticate, isAdmin, isLeaderOrAdmin };


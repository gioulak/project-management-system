 const express = require("express");
 const router = express.Router();
 const User = require("../models/userModel");
 const { protected } = require("../utils/protected");

 //middleware to check admin
 const isAdmin = (req, res, next) => {
    if(req.user.role !== 'ADMIN') {
        return res.status(403).json({
            error: 'Access denied. Admin only.'
        });
    }
    next();
};

//all admin routes require auth
router.use(protected);
router.use(isAdmin);

//get all users
router.get('/users', async(req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch users',
            type: 'error',
        });
    }
});

//activate user
router.put('/users/:id/activate', async (req, res) => {
    try {
        const success = await User.activate(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User activated successfully '});
    } catch (error) {
        res.status(500).json({ error: 'Failed to activate user '});
    }
});

//update role
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        if (!['ADMIN', 'TEAM_LEADER', 'MEMBER'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }
        const success = await User.updateRole(req.params.id, role);
        if(!success) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User role updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update role' });
    }
});

//deactivate user
router.put('/users/:id/deactivate', async (req, res) => {
    try {
        const success = await User.deactivate(req.params.id);
        if(!success) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deactivaated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to deactivate user' });
    }
});

//delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const success = await User.delete(req.params.id);
        if(!success) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticate, isAdmin } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticate);

// Create team (Admin only)
router.post('/', isAdmin, teamController.createTeam);

// Get all teams (filtered by role)
router.get('/', teamController.getAllTeams);

// Get team by ID
router.get('/:id', teamController.getTeamById);

// Update team (Leader or Admin)
router.put('/:id', teamController.updateTeam);

// Add member (Leader only)
router.post('/:id/members', teamController.addMember);

// Remove member (Leader only)
router.delete('/:id/members/:userId', teamController.removeMember);

// Delete team (Admin only)
router.delete('/:id', isAdmin, teamController.deleteTeam);

module.exports = router;

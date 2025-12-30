const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticate, isAdmin, isLeaderOrAdmin } = require('../middlewares/auth');

//routes needs authentiation
router.use(authenticate);

//create team
router.post('/', isAdmin, teamController.createTeam);

//get all teams
router.get('/', teamController.getAllTeams);

//get team by id
router.get('/:id', teamController.getTeamById);

//update tema
router.put('/:id', teamController.updateTeam);

//add member to the team
router.post('/:id/members', teamController.addMember);

//remove member from team
router.delete('/:id/members/:userId', isLeaderOrAdmin, teamController.removeMember);

//delete team
router.delete('/:id', isAdmin, teamController.deleteTeam);

module.exports = router;


const Team = require('../models/teamModel');

//create team (admin only)
exports.createTeam = async (req, res) => {
    try {
        const { name, description, leader } = req.body;
        //validation
        if(!name || !description || !leader) {
            return res.status(400).json({
                message: 'Name description and leader are required',
                type: 'error'
            });
        }

        //chaeck if team name exists
        const existingTeam = await Team.findOne({ name });
        if(existingTeam) {
            return res.status(400).json({
                message: 'Team name already exists',
                type: 'error'
            });
        }

        //create team
        const team = new Team({
            name,
            description,
            leader,
            members: [leader] //leader is a member
        });

        await team.save();

        res.status(201).json({
            message: 'Team created successfully',
            type: 'success',
            team
        });
    } catch (error) {
        console.error('Create team error:', error);
        res.status(500).json({
            message: 'Failed to create team',
            type: 'error',
            error: error.message
        });
    }
};

//get all teams
exports.getAllTeams = async (req, res) => {
    try {
        let teams;

        if(req.user.role === 'ADMIN') {
            //admin sees all teams
            teams = await Team.find();
        } else {
            teams = await Team.find({
                $or: [
                    { leader: req.user.id },
                    { members: req.user.id }
                ]
            });
        }
        res.json({
            type: 'success',
            teams
        });
    } catch (error) {
        console.error('Get teams error: ', error);
        res.status(500).json({
            message: 'Failed to fetch teams',
            type: 'error',
            error: error.message
        });
    }
};

//get team by id
exports.getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if(!team) {
            return res.status(404).json({
                message: 'Team not found',
                type: 'error'
            });
        }

        //check permission(admin, leader or member)
        if(req.user.role !== 'ADMIN' &&
            team.leader !== req.user.id &&
            !team.members.includes(req.user.id)) {
                return res.status(403).json({
                    message: 'Access denied',
                    type: 'error'
                });
            }
            res.json({
                type: 'success',
                team
            });
    } catch (error) {
        console.error('Get team error:', error);
        res.status(500).json({
            message: 'Failed to fetch team',
            type: 'error',
            error: error.message
        });
    }
};

//update team
exports.updateTeam = async (req, res) => {
    try {
        const { name, description } = req.body;
        const team = await Team.findById(req.params.id);

        if(!team) {
            return res.status(404).json({
                message: 'Team not found',
                type: 'error'
            });
        }

        //check permission
        if(req.user.role !== 'ADMIN' && team.leader !== req.user.id) {
            return res.status(403).json({
                message: 'Only team leader or admin can update team',
                type: 'error'
            });
        }

        //update fields
        if(name) team.name = name;
        if (description) team.description = description;

        await team.save();

        res.json({
            message: 'Team updated..',
            type: 'success',
            team
        });
    } catch (error) {
        console.error('Updated team error: '. error);
        res.status(500).json({
            message: 'Failed to update team',
            type: 'error',
            error: error.message
        });
    }
};

//add memeber to team, only the leader!!
exports.addMember = async (req, res) => {
    try {
        const { userId } = req.body;
        const team = await Team.findById(req.params.id);

        if(!team) {
            return res.status(404).json({
                message: 'Team not found',
                type: 'error'
            });
        }

        //check permission
        if(req.user.role !== 'ADMIN' && team.leader !== req.user.id) {
            return res.status(403).json({
                message: 'Only team leader can add members',
                type: 'error'
            });
        }

        //check if user is member
        if(team.members.includes(userId)) {
            return res.status(400).json({
                message: 'User is already a member',
                type: 'error'
            });
        }

        team.members.push(userId);
        await team.save();

        res.json({
            message: 'Member added successfully',
            type: 'success',
            team
        });
    } catch (error) {
        console.error('Add member error:', error);
        res.status(500).json({
            message: 'Failed to add member',
            type: 'error',
            error: error.message
        });
    }
};

//remove meber from team, only the leader!
exports.removeMember = async (req, res) => {
    try {
        const { userId } = req.params;
        const team = await Team.findById(req.params.id);

        if(!team) {
            return res.status(404).json({
                message: 'Team not found',
                type: 'error'
            });
        }

        //check permission
        if(req.user.role !== 'ADMIN' && team.leader !== req.user.id) {
            return res.status(403).json({
                message: 'Only team leader can remove members',
                type: 'error'
            });
        }

        // leader cant be remived
        if(parseInt(userId) === team.leader) {
            return res.status(400).json({
                message: 'Cannnot remove team leader',
                type: 'error'
            });
        }
        //remove member
        team.members = team.members.filter(id => id !== parseInt(userId));
        await team.save();

        res.json({
            message: 'Member removed.',
            type: 'success',
            team
        });
    } catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({
            message: 'Failed to remove member',
            type: 'error',
            error: error.message
        });
    }
};

//delete team, only admin can do that
exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findByIdAndDelete(req.params.id);

        if(!team) {
            return res.status(404).json({
                message: 'Team not found',
                type: 'error'
            });
        }

        res.json({
            message: 'Team deleted successfully',
            type: 'success'
        });
    } catch (error) {
        console.error('Delete team error:', error);
        res.status(500).json({
            message: 'Failed to delete team',
            type: 'error',
            error: error.message
        });
    }
};
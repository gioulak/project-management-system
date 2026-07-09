const Team = require('../models/teamModel');

// Create team (Admin only)
exports.createTeam = async (req, res) => {
  try {
    const { name, description, leader } = req.body;

    // Validation
    if (!name || !description || !leader) {
      return res.status(400).json({ error: 'Name, description, and leader are required' });
    }

    // Check if team name exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ error: 'Team name already exists' });
    }

    // Create team
    const team = new Team({
      name,
      description,
      leader,
      members: [leader] // Leader is automatically a member
    });

    await team.save();

    res.status(201).json({
      message: 'Team created successfully',
      team
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
};

// Get all teams (Admin sees all, others see their teams)
exports.getAllTeams = async (req, res) => {
  try {
    let teams;

    if (req.user.role === 'ADMIN') {
      // Admin sees all teams
      teams = await Team.find();
    } else {
      // Users see teams they're part of (as leader or member)
      teams = await Team.find({
        $or: [
          { leader: req.user.id },
          { members: req.user.id }
        ]
      });
    }

    res.json(teams);
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};

// Get team by ID
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check permission (Admin, Leader, or Member)
    if (req.user.role !== 'ADMIN' && 
        team.leader !== req.user.id && 
        !team.members.includes(req.user.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(team);
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

// Update team (Leader or Admin)
exports.updateTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check permission
    if (req.user.role !== 'ADMIN' && team.leader !== req.user.id) {
      return res.status(403).json({ error: 'Only team leader or admin can update team' });
    }

    // Update fields
    if (name) team.name = name;
    if (description) team.description = description;

    await team.save();

    res.json({
      message: 'Team updated successfully',
      team
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({ error: 'Failed to update team' });
  }
};

// Add member to team (Leader only)
exports.addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check permission (only leader)
    if (req.user.role !== 'ADMIN' && team.leader !== req.user.id) {
      return res.status(403).json({ error: 'Only team leader can add members' });
    }

    // Check if user is already a member
    if (team.members.includes(userId)) {
      return res.status(400).json({ error: 'User is already a member' });
    }

    team.members.push(userId);
    await team.save();

    res.json({
      message: 'Member added successfully',
      team
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
};

// Remove member from team (Leader only)
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check permission (only leader)
    if (req.user.role !== 'ADMIN' && team.leader !== req.user.id) {
      return res.status(403).json({ error: 'Only team leader can remove members' });
    }

    // Can't remove the leader
    if (parseInt(userId) === team.leader) {
      return res.status(400).json({ error: 'Cannot remove team leader' });
    }

    team.members = team.members.filter(id => id !== parseInt(userId));
    await team.save();

    res.json({
      message: 'Member removed successfully',
      team
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

// Delete team (Admin only)
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({ error: 'Failed to delete team' });
  }
};

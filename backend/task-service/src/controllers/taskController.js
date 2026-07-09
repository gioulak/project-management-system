const Task = require('../models/taskModel');

// Create task (Team Leader only)
exports.createTask = async (req, res) => {
  try {
    const { title, description, teamId, assignedTo, priority, dueDate } = req.body;

    // Validation
    if (!title || !description || !teamId || !assignedTo || !dueDate) {
      return res.status(400).json({ 
        error: 'Title, description, teamId, assignedTo, and dueDate are required' 
      });
    
    }

    //validate dueDate
    const parseDate = new Date(dueDate);
    if(isNaN(parseDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    if (parseDate < new Date()) {
      return res.status(400).json({ error: 'Due date is wrong, must be in the future!'});
    }

    // Create task
    const task = new Task({
      title,
      description,
      teamId,
      assignedTo,
      priority: priority || 'MEDIUM',
      dueDate: new Date(dueDate),
      createdBy: req.user.id,
      status: 'TODO'
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Get all tasks (filtered by role and query params)
exports.getAllTasks = async (req, res) => {
  try {
    const { teamId, status, assignedTo } = req.query;
    let query = {};

    // Build query based on role
    if (req.user.role === 'MEMBER') {
      // Members only see their assigned tasks
      query.assignedTo = req.user.id;
    } else if (req.user.role === 'TEAM_LEADER') {
      // Leaders see tasks in their teams (would need team verification)
      // For simplicity, we'll allow filtering by teamId
      if (teamId) {
        query.teamId = teamId;
      }
    }
    // Admin sees all tasks (no restrictions)

    // Apply filters
    if (status) {
      query.status = status;
    }
    if (assignedTo && req.user.role !== 'MEMBER') {
      query.assignedTo = parseInt(assignedTo);
    }
    if (teamId && req.user.role === 'ADMIN') {
      query.teamId = teamId;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get tasks for current user
exports.getMyTasks = async (req, res) => {
  try {
    const { status } = req.query;
    let query = { assignedTo: req.user.id };

    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query).sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check permission (Admin, Creator, or Assigned user)
    if (req.user.role !== 'ADMIN' && 
        task.createdBy !== req.user.id && 
        task.assignedTo !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Update task (Team Leader or Creator)
exports.updateTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check permission (Admin, Team Leader, or Creator)
    if (req.user.role !== 'ADMIN' && 
        req.user.role !== 'TEAM_LEADER' && 
        task.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Only task creator, team leader, or admin can update task' });
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.description = description;
    if (assignedTo) task.assignedTo = assignedTo;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = new Date(dueDate);

    await task.save();

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Update task status (Assigned user or Leader)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate status
    if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check permission (Assigned user, Team Leader, or Admin)
    if (task.assignedTo !== req.user.id && 
        req.user.role !== 'TEAM_LEADER' && 
        req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only assigned user, team leader, or admin can update status' });
    }

    task.status = status;
    await task.save();

    res.json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Failed to update task status' });
  }
};

// Delete task (Team Leader or Admin)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check permission
    if (req.user.role !== 'ADMIN' && req.user.role !== 'TEAM_LEADER') {
      return res.status(403).json({ error: 'Only team leader or admin can delete tasks' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Add comment to task
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    // Check permission (assigned user, creator, team leader, or admin)
    if (task.assignedTo !== req.user.id && 
        task.createdBy !== req.user.id &&
        req.user.role !== 'TEAM_LEADER' && 
        req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Add comment
    task.comments.push({
      text: text.trim(),
      userId: req.user.id
    });

    await task.save();

    res.status(201).json({
      message: 'Comment added successfully',
      task
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

// Get tasks by team
exports.getTasksByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { status } = req.query;

    //check for permission
    if(req.user.role !== 'ADMIN' && req.user.role !== 'TEAM_LEADER') {
      return res.status(403).json({ error: 'Access denoed' });
    }

    let query = { teamId };
    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks by team error:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

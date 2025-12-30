const Task = require('../models/taskModel');

//create team (admin only)
exports.createTask = async (req, res) => {
    try {
        const { title, description, teamId, assignedTo, priority, dueDate } = req.body;
        //validation
        if(!title || !description || !teamId || !assignedTo || !priority || !dueDate) {
            return res.status(400).json({
                message: 'Title, description, assignedTo, priority, dueDate are required',
                type: 'error'
            });
        }

        //create task
        const task = new Task({
            title, 
            description, 
            teamId, 
            assignedTo, 
            priority: priority || 'MEDIUM', 
            dueDate:new Date(dueDate),
            createdBy: req.user.id,
            status: 'TODO'
        });

        await task.save();

        res.status(201).json({
            message: 'Task created successfully',
            type: 'success',
            task
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            message: 'Failed to create task',
            type: 'error',
            error: error.message
        });
    }
};

//get all teams
exports.getAllTasks = async (req, res) => {
    try {
        const { teamId, status, assignedTo } = req.query;
        let query = {};

        if(req.user.role === 'MEMBER') {
            //members see their tasks
            query.assignedTo = req.user.id;
        } else if (req.user.role == 'TEAM_LEADER') {
            //leaders can filter by team
            if(teamId) {
                query.teamId = teamId;
            }
        }
        if(status) {
            query.status = status;
        }
        if(assignedTo && req.user.role !== 'MEMBER') {
            query.assignedTo = parseInt(assignedTo);
        }
        if(teamId && req.user.role === 'ADMIN') {
            query.teamId = teamId;
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        res.json({
            type: 'success',
            tasks
        });
    } catch (error) {
        console.error('Get tasks error: ', error);
        res.status(500).json({
            message: 'Failed to fetch tasks',
            type: 'error',
            error: error.message
        });
    }
};

//get the tasks for curr user
exports.getMyTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let query = { assignedTo: req.user.id };

        if(status) {
            query.status = status;
        }

        const tasks = await Task.find(query).sort({ dueDate: 1 });

        res.json({
            type: 'success',
            tasks
        });
    } catch (error) {
        console.error('Get my tasks error: ', error);
        res.status(500).json({
            message: 'Failed to fetch tasks',
            type: 'error',
            error: error.message
        });
    }
};

//get team by id
exports.getTasksById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if(!task) {
            return res.status(404).json({
                error: 'Task not found',
                type: 'error'
            });
        }

        //check permission(admin, leader or assigned user)
        if(req.user.role !== 'ADMIN' &&
            task.createdBy !== req.user.id &&
            task.assignedTo !== req.user.id) {
            return res.status(403).json({
                message: 'Access denied',
                type: 'error'
                });
            }
            res.json({
                type: 'success',
                task
            });
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({
            message: 'Failed to fetch task',
            type: 'error',
            error: error.message
        });
    }
};

//update task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, assignedTo, priority, dueDate } = req.body;
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({
                message: 'Task not found',
                type: 'error'
            });
        }

        //check permission
        if(req.user.role !== 'ADMIN' && req.user.role !== 'TEAM_LEADER' && task.createdBy !== req.user.id) {
            return res.status(403).json({
                message: 'Only team leader or admin can update team',
                type: 'error'
            });
        }

        //update fields
        if (title) task.title = title;
        if (description) task.description = description;
        if (assignedTo) task.assignedTo = assignedTo;
        if (priority) task.priority = priority;
        if (dueDate) task.dueDate = new Date(dueDate);

        await task.save();

        res.json({
            message: 'Task updated..',
            type: 'success',
            task
        });
    } catch (error) {
        console.error('Updated task error: '. error);
        res.status(500).json({
            message: 'Failed to update task',
            type: 'error',
            error: error.message
        });
    }
};

//add task status
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({
                message: 'Task not found',
                type: 'error'
            });
        }

        //check statue
        if(!['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
            return res.status(403).json({
                message: 'Invalid status',
                type: 'error'
            });
        }

        //check permission
        if(task.assignedTo !== req.user.id && req.user.role !== 'TEAM_LEADER' && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                error: 'Only assignrd user, team leader or admin can update status',
                type: 'error'
            });
        }

       task.status = status;
        await task.save();

        res.json({
            message: 'Task updated successfully',
            type: 'success',
            task
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            message: 'Failed to update status',
            type: 'error',
            error: error.message
        });
    }
};


//delete task, only admin, team leader can do that
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({
                message: 'Task not found',
                type: 'error'
            });
        }

        //check permission
        if(req.user.role !== 'TEAM_LEADER' && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                message: 'Only team leader or admin can delete tasks',
                type: 'error'
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({
            message: 'Task deleted successfully',
            type: 'success'
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            message: 'Failed to delete task',
            type: 'error',
            error: error.message
        });
    }
};

//add comment to task
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const task = await Task.findById(req.params.id);

        if(!task) {
            return res.status(404).json({
                message: 'Task not found',
                type: 'error' 
            });
        }

        //
        if(!text || text.trim().length === 0) {
            return res.status(400).json({
                message: 'Comment text required',
                type: 'error' //maybe make it a warning
            });
        }

        //check permission
        if(task.assignedTo !== req.user.id && task.createdBy !== req.user.id && req.user.role !== 'TEAM_LEADER' && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                message: 'Access denied',
                type: 'error'
            });
        }

        //add the comment
        task.comments.push({
            text: text.trim(),
            userId: req.user.id
        });

        await task.save();
        
        res.status(201).json({
            message: 'Comment added successfully',
            type: 'success',
            task
        });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({
            message: 'Failed to add comment',
            type: 'error',
            error: error.message
        });
    }
};

//get tasks by team
exports.getTasksByTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { status } = req.query;

        let query = { teamId };
        if(status) {
            query.status = status;
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });

        res.json({
            type: 'success',
            tasks
        });
    } catch (error) {
        console.error('Get tasks by team error:', error);
        res.status(500).json({
            message: 'Failed to fetch tasks',
            type: 'error',
            error: error.message
        });
    }
};
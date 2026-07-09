const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate, isLeaderOrAdmin } = require('../middlewares/auth');

// All routes require authentication
router.use(authenticate);

// Create task (Team Leader or Admin)
router.post('/', isLeaderOrAdmin, taskController.createTask);

// Get all tasks (filtered by role and query params)
router.get('/', taskController.getAllTasks);

// Get current user's tasks
router.get('/my-tasks', taskController.getMyTasks);

// Get tasks by team
router.get('/team/:teamId', taskController.getTasksByTeam);

// Get task by ID
router.get('/:id', taskController.getTaskById);

// Update task (Leader or Admin)
router.put('/:id', isLeaderOrAdmin, taskController.updateTask);

// Update task status (Assigned user, Leader, or Admin)
router.patch('/:id/status', taskController.updateTaskStatus);

// Delete task (Leader or Admin)
router.delete('/:id', isLeaderOrAdmin, taskController.deleteTask);

// Add comment to task
router.post('/:id/comments', taskController.addComment);

module.exports = router;

const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate, isLeaderOrAdmin } = require('../middlewares/auth');

//routes needs authentiation
router.use(authenticate);

//create task
router.post('/', isLeaderOrAdmin, taskController.createTask);

//get all tasks
router.get('/', taskController.getAllTasks);

//het current user's tasks
router.get('/my-tasks', taskController.getMyTasks);

//get tasks by team
router.get('/team/:teamId', taskController.getTasksByTeam);

//get task by id
router.get('/:id', taskController.getTasksById);

//update task
router.put('/:id', isLeaderOrAdmin, taskController.updateTask);

//update task status
router.patch('/:id/status', taskController.updateStatus);

//delete task
router.delete('/:id', isLeaderOrAdmin, taskController.deleteTask);

//add comment to task
router.post('/:id/comments', taskController.addComment);

module.exports = router;
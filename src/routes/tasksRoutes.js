const express = require('express');
const router = express.Router();
const taskController = require('../controllers/tasksControllers');

//Ruta para obener todas las tareas
router.get('/tasks', taskController.getAllTasks);

//Ruta para crear una nueva tarea
router.post('/tasks', taskController.createTask);

//Ruta para marcar una tarea como completada
router.put('/tasks/:id/complete', taskController.completeTask);

//Ruta para eliminar una tarea
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
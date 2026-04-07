const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');

// GET /api/v1/tasks - Obtener todas las tareas
router.get('/', taskController.getTasks);

// POST /api/v1/tasks - Crear una tarea
router.post('/', taskController.createTask);

// PATCH /api/v1/tasks/:id - Actualizar una tarea
router.patch('/:id', taskController.updateTask);

// DELETE /api/v1/tasks/:id - Eliminar una tarea
router.delete('/:id', taskController.deleteTask);

module.exports = router;
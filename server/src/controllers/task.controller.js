const taskService = require('../services/task.service');

/**
 *  Obtine todas las tareas
 */
const obtenerTodas = (req, res, next) => {
    try {
        const tasks = taskService.obtenerTodas();
        res.json(tasks);
    } catch (error) {
        next(error);
    }
};

/**
 * Crea una nueva tarea
 */
const crearTarea = (req, res, next) => {
    try {
        const { titulo, prioridad } = req.body;

        // Validaciones defensivas
        if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
            return res.status(400).json({ 
                error: 'El título es obligatorio y debe tener al menos 3 caracteres.' 
            });
        }

        const prioridadesValidas = ['alta', 'media', 'baja'];
        if (prioridad && !prioridadesValidas.includes(prioridad)) {
            return res.status(400).json({ 
                error: 'La prioridad debe ser alta, media o baja.' 
            });
        }

        const tarea = taskService.crearTarea({ titulo, prioridad });
        res.status(201).json(tarea);
    } catch (err) {
        next(err);
    }
};

/**
 * Actualiza una tarea existente
 */
const updateTask = (req, res, next) => {
    try {
        const { id } = req.params;
        const { titulo, completed, prioridad } = req.body;

        // Validaciones defensivas
        if (titulo && (typeof titulo !== 'string' || titulo.trim().length < 3)) {
            return res.status(400).json({ 
                error: 'El título debe tener al menos 3 caracteres.' 
            });
        }

        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({ 
                error: 'El campo completed debe ser true o false.' 
            });
        }

        const tarea = taskService.actualizarTarea(id, { titulo, completed, prioridad });
        res.status(200).json(tarea);
    } catch (err) {
        next(err);
    }
};

/**
 * Elimina una tarea
 */
const deleteTask = (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('ID recibido:', id);
        taskService.eliminarTarea(id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getTasks: obtenerTodas,
    createTask: crearTarea,
    updateTask,
    deleteTask
};
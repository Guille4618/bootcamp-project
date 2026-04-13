const { v4: uuidv4 } = require('crypto').randomUUID 
    ? { v4: () => require('crypto').randomUUID() }
    : { v4: () => Date.now().toString() };

// Array en memoria como persistencia simulada
let tasks = [];

/**
 * Obtiene todas las tareas
 * @returns {Array} Lista de tareas
 */
function obtenerTodas() {
    return tasks;
}

/**
 * Crea una nueva tarea
 * @param {Object} data Datos de la tarea
 * @returns {Object} Tarea creada
 */
function crearTarea(data) {
    const tarea = {
        id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36),
        title: data.titulo.trim(),
        completed: false,
        priority: data.prioridad || 'media',
        createdAt: new Date().toLocaleDateString('es-ES')
    };
    tasks.push(tarea);
    return tarea;
}

/**
 * Actualiza una tarea existente
 * @param {string} id ID de la tarea
 * @param {Object} data Datos a actualizar
 * @returns {Object} Tarea actualizada
 */
function actualizarTarea(id, data) {
    const index = tasks.findIndex(function(t) {
        return t.id === id;
    });
    if (index === -1) throw new Error('NOT_FOUND');
    tasks[index] = { ...tasks[index], ...data };
    return tasks[index];
}

/**
 * Elimina una tarea
 * @param {string} id ID de la tarea
 * @returns {void}
 */
function eliminarTarea(id) {
    const index = tasks.findIndex(function(t) {
        return t.id === id;
    });
    if (index === -1) throw new Error('NOT_FOUND');
    tasks.splice(index, 1);
}

module.exports = {
    obtenerTodas,
    crearTarea,
    actualizarTarea,
    eliminarTarea
};
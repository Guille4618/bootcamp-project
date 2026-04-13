const API_URL = 'https://bootcamp-project-ulf4.vercel.app/api/tasks';

async function obtenerTareas() {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener las tareas');
    return response.json();
}

async function crearTarea(titulo, prioridad) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, prioridad })
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear la tarea');
    }
    return response.json();
}

async function actualizarTarea(id, datos) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al actualizar la tarea');
    }
    return response.json();
}

async function eliminarTarea(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar la tarea');
}
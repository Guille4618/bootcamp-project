const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares globales
app.use(cors({
    origin: 'https://bootcamp-project-ulf4.vercel.app'
}));
app.use(express.json());

// Middleware de auditoría
const loggerAcademico = (req, res, next) => {
    const inicio = performance.now();
    res.on('finish', () => {
        const duracion = performance.now() - inicio;
        console.log(`[${req.method}] ${req.originalUrl} - Estado: ${res.statusCode} (${duracion.toFixed(2)}ms)`);
    });
    next();
};
app.use(loggerAcademico);

// Rutas
const taskRoutes = require('./routes/task.routes');
app.use('/api/tasks', taskRoutes);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
    if (err.message === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
    const { PORT } = require('./config/env');
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}

// Para Vercel
module.exports = app;
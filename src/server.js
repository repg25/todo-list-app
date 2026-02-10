const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas y controladores
const taskRoutes = require('./routes/tasksRoutes');
const { getAllTasks, createTask, completeTask, deleteTask } = require('./controllers/tasksControllers');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', taskRoutes);

// Ruta de prueba para verificar que el servidor esta funcionando
app.get('/', (req, res) => {
    res.json({
        message: 'API To-Do List funcionando correctamente',
        endpoints: {
            getAllTasks: 'GET /api/tasks',
            createTask: 'POST /api/tasks',
            completeTask: 'PUT /api/tasks/:id/complete',
            deleteTask: 'DELETE /api/tasks/:id'
        }
    });
});

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.path
    });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: err.message
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log(`Base de datos: ${process.env.DB_DATABASE}`);
    console.log(`Server: ${process.env.DB_SERVER}`);
});
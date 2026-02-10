const { parse } = require('dotenv');
const {sql, getConnection} = require('../config/database');

// Controlador para obtener todas las tareas
exports.getAllTasks = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .query('SELECT * FROM tasks ORDER BY created_at DESC');

            res.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener tareas:', error);
        res.status(500).json({
            error: 'Error al obtener tareas',
            message: error.message
        });
    }
};

// Controlador para crear una nueva tarea
exports.createTask = async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;
        
        //Validar que el titulo no este vacio o sean solo espacion en blanco
        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({
                error: 'El titulo es requerido' 
            });
    }

    //Validar titulo y descripcion sean string validos
    const pool = await getConnection();
    const result = await pool.request()
        .input('titulo', sql.NVarChar, titulo.trim())
        .input('descripcion', sql.NVarChar, descripcion ? descripcion.trim() : '')
        .query(`
            INSERT INTO tasks (titulo, descripcion)
            OUTPUT INSERTED.*
            VALUES (@titulo, @descripcion)
        `);
    res.status(201).json(result.recordset[0]);
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(500).json({
            error: 'Error al crear tarea',
            message: error.message
        });
    }
};


// Controlador para marcar una tarea como completada
exports.completeTask = async (req, res) => {

    // Validar que el id sea un numero entero positivo
    try {
        const { id } = req.params;
        const pool = await getConnection();
        const taskResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT created_at, is_completed FROM tasks WHERE id = @id');
        
        //Validar que la tarea exista y no este completada antes de marcarla como completada
        if (taskResult.recordset.length === 0) {
            return res.status(404).json({
                error: 'Tarea no encontrada'
            });
        }

        //Validar que la tarea no este ya completada
        if (taskResult.recordset[0].is_completed) {
            return res.status(400).json({
                error: 'La tarea ya esta completada'
            });
        }

        //Calcular la duracion en minutos desde crearla hasta completarla
        const createdAt = new Date(taskResult.recordset[0].created_at);
        const completedAt = new Date();
        const duracion_minutos = Math.round((completedAt - createdAt) / (1000 * 60));

        //Actualizar la tarea como completada y calcular la duracion en minutos
        const result = await pool.request()
            .input('id', sql.Int, id)
                .input('completed_at', sql.DateTime2, completedAt)
                .input('duracion_minutos', sql.Int, duracion_minutos)
                .query(`
                    UPDATE tasks
                    SET is_completed = 1,
                        completed_at = @completed_at,
                        duracion_minutos = @duracion_minutos
                    OUTPUT INSERTED.*
                    WHERE id = @id
                    `);
        res.json(result.recordset[0]);

    } catch (error) {
        console.error('Error al completar tarea:', error);
        res.status(500).json({
            error: 'Error al completar tarea',
            message: error.message
        });
    }
};

// Controlador para eliminar una tarea
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await getConnection();

        const checkResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT id FROM tasks WHERE id = @id');

        // Validar que la tarea exista antes de intentar eliminarla
        if (checkResult.recordset.length === 0) {
            return res.status(404).json({
                error: 'Tarea no encontrada'
            });
        }

        //Eliminar la tarea
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM tasks WHERE id = @id');

        res.json({
            message: 'Tarea eliminada exitosamente',
            id: parseInt(id)
        });   
    } catch (error) {
        console.error('Error al eliminar tarea:', error);
        res.status(500).json({
            error: 'Error al eliminar tarea',
            message: error.message
        });
    }
};


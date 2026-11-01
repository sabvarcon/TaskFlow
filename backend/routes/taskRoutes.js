const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

// Todas estas rutas requieren autenticación
router.use(auth);

// Crear tarea
router.post('/', createTask);

// Consultar todas las tareas
router.get('/', getTasks);

// Consultar una tarea
router.get('/:id', getTaskById);

// Actualizar tarea
router.put('/:id', updateTask);

// Eliminar tarea
router.delete('/:id', deleteTask);

module.exports = router;
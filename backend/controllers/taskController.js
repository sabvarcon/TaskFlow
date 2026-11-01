const Task = require('../models/Task');
const mongoose = require('mongoose');

// CREAR UNA TAREA
const createTask = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                mensaje: 'El título de la tarea es obligatorio'
            });
        }

        const task = await Task.create({
            title: title.trim(),
            description: description || '',
            user: req.user.id
        });

        res.status(201).json({
            mensaje: 'Tarea creada correctamente',
            tarea: task
        });

    } catch (error) {
        next(error);
    }
};

// CONSULTAR TODAS LAS TAREAS DEL USUARIO
const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            total: tasks.length,
            tareas: tasks
        });

    } catch (error) {
        next(error);
    }
};

// CONSULTAR UNA TAREA ESPECÍFICA
const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: 'El ID de la tarea no es válido'
            });
        }

        const task = await Task.findOne({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                mensaje: 'Tarea no encontrada'
            });
        }

        res.status(200).json({
            tarea: task
        });

    } catch (error) {
        next(error);
    }
};

// ACTUALIZAR UNA TAREA
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: 'El ID de la tarea no es válido'
            });
        }

        const updates = {};

        if (title !== undefined) {
            if (typeof title !== 'string' || !title.trim()) {
                return res.status(400).json({
                    mensaje: 'El título no puede estar vacío'
                });
            }

            updates.title = title.trim();
        }

        if (description !== undefined) {
            if (typeof description !== 'string') {
                return res.status(400).json({
                    mensaje: 'La descripción debe ser texto'
                });
            }

            updates.description = description.trim();
        }

        if (completed !== undefined) {
            if (typeof completed !== 'boolean') {
                return res.status(400).json({
                    mensaje: 'El estado debe ser verdadero o falso'
                });
            }

            updates.completed = completed;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                mensaje: 'Debes proporcionar al menos un campo para actualizar'
            });
        }

        const task = await Task.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                mensaje: 'Tarea no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Tarea actualizada correctamente',
            tarea: task
        });

    } catch (error) {
        next(error);
    }
};

// ELIMINAR UNA TAREA
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                mensaje: 'El ID de la tarea no es válido'
            });
        }

        const task = await Task.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({
                mensaje: 'Tarea no encontrada'
            });
        }

        res.status(200).json({
            mensaje: 'Tarea eliminada correctamente'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middlewares generales
app.use(cors());
app.use(express.json());

// Archivos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta principal de la API
app.get('/api', (req, res) => {
    res.status(200).json({
        mensaje: 'API TaskFlow funcionando correctamente'
    });
});

// Rutas de autenticación
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Ruta para direcciones inexistentes
app.use((req, res) => {
    res.status(404).json({
        mensaje: 'Ruta no encontrada'
    });
});

// Middleware global de errores
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        mensaje: err.message || 'Error interno del servidor'
    });
});

// Iniciar servidor después de conectar MongoDB
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Servidor funcionando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('No fue posible iniciar TaskFlow');
        process.exit(1);
    }
};

startServer();
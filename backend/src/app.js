
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

const empresaRoutes = require('./routes/empresa.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba del servidor
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de gestión de empresas funcionando'
  });
});

// Ruta de prueba de PostgreSQL
app.get('/api/test-db', async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT NOW() AS fecha_actual'
    );

    res.status(200).json({
      success: true,
      message: 'Conexión a PostgreSQL exitosa',
      fecha: resultado.rows[0].fecha_actual
    });
  } catch (error) {
    console.error('Error de base de datos:', error);

    res.status(500).json({
      success: false,
      message: 'Error al conectar con PostgreSQL'
    });
  }
});

// Rutas del CRUD
app.use('/api/empresas', empresaRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error del servidor:', err);

  res.status(err.status || 500).json({
    success: false,
    message: err.status === 400
      ? 'Solicitud JSON inválida'
      : 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Servidor ejecutándose en http://localhost:${PORT}`
  );
});

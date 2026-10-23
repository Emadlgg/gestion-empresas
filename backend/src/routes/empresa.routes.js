
const express = require('express');

const router = express.Router();

const {
  obtenerEmpresas,
  obtenerEmpresaPorId,
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa
} = require('../controllers/empresa.controller');

// Consultar todas las empresas
router.get('/', obtenerEmpresas);

// Consultar una empresa por ID
router.get('/:id', obtenerEmpresaPorId);

// Registrar una nueva empresa
router.post('/', crearEmpresa);

// Actualizar una empresa
router.put('/:id', actualizarEmpresa);

// Eliminar una empresa
router.delete('/:id', eliminarEmpresa);

module.exports = router;

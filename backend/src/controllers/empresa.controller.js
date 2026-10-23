
const pool = require('../config/database');
const { validarNitGuatemala } = require('../validators/nit.validator');

// Validar el identificador de una empresa
const validarId = (id) => {
  return /^\d+$/.test(String(id)) &&
    Number.isSafeInteger(Number(id)) &&
    Number(id) > 0 &&
    Number(id) <= 2147483647;
};

// Validar los datos de una empresa

const validarEmpresa = (datos, esEdicion = false) => {
  const errores = [];

  if (
    datos === null ||
    typeof datos !== 'object' ||
    Array.isArray(datos)
  ) {
    return ['Debes enviar un objeto JSON válido'];
  }

  const campos = {
    nombre_comercial: 150,
    razon_social: 200,
    telefono: 20,
    nit: 20,
    estado: 20,
    direccion: null
  };

  if (!esEdicion) {
    campos.correo_electronico = 150;
  }

  // Validar campos obligatorios y longitudes
  for (const [campo, longitudMaxima] of Object.entries(campos)) {
    const valor = datos[campo];

    if (typeof valor !== 'string' || !valor.trim()) {
      errores.push(`El campo ${campo} es obligatorio`);
      continue;
    }

    if (longitudMaxima && valor.trim().length > longitudMaxima) {
      errores.push(
        `El campo ${campo} no puede superar ${longitudMaxima} caracteres`
      );
    }
  }

  // Validar teléfono
  if (
    typeof datos.telefono === 'string' &&
    datos.telefono.trim() &&
    !/^[0-9+\s()-]{8,20}$/.test(datos.telefono.trim())
  ) {
    errores.push('El formato del teléfono no es válido');
  }

  // Validar correo solo durante el registro
  if (!esEdicion && typeof datos.correo_electronico === 'string') {
    const correo = datos.correo_electronico.trim();

    if (
      correo &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
    ) {
      errores.push('El correo electrónico no es válido');
    }
  }

  // Validar NIT guatemalteco
  if (
    typeof datos.nit === 'string' &&
    datos.nit.trim() &&
    !validarNitGuatemala(datos.nit)
  ) {
    errores.push(
      'El NIT no es válido. Verifica el dígito verificador'
    );
  }

  // Validar estado
  if (
    typeof datos.estado === 'string' &&
    datos.estado.trim() &&
    !['Activo', 'Inactivo'].includes(datos.estado)
  ) {
    errores.push('El estado debe ser Activo o Inactivo');
  }

  return errores;
};


// GET: obtener todas las empresas
const obtenerEmpresas = async (req, res) => {
  try {
    const resultado = await pool.query(
      'SELECT * FROM empresas ORDER BY id ASC'
    );

    res.status(200).json({
      success: true,
      data: resultado.rows
    });
  } catch (error) {
    console.error('Error al obtener empresas:', error);

    res.status(500).json({
      success: false,
      message: 'Error al obtener las empresas'
    });
  }
};

// GET: obtener una empresa por ID
const obtenerEmpresaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de empresa inválido'
      });
    }

    const resultado = await pool.query(
      'SELECT * FROM empresas WHERE id = $1',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: resultado.rows[0]
    });
  } catch (error) {
    console.error('Error al consultar empresa:', error);

    res.status(500).json({
      success: false,
      message: 'Error al consultar la empresa'
    });
  }
};

// POST: registrar una empresa

const crearEmpresa = async (req, res) => {
  try {
    // Verificar que se haya enviado un objeto JSON válido
    if (
      !req.body ||
      typeof req.body !== 'object' ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Debes enviar un objeto JSON válido'
      });
    }

    // Validar los datos recibidos
    const errores = validarEmpresa(req.body);

    if (errores.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errores
      });
    }

    // Obtener los datos de la empresa
    const {
      nombre_comercial,
      razon_social,
      telefono,
      correo_electronico,
      nit,
      estado,
      direccion
    } = req.body;

    // Registrar la empresa en PostgreSQL
    const resultado = await pool.query(
      `INSERT INTO empresas (
        nombre_comercial,
        razon_social,
        telefono,
        correo_electronico,
        nit,
        estado,
        direccion
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        nombre_comercial.trim(),
        razon_social.trim(),
        telefono.trim(),
        correo_electronico.trim(),
        nit.trim().toUpperCase(),
        estado.trim(),
        direccion.trim()
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Empresa registrada correctamente',
      data: resultado.rows[0]
    });

  } catch (error) {
    console.error('Error al registrar empresa:', error);

    // Correo electrónico o NIT duplicado
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'El correo electrónico o NIT ya está registrado'
      });
    }

    // Error de validación de PostgreSQL
    if (
      error.code === '23514' ||
      error.code === '23502' ||
      error.code === '22001'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Los datos no cumplen las restricciones permitidas'
      });
    }

    // Error inesperado
    return res.status(500).json({
      success: false,
      message: 'Error interno al registrar la empresa'
    });
  }
};


// PUT: actualizar una empresa

const actualizarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar el identificador de la empresa
    if (!validarId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de empresa inválido'
      });
    }

    // Verificar que se haya enviado un objeto JSON válido
    if (
      !req.body ||
      typeof req.body !== 'object' ||
      Array.isArray(req.body)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Debes enviar un objeto JSON válido'
      });
    }

    // No permitir modificaciones del correo electrónico
    if (
      Object.prototype.hasOwnProperty.call(
        req.body,
        'correo_electronico'
      )
    ) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico no se puede modificar'
      });
    }

    // Validar los campos que se pueden editar
    const errores = validarEmpresa(req.body, true);

    if (errores.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errores
      });
    }

    // Obtener los datos editables
    const {
      nombre_comercial,
      razon_social,
      telefono,
      nit,
      estado,
      direccion
    } = req.body;

    // Actualizar la empresa en PostgreSQL
    const resultado = await pool.query(
      `UPDATE empresas
       SET
         nombre_comercial = $1,
         razon_social = $2,
         telefono = $3,
         nit = $4,
         estado = $5,
         direccion = $6
       WHERE id = $7
       RETURNING *`,
      [
        nombre_comercial.trim(),
        razon_social.trim(),
        telefono.trim(),
        nit.trim().toUpperCase(),
        estado.trim(),
        direccion.trim(),
        id
      ]
    );

    // Verificar si la empresa existe
    if (resultado.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Empresa actualizada correctamente',
      data: resultado.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar empresa:', error);

    // NIT duplicado
    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'El NIT ya está registrado en otra empresa'
      });
    }

    // Error de validación de PostgreSQL
    if (
      error.code === '23514' ||
      error.code === '23502' ||
      error.code === '22001'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Los datos no cumplen las restricciones permitidas'
      });
    }

    // Error inesperado
    return res.status(500).json({
      success: false,
      message: 'Error interno al actualizar la empresa'
    });
  }
};


// DELETE: eliminar una empresa
const eliminarEmpresa = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validarId(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de empresa inválido'
      });
    }

    const resultado = await pool.query(
      'DELETE FROM empresas WHERE id = $1 RETURNING id',
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Empresa eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar empresa:', error);

    res.status(500).json({
      success: false,
      message: 'Error al eliminar la empresa'
    });
  }
};

module.exports = {
  obtenerEmpresas,
  obtenerEmpresaPorId,
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa
};

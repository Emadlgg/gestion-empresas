# Sistema de Gestión de Empresas

Aplicación web desarrollada para la administración de empresas mediante operaciones CRUD (Crear, Consultar, Actualizar y Eliminar).

El proyecto está dividido en un frontend desarrollado con Angular y una API REST construida con Node.js y Express. La información se almacena de forma persistente en PostgreSQL.

## Tecnologías utilizadas

### Frontend
- Angular 21
- TypeScript
- HTML5 y CSS3
- Angular Reactive Forms
- Angular Signals
- HttpClient
- Angular Router

### Backend
- Node.js
- Express
- PostgreSQL
- node-postgres (`pg`)
- dotenv
- CORS
- Nodemon

## Funcionalidades

- Listado general de empresas registradas.
- Registro de nuevas empresas.
- Consulta del detalle de una empresa.
- Actualización de la información de empresas.
- Eliminación de empresas con confirmación.
- Validación de campos obligatorios.
- Validación de correo electrónico y teléfono.
- Validación del formato y dígito verificador del NIT guatemalteco tradicional.
- Restricción para impedir la modificación del correo electrónico durante la edición.
- Control de registros duplicados mediante restricciones de base de datos.
- Mensajes de confirmación y manejo de errores.
- Actualización del listado sin recargar la página.
- Filas alternadas en colores celeste y verde.
- Diseño adaptable a diferentes tamaños de pantalla.

## Estructura del proyecto

```text
gestion-empresas/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── empresa.controller.js
│   │   ├── routes/
│   │   │   └── empresa.routes.js
│   │   ├── validators/
│   │   │   └── nit.validator.js
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── models/
│   │       ├── services/
│   │       ├── validators/
│   │       └── pages/
│   │           ├── empresas-lista/
│   │           ├── empresa-formulario/
│   │           └── empresa-detalle/
│   ├── angular.json
│   └── package.json
├── database/
│   └── schema.sql
├── .gitignore
└── README.md
```

## Requisitos previos

Para ejecutar el proyecto localmente es necesario contar con:

- Node.js compatible con Angular 21.
- npm.
- PostgreSQL.
- Angular CLI.
- Git (opcional para la ejecución local).

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Emadlgg/gestion-empresas.git
cd gestion-empresas
```

### 2. Configurar PostgreSQL

Crear una base de datos llamada:

```sql
CREATE DATABASE gestion_empresas;
```

Conectarse a la base de datos `gestion_empresas` y ejecutar el archivo:

```text
database/schema.sql
```

Este archivo contiene la estructura de la tabla `empresas`.

### 3. Configurar el backend

Ingresar a la carpeta:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` utilizando `.env.example` como referencia:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestion_empresas
DB_USER=postgres
DB_PASSWORD=CONTRASENA_LOCAL
```

Reemplazar `CONTRASENA_LOCAL` por la contraseña configurada en PostgreSQL.

El archivo `.env` contiene información privada y no debe subirse al repositorio.

Iniciar el servidor:

```bash
npx nodemon src/app.js
```

La API estará disponible en:

```text
http://localhost:3000
```

Para verificar su funcionamiento:

```text
http://localhost:3000/api/health
```

Para comprobar la conexión con PostgreSQL:

```text
http://localhost:3000/api/test-db
```

### 4. Configurar el frontend

Abrir otra terminal e ingresar a:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install --legacy-peer-deps
```

Esta opción se utilizó durante el desarrollo para resolver un problema de instalación de dependencias con npm.

Iniciar Angular:

```bash
npx ng serve --open
```

La aplicación estará disponible en:

```text
http://localhost:4200
```

Es necesario mantener el backend y PostgreSQL ejecutándose para utilizar las funcionalidades de la aplicación.

## Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/empresas` | Obtener todas las empresas |
| GET | `/api/empresas/:id` | Obtener una empresa por ID |
| POST | `/api/empresas` | Registrar una empresa |
| PUT | `/api/empresas/:id` | Actualizar una empresa |
| DELETE | `/api/empresas/:id` | Eliminar una empresa |

### Ejemplo de registro

**POST `/api/empresas`**

```json
{
  "nombre_comercial": "Empresa Demo",
  "razon_social": "Empresa Demo S.A.",
  "telefono": "22334455",
  "correo_electronico": "demo@empresa.com",
  "nit": "1234567-9",
  "estado": "Activo",
  "direccion": "Ciudad de Guatemala"
}
```

### Ejemplo de respuesta exitosa

```json
{
  "success": true,
  "message": "Empresa registrada correctamente",
  "data": {
    "id": 1,
    "nombre_comercial": "Empresa Demo",
    "razon_social": "Empresa Demo S.A.",
    "telefono": "22334455",
    "correo_electronico": "demo@empresa.com",
    "nit": "1234567-9",
    "estado": "Activo",
    "direccion": "Ciudad de Guatemala"
  }
}
```

La respuesta real también incluye la fecha de creación.

## Validaciones

El sistema implementa validaciones en frontend y backend.

Se verifican los campos obligatorios, las longitudes permitidas, el formato del correo electrónico, el teléfono y el NIT.

Para el NIT guatemalteco tradicional se utiliza la verificación matemática del dígito verificador. Esta comprobación no garantiza que el NIT exista o esté activo ante la SAT.

Durante la edición, el correo electrónico se muestra como un campo no editable. El backend también impide su modificación.

## Manejo de errores

La API utiliza códigos HTTP según el resultado de cada operación:

| Código | Descripción |
|---|---|
| 200 | Operación exitosa |
| 201 | Registro creado |
| 400 | Datos inválidos |
| 404 | Recurso no encontrado |
| 409 | Registro duplicado |
| 500 | Error interno del servidor |

El frontend muestra mensajes de validación, confirmación y errores de comunicación.

## Decisiones técnicas

### Separación entre frontend y backend

Angular se encarga de la presentación y de las interacciones del usuario. Express gestiona las solicitudes HTTP, las validaciones del servidor y el acceso a la base de datos.

### PostgreSQL

Se seleccionó PostgreSQL por su soporte de datos relacionales, restricciones de integridad y capacidad para manejar múltiples conexiones.

### Servicios de Angular

Las operaciones HTTP están centralizadas en `EmpresaService`, evitando duplicar lógica de comunicación en los componentes.

### Reactive Forms

Los formularios utilizan Reactive Forms para administrar los datos, las validaciones y el estado de los controles.

### Signals

Se utilizan Signals para gestionar estados de la interfaz, como la carga de datos, los mensajes y el listado de empresas.

### Consultas parametrizadas

Las consultas SQL utilizan parámetros como `$1` y `$2` para separar los valores recibidos de las instrucciones SQL y reducir el riesgo de inyección SQL.

### Diseño

Se implementó una interfaz administrativa sencilla, adaptable y consistente, siguiendo los requerimientos funcionales y los diseños de referencia proporcionados.

## Estado del proyecto

- CRUD funcional en entorno local.
- Validaciones implementadas en frontend y backend.
- Persistencia mediante PostgreSQL.
- Despliegue público pendiente de configuración.

## Publicación

**Frontend:** pendiente de publicar en Firebase Hosting.

**Backend:** pendiente de publicar en un servicio compatible con Node.js.

**Base de datos:** pendiente de configurar en un servicio PostgreSQL administrado.

Los enlaces públicos se agregarán una vez completado el despliegue.

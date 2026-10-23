# Gestión de Empresas

Aplicación web para la administración de empresas mediante operaciones CRUD (Crear, Consultar, Actualizar y Eliminar).

El sistema cuenta con un frontend desarrollado en Angular, una API REST construida con Node.js y Express, y una base de datos PostgreSQL para almacenar la información de forma persistente.

## Tecnologías utilizadas

**Frontend**
- Angular 21 y TypeScript
- HTML5 y CSS3
- Angular Reactive Forms
- Angular Signals
- HttpClient y Angular Router

**Backend**
- Node.js y Express
- PostgreSQL
- node-postgres (`pg`)
- CORS y dotenv

**Despliegue**
- Firebase Hosting — Frontend
- Render — API REST
- Neon — PostgreSQL

## Funcionalidades

- Listado de empresas registradas.
- Registro de nuevas empresas.
- Consulta del detalle de una empresa.
- Edición de empresas, manteniendo el correo electrónico como campo no editable.
- Eliminación de empresas con confirmación.
- Validación de campos obligatorios, teléfono, correo electrónico y NIT guatemalteco.
- Control de registros duplicados.
- Mensajes de éxito y manejo de errores.
- Actualización del listado sin recargar la página.
- Filas alternadas en colores celeste y verde.
- Interfaz adaptable a diferentes tamaños de pantalla.

## Estructura del proyecto

```text
gestion-empresas/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── validators/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   ├── validators/
│   │   │   └── pages/
│   │   └── environments/
│   ├── angular.json
│   └── package.json
├── database/
│   └── schema.sql
├── .gitignore
└── README.md
```

## Instalación y ejecución local

### Requisitos previos

- Node.js compatible con Angular 21
- npm
- PostgreSQL
- Angular CLI

### 1. Clonar el repositorio

```bash
git clone https://github.com/Emadlgg/gestion-empresas.git
cd gestion-empresas
```

Reemplazar `https://github.com/Emadlgg/gestion-empresas.git` por el enlace correspondiente de GitHub.

### 2. Configurar PostgreSQL

Crear una base de datos llamada `gestion_empresas`.

Posteriormente, ejecutar el archivo `database/schema.sql` sobre esa base de datos para crear la tabla `empresas`.

La tabla contiene los campos solicitados para cada empresa, además de un identificador y una fecha de creación.

### 3. Configurar el backend

Ingresar a la carpeta:

```bash
cd backend
npm install
```

Crear un archivo `.env` tomando como referencia `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestion_empresas
DB_USER=postgres
DB_PASSWORD=TU_CONTRASENA
```

Reemplazar `TU_CONTRASENA` por la contraseña local de PostgreSQL.

Iniciar el servidor:

```bash
npm run dev
```

La API estará disponible en:

`http://localhost:3000`

Para comprobar su funcionamiento:

`http://localhost:3000/api/health`

### 4. Configurar el frontend

Abrir otra terminal y ejecutar, desde la raíz del repositorio:

```bash
cd frontend
npm install --legacy-peer-deps
npx ng serve --open
```

La aplicación estará disponible en:

`http://localhost:4200`

Para ejecutar el sistema localmente, PostgreSQL y el backend deben estar funcionando.

## Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/empresas` | Obtener todas las empresas |
| GET | `/api/empresas/:id` | Consultar una empresa |
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

La API devuelve respuestas JSON con el resultado de la operación y utiliza códigos HTTP como `200`, `201`, `400`, `404`, `409` y `500`, según corresponda.

## Validaciones y manejo de errores

Las validaciones se implementan tanto en Angular como en Express.

Se comprueban los campos obligatorios, los formatos permitidos, las longitudes máximas y el dígito verificador del NIT guatemalteco tradicional.

Durante la edición, el correo electrónico permanece bloqueado y el backend impide modificarlo.

PostgreSQL también aplica restricciones de integridad, como campos obligatorios y valores únicos para correo electrónico y NIT.

## Decisiones técnicas

**Separación de responsabilidades:** Angular gestiona la interfaz y las interacciones del usuario, mientras Express procesa las solicitudes HTTP, valida la información y realiza las operaciones sobre PostgreSQL.

**Servicios HTTP:** la comunicación con la API se centraliza en un servicio Angular para evitar duplicar código entre componentes.

**Reactive Forms y Signals:** se utilizan para controlar formularios, validaciones y estados de la interfaz.

**Consultas parametrizadas:** el backend utiliza parámetros SQL para evitar concatenar directamente los valores recibidos en las consultas y reducir el riesgo de inyección SQL.

**Persistencia:** PostgreSQL almacena la información de las empresas, permitiendo conservar los registros entre sesiones.

## Aplicación publicada

El sistema está desplegado en los siguientes servicios:

| Componente | Plataforma |
|---|---|
| Frontend | Firebase Hosting |
| Backend | Render |
| Base de datos | Neon PostgreSQL |

**Aplicación web:**

https://gestion-empresas-b28c3.web.app

**API REST:**

https://gestion-empresas-api-bv7h.onrender.com

**Listado de empresas (API):**

https://gestion-empresas-api-bv7h.onrender.com/api/empresas

La aplicación publicada utiliza la API alojada en Render, conectada a PostgreSQL en Neon.

*Nota:* el backend puede tardar unos segundos en responder a la primera solicitud después de un período de inactividad, dependiendo del estado del servicio de alojamiento.

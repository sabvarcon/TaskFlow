TaskFlow

Aplicación web full stack para la gestión de tareas personales. Permite registrar usuarios, iniciar sesión y administrar tareas mediante operaciones CRUD.

Tecnologías utilizadas

Backend: Node.js y Express.

Base de datos: MongoDB Atlas y Mongoose.

Autenticación: JSON Web Tokens (JWT).

Seguridad de contraseñas: bcryptjs.

Frontend: HTML, CSS y JavaScript.

Pruebas: Postman.

Funcionalidades

Registro de usuarios.

Inicio y cierre de sesión.

Autenticación mediante JWT.

Creación de tareas.

Consulta de tareas.

Edición de tareas.

Eliminación de tareas.

Marcado de tareas como completadas.

Protección de tareas por usuario.

Estructura del proyecto

TaskFlow/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
├── .gitignore
├── package.json
└── README.md

Requisitos

Node.js y npm.

Una cuenta y una base de datos en MongoDB Atlas.

Instalación

Clonar el repositorio:

git clone https://github.com/sabvarcon/TaskFlow.git

Entrar en la carpeta:

cd TaskFlow

Instalar dependencias:

npm install

Variables de entorno

Crear un archivo .env en la raíz del proyecto:

PORT=3000
MONGO_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
JWT_EXPIRES_IN=1d

Sustituir los valores de ejemplo por las credenciales propias. No publicar el archivo .env.

Ejecución

Para desarrollo:

npm run dev

Para iniciar el servidor:

npm start

Abrir en el navegador:

http://localhost:3000

API

Autenticación

Método

Ruta

Función

POST

/api/auth/register

Registrar usuario

POST

/api/auth/login

Iniciar sesión

Tareas

Las rutas de tareas requieren un token JWT en el encabezado Authorization: Bearer TOKEN.

Método

Ruta

Función

POST

/api/tasks

Crear tarea

GET

/api/tasks

Consultar tareas

GET

/api/tasks/:id

Consultar una tarea

PUT

/api/tasks/:id

Actualizar tarea

DELETE

/api/tasks/:id

Eliminar tarea

Autor
Sabine Vargas Contreras
Proyecto académico desarrollado como parte de un reto de desarrollo full stack.
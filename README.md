# API de Gestión de Perfumes

Esta es una API RESTful desarrollada con Node.js, Express y TypeScript para la gestión de un catálogo de perfumes. Incluye autenticación de usuarios, validación de datos, subida de imágenes y envío de correos electrónicos.

## Tecnologías Utilizadas

-   **Node.js** & **Express**: Framework principal del servidor.
-   **TypeScript**: Lenguaje de programación para un código más robusto y tipado.
-   **MongoDB** & **Mongoose**: Base de datos NoSQL y ODM.
-   **JWT (JSON Web Tokens)**: Para la autenticación segura de usuarios.
-   **Zod**: Para la validación de esquemas de datos (entradas de API).
-   **Multer**: Middleware para la gestión de subida de archivos (imágenes).
-   **Nodemailer / Resend**: Para el envío de correos electrónicos.
-   **Cors & Morgan**: Middlewares para seguridad y registro de peticiones (logging).

##  Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
-   [Node.js](https://nodejs.org/) (v20 o superior recomendado)
-   [npm](https://www.npmjs.com/)

##  Instalación y Configuración

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd api-proyecto-final
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno:**

    Crea un archivo `.env` en la raíz del proyecto basándote en el archivo `.env.example`. Define las siguientes variables:

    ```env
    PORT=3000
    JWT_SECRET=tu_secreto_super_seguro
    URI_DB=tu_string_de_conexion_a_mongodb
    EMAIL_USER=tu_email_para_enviar_correos
    EMAIL_PASS=tu_contraseña_de_aplicacion_o_api_key
    ```

##  Ejecución

### Modo Desarrollo
Para ejecutar el servidor en modo desarrollo con recarga automática (hot-reload):

```bash
npm run dev
```

### Modo Producción
Para compilar el código TypeScript a JavaScript y ejecutar la versión optimizada:

```bash
npm run build
npm start
```

##  Endpoints Principales

### Autenticación (`/auth`)
-   `POST /auth/register`: Registrar un nuevo usuario.
-   `POST /auth/login`: Iniciar sesión y obtener token JWT.

### Perfumes (`/perfumes`)
-   `GET /perfumes`: Obtener todos los perfumes (soporta filtros por query params).
-   `GET /perfumes/:id`: Obtener un perfume por ID.
-   `POST /perfumes`: Crear un nuevo perfume (requiere autenticación e imagen).
-   `PATCH /perfumes/:id`: Actualizar un perfume existente.
-   `DELETE /perfumes/:id`: Eliminar un perfume.

### Emails (`/email`)
-   `POST /email/send`: Enviar un correo electrónico (ej. bienvenida o notificaciones).

##  Despliegue

Este proyecto está configurado para ser desplegado fácilmente en plataformas como **Render**.

1.  Sube tu código a GitHub.
2.  Crea un nuevo **Web Service** en Render.
3.  Conecta tu repositorio.
4.  Render detectará automáticamente el comando de construcción (`npm run build`) y de inicio (`npm start`).
5.  **Importante:** No olvides configurar las variables de entorno en el panel de administración de Render.

> **Nota sobre subida de archivos:** En plataformas con sistema de archivos efímero (como Render o Vercel), las imágenes subidas localmente a la carpeta `uploads/` pueden desaparecer al reiniciarse el servidor. Para producción, se recomienda integrar un servicio de almacenamiento en la nube como Cloudinary o AWS S3.

## Autor

Desarrollado por Juan Franco Aranzabal.

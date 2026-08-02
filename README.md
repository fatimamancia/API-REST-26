API REST (Node.js + Express + Prisma ORM + JWT)

API REST desarrollada con **Node.js**, **Express**, **PostgreSQL** y **Prisma ORM**, con autenticación mediante **JWT** y validación de datos utilizando **Zod**.

## Características

* Autenticación con JWT.
* Validación de datos con Zod.
* Integración con PostgreSQL mediante Prisma ORM.
* Arquitectura modular.
* Gestión de dependencias con pnpm.

## Estructura del proyecto

API-REST/
├prisma/
  src/
    lib/
    middleware/
    routes/
    index.js
  .env
  package.json
  nodemon.json


## Instalación

bash
git clone <URL_DEL_REPOSITORIO>
cd API-REST
pnpm install
```

## Variables de entorno

env
PORT=5000
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/base_datos"
JWT_SECRET="tu_clave_secreta"
```

## Ejecutar el proyecto

bash
pnpm prisma migrate dev
pnpm dev
```

El servidor estará disponible en `http://localhost:5000`.

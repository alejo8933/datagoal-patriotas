# 🧩 Stack Tecnológico: DATA_GOAL

Este documento define la arquitectura técnica y el conjunto de tecnologías principales que se utilizarán para la construcción del proyecto.

## 💻 Frontend (Aplicación Cliente)
* **Framework Principal:** [Next.js](https://nextjs.org/) (React)
* **Lenguaje:** JavaScript / TypeScript
* **Propósito:** Construcción de las páginas web y componentes de interfaz para todos los actores del sistema (Jugador, Admin, Entrenador). Next.js se eligió por su excelente rendimiento, capacidades de enrutamiento basado en archivos y Server-Side Rendering (SSR).

## 🗄️ Backend / Base de Datos (BaaS)
* **Proveedor:** [Supabase](https://supabase.com/)
* **Motor de Base de Datos:** PostgreSQL
* **Propósito:** Autenticación de usuarios, almacenamiento seguro de la base de datos real del club, conexión en tiempo real y políticas de seguridad (Row Level Security).

## 🚀 Despliegue e Infraestructura (Hosting)
* **Proveedor Frontend:** [Vercel](https://vercel.com/)
* **Propósito:** Alojar nuestra aplicación Next.js. Vercel nos permitirá realizar despliegues automáticos (CI/CD) de manera nativa sin configuraciones complejas cada vez que integremos cambios a la rama `main` en GitHub.

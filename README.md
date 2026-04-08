#  DATA_GOAL


Sistema de Gestión Deportiva y Académica desarrollado con Next.js, PostgreSQL (Supabase) y desplegado en Vercel.

---

##  Tabla de Contenidos

- [Visión del Proyecto](#-visión-del-proyecto)
- [Arquitectura](#-arquitectura-del-sistema)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Fases de Desarrollo](#-fases-de-desarrollo)
- [Instalación Local](#-instalación-local)
- [Variables de Entorno](#-variables-de-entorno)
- [Planeación](#-planeación)
- [Próximos Pasos](#-próximos-pasos-roadmap)
- [Equipo](#-equipo)
- [Licencia](#-licencia)

---

##  Visión del Proyecto

**Data_Goal** es un sistema fullstack para la gestión integral de academias deportivas:

- 🏅 Gestión de equipos y jugadores
- 📅 Control de partidos y eventos
- 📊 Estadísticas deportivas
- 🏋️ Gestión de entrenamientos
- 👥 Roles: `admin`, `entrenador`, `jugador`, `coordinador`

---

## Arquitectura del Sistema

| Capa | Tecnología |
|------|-----------|
| Frontend + Backend | Next.js 15 (App Router + API Routes) |
| Base de datos | PostgreSQL en Supabase |
| Autenticación | Supabase Auth |
| Deploy | Vercel |

---

##  Módulos del Sistema

| # | Módulo | Historias |
|---|--------|-----------|
| 1 | **Autenticación** — Registro, Login, Roles, Validación de contraseña | US001, US002 |
| 2 | **Usuarios y Roles** — CRUD usuarios, asignar roles, activar/desactivar | US009 |
| 3 | **Equipos y Jugadores** — CRUD equipos/jugadores, validaciones | US003 |
| 4 | **Partidos** — Programar, editar, cancelar, validar horarios | US006 |
| 5 | **Eventos y Estadísticas** — Goles, tarjetas, asistencias, reportes | US004, US005 |
| 6 | **Entrenamientos** — Crear, control de asistencia, historial | US010 |
| 7 | **Notificaciones** — Cambios en partidos, entrenamientos, asignaciones | US007, US015, US016 |
| 8 | **Reportes y KPIs** — Gráficas, exportaciones, comparativas | US012-US014 |

---

##  Fases de Desarrollo

### Fase 1 — Análisis
**Objetivo:** Definir el alcance y comprender el problema.

Actividades:
- Identificación del problema
- Definición de usuarios del sistema
- Elaboración de requerimientos funcionales y no funcionales
- Revisión y preparación del modelo de base de datos en Supabase

Entregables:
- Documento de requerimientos
- Modelo de datos

---

### Fase 2 — Diseño
**Objetivo:** Definir la estructura del sistema.

Actividades:
- Diseño de arquitectura del sistema
- Configuración inicial de la base de datos en Supabase
- Definición de endpoints (API Routes en Next.js)
- Diseño de interfaces (mockups / Figma)

Tecnologías:
- **Frontend:** Next.js (App Router)
- **Backend:** Next.js (API Routes)
- **Base de datos:** PostgreSQL en Supabase

---

### Fase 3 — Desarrollo Backend
**Objetivo:** Implementar la lógica del sistema.

Actividades:
- Configuración de API Routes en Next.js
- Conexión a Supabase mediante credenciales seguras
- Implementación de autenticación con Supabase Auth
- Creación de rutas para: Usuarios, Equipos, Jugadores, Partidos, Entrenamientos, Estadísticas
- Implementación de seguridad y validaciones

Entregables:
- API funcional integrada en Next.js conectada a Supabase

---

### Fase 4 — Desarrollo Frontend
**Objetivo:** Construir la interfaz de usuario.

Actividades:
- Creación de vistas en Next.js
- Desarrollo de páginas: Login/Registro, Dashboard, Equipos, Partidos, Entrenamientos, Estadísticas
- Integración con API Routes
- Manejo de estado y sesión

Entregables:
- Interfaz web funcional

---

### Fase 5 — Integración
**Objetivo:** Unir frontend y backend.

Actividades:
- Conexión entre componentes y API Routes
- Integración completa con Supabase
- Pruebas de flujo completo: Registro, Login, Gestión de equipos, Registro de eventos y estadísticas
- Verificación de datos en Supabase

Entregables:
- Sistema integrado

---

### Fase 6 — Pruebas
**Objetivo:** Validar el funcionamiento del sistema.

Actividades:
- Pruebas funcionales
- Validación de datos
- Pruebas de autenticación
- Pruebas de conexión con Supabase
- Corrección de errores

Entregables:
- Sistema validado

---

### Fase 7 — Despliegue
**Objetivo:** Publicar el sistema en la web.

| Componente | Plataforma |
|-----------|-----------|
| Aplicación web | Vercel |
| Base de datos | Supabase |

Actividades:
- Configuración de variables de entorno (`.env`)
- Despliegue del proyecto en Vercel
- Conexión con Supabase en producción
- Pruebas finales en ambiente real

Entregables:
- Sistema en producción ✅

---

##  Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/data_goal.git
cd data_goal

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Supabase

# 4. Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

##  Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables
(ver [`Configuracion/.env.example`](./Configuracion/.env.example)):

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

> ⚠️ Nunca subas el archivo `.env.local` al repositorio. Está incluido en `.gitignore`.

---

## 📂 Planeación

Estructura de la carpeta `/Planeacion`:

| Carpeta | Contenido |
|---------|-----------|
| [`/Historias de usuario`](./Planeacion/Historias%20de%20usuario/) | Requerimientos funcionales ágiles por rol |
| [`/Requerimientos no funcionales`](./Planeacion/Requerimientos%20no%20funcionales/) | Seguridad, rendimiento, disponibilidad |
| [`/CasoDeUsoExtendido`](./Planeacion/CasoDeUsoExtendido/) | Flujos principales y alternativos por funcionalidad |
| [`/ScripsDB`](./Planeacion/ScripsDB/) | Scripts SQL y mapeo para Supabase (PostgreSQL) |
| [`/Presentacion`](./Planeacion/Presentacion/) | Diapositivas de sustentación del proyecto |
| [`/Github`](./Planeacion/Github/) | Estrategia de ramas, convenciones de commits y PRs |
| [`/Diseño_UI`](./Planeacion/Diseño_UI/) | Wireframes y prototipos en Figma |
| [`/Arquitectura`](./Planeacion/Arquitectura/) | Stack tecnológico y decisiones de diseño |
| [`/Gestion_Proyecto`](./Planeacion/Gestion_Proyecto/) | Metodología ágil y tablero de seguimiento |
| [`/Configuracion`](./Planeacion/Configuracion/) | Variables de entorno y configuración inicial |

---


## 👥 Equipo

| Nombre | Rol |
|--------|-----|
| [Integrante 1](https://github.com/usuario1) | Fullstack / Auth & Usuarios |
| [Integrante 2](https://github.com/usuario2) | Fullstack / Equipos & Partidos |
| [Integrante 3](https://github.com/usuario3) | Fullstack / Estadísticas & Reportes |




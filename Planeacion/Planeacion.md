# Planeación del Proyecto: DATA_GOAL

Este documento describe la estructura y el contenido de la fase de planeación del proyecto **DATA_GOAL** (Sistema de Gestión Deportiva y Académica), organizado en la carpeta `Planeacion`. 

## 📂 Índice de Carpetas y Entregables

A continuación se detalla el propósito de cada subcarpeta dentro de la fase de planeación y los documentos que la componen:

### 1. 📖 Historias de Usuario (`/Historias de usuario`)
Contiene la definición funcional del sistema desde la perspectiva del usuario final.
* **Archivo principal:** `Historias_usuario_Grupo4[2] (1) (1) (1).docx`
* **Propósito:** Describir los requerimientos funcionales ágiles, identificando roles (Administrador, Entrenador, Jugador, Coordinador, etc.), las acciones que necesitan realizar y el valor que aportan al proceso.

### 2. ⚙️ Requerimientos No Funcionales (`/Requerimientos no funcionales`)
Define los atributos de calidad, restricciones y condiciones técnicas bajo las cuales debe operar el sistema web/móvil.
* **Archivo principal:** [Requerimientos_NO_funcionales.docx](cci:7://file:///c:/Users/APRENDIZ/data_goal/Planeacion/Requerimientos%20no%20funcionales/Requerimientos_NO_funcionales.docx:0:0-0:0)
* **Propósito:** Especificar aspectos de seguridad (encriptación de contraseñas, roles de usuario), rendimiento, disponibilidad, usabilidad y tecnologías a utilizar.

### 3. 🧩 Casos de Uso Extendidos (`/CasoDeUsoExtendido`)
Documentación detallada sobre la interacción entre el usuario y el sistema para procesos específicos.
* **Archivo principal:** `Fromato de caso de uso extendido.pdf`
* **Propósito:** Modelar paso a paso los flujos principales (camino feliz y flujos alternativos/excepciones) de cada funcionalidad crítica (ej. registro de asistencia, gestión de mensualidades, asignación de equipos y categorías).

### 4. 🗄️ Scripts de Base de Datos (`/ScripsDB`)
Almacena la estructura fundamental y scripts de configuración inicial para la persistencia de datos. Se evidencia la arquitectura y soporte hacia proveedor de Backend-as-a-Service (**Supabase**).
* **[DATA_GOAL1.sql](cci:7://file:///c:/Users/APRENDIZ/data_goal/Planeacion/ScripsDB/DATA_GOAL1.sql:0:0-0:0):** Script unificado que contiene 7 esquemas principales, tablas, relaciones (Foreign Keys), restricciones de integridad (Checks) y la inserción de datos sintéticos o iniciales para pruebas.
* **[Supabase.txt](cci:7://file:///c:/Users/APRENDIZ/data_goal/Planeacion/ScripsDB/Supabase.txt:0:0-0:0):** Mapeo de columnas, tipos de datos y relaciones de esquemas adaptados para PostgreSQL en Supabase. Incluye información de extensiones de monitoreo nativas como `pg_stat_statements`, empleadas para el perfilamiento y optimización de las consultas.

### 5. 📊 Presentación (`/Presentacion`)
Material de apoyo visual o diapositivas para la sustentación de la fase de planeación y revisión de avances.
* **Archivo principal:** `Presentacion Trimestre 2.pptx`
* **Propósito:** Resumir el estado actual, la definición del problema de la academia deportiva, los objetivos alcanzados en el segundo trimestre y la arquitectura planificada del proyecto para mostrar a instructores o *stakeholders*.

### 6. 🐙 Gestión de Versiones (`/Github`)
Documentación sobre la estrategia de control de versiones y el flujo de trabajo del equipo.
* **Archivo principal:** `Estrategia_Repositorio.md`
* **Propósito:** Contener el enlace oficial al repositorio de GitHub, definir la estrategia de ramas (Branching flow), estandarizar las convenciones de commits y establecer las reglas para la integración de código (Pull Requests).

---

### 7. 🎨 Interfaz de Usuario (`/Diseño_UI`)
Documentación de los wireframes, interfaz y diseño del sistema.
* **Archivo principal:** `Prototipo_Figma.md`

### 8. 🧩 Arquitectura (`/Arquitectura`)
Decisiones de diseño técnico y stack de tecnologías del proyecto.
* **Archivo principal:** `Stack_Tecnologico.md`

### 9. 📋 Gestión Ágil (`/Gestion_Proyecto`)
Metodología de trabajo en equipo y seguimiento de los requerimientos.
* **Archivo principal:** `Metodologia_Tablero.md`

### 10. ⚙️ Configuración (`/Configuracion`)
Variables de entorno y secretos necesarios para ejecutar el proyecto en la fase de desarrollo.
* **Archivo principal:** `.env.example`

---

## 🚀 Próximos Pasos (ROADMAP)
1. **Validación de la Base de Datos (Supabase):** Asegurar que las tablas de [DATA_GOAL1.sql](cci:7://file:///c:/Users/APRENDIZ/data_goal/Planeacion/ScripsDB/DATA_GOAL1.sql:0:0-0:0) y el diccionario de relaciones de [Supabase.txt](cci:7://file:///c:/Users/APRENDIZ/data_goal/Planeacion/ScripsDB/Supabase.txt:0:0-0:0) se migren y compilen sin problemas en el proyecto de desarrollo de Supabase.
2. **Población de Datos en Desarrollo:** Poblar el modelo relacional físico en la nube con los registros semilla (seeds) para empezar a desarrollar la capa Backend/Frontend.
3. **Inicio de Fase de Ejecución:** Comenzar las labores de diseño UX/UI y el maquetado del sistema alineándose estrictamente con lo estipulado en las Historias de Usuario y los Requerimientos NO funcionales.



Data_Goal
VISIÓN DEL PROYECTO 

Data_Goal es un sistema para:
Gestión de equipos y jugadores
Control de partidos y eventos
Estadísticas deportivas
Gestión de entrenamientos
Roles: admin, entrenador, jugador

ARQUITECTURA DEL SISTEMA

Frontend + Backend (FULLSTACK)
Next.js (App Router)
Base de datos
PostgreSQL en Supabase
Deploy
Frontend → Vercel

MÓDULOS DEL SISTEMA (según tus historias)
 1. AUTENTICACIÓN (US001 - US002)
Registro
Login
Validación de contraseña
Roles
 2. USUARIOS Y ROLES (US009)
Crear usuarios
Asignar roles
Activar/desactivar cuentas
 3. EQUIPOS Y JUGADORES (US003)
CRUD equipos
CRUD jugadores
Validaciones (edad, duplicados)
 4. PARTIDOS (US006)
Programar partidos
Editar
Cancelar
Validar horarios
 5. EVENTOS Y ESTADÍSTICAS (US004 - US005)
Goles
Tarjetas
Asistencias
Reportes
 6. ENTRENAMIENTOS (US010)
Crear entrenamientos
Control de asistencia
Historial
7. NOTIFICACIONES (US007, US015, US016)
Cambios en partidos
Entrenamientos
Asignaciones
 8. REPORTES Y KPIs (US012 - US014)
Gráficas
Exportaciones
Comparativas



FASE 1: ANÁLISIS
Objetivo: Definir el alcance y comprender el problema.
Actividades:
 • Identificación del problema
 • Definición de usuarios del sistema
 • Elaboración de requerimientos funcionales y no funcionales
 • Revisión del modelo de base de datos
 • Preparación de la base de datos en Supabase
Entregables:
 • Documento de requerimientos
 • Modelo de datos





FASE 2: DISEÑO
Objetivo: Definir la estructura del sistema.
Actividades:
 • Diseño de arquitectura del sistema
 • Configuración inicial de la base de datos en Supabase
 • Definición de endpoints (API Routes en Next.js)
 • Diseño de interfaces (mockups)
Tecnologías:
 • Frontend: Next.js (App Router)
 • Backend: Next.js (API Routes)
 • Base de datos: PostgreSQL en Supabase




FASE 3: DESARROLLO BACKEND
Objetivo: Implementar la lógica del sistema.
Actividades:
 • Configuración de API Routes en Next.js
 • Conexión a la base de datos de Supabase mediante credenciales
 • Implementación de autenticación con Supabase Auth
 • Creación de rutas (API Routes):
Usuarios
Equipos
Jugadores
Partidos
Entrenamientos
Estadísticas
 • Implementación de seguridad y validaciones
Entregables:
 • API funcional integrada en Next.js conectada a Supabase





FASE 4: DESARROLLO FRONTEND
Objetivo: Construir la interfaz de usuario.
Actividades:
 • Creación de vistas en Next.js
 • Desarrollo de páginas:
Login / Registro
Dashboard
Equipos
Partidos
Entrenamientos
Estadísticas
 • Integración con API Routes
 • Manejo de estado y sesión
Entregables:
 • Interfaz web funcional





FASE 5: INTEGRACIÓN
Objetivo: Unir frontend y backend.
Actividades:
 • Conexión entre componentes y API Routes
 • Integración con Supabase
 • Pruebas de flujo completo:
Registro
Inicio de sesión
Gestión de equipos
Registro de eventos y estadísticas
 • Verificación de datos en Supabase
Entregables:
 • Sistema integrado






FASE 6: PRUEBAS
Objetivo: Validar el funcionamiento del sistema.
Actividades:
 • Pruebas funcionales
 • Validación de datos
 • Pruebas de autenticación
 • Pruebas de conexión con Supabase
 • Corrección de errores
Entregables:
 • Sistema validado





FASE 7: DESPLIEGUE
Objetivo: Publicar el sistema en la web.
Opciones:
 • Aplicación web: Vercel
 • Base de datos: Supabase
Actividades:
 • Configuración de variables de entorno (.env)
 • Despliegue del proyecto en Vercel
 • Conexión con Supabase en producción
 • Pruebas finales
Entregables:
 • Sistema en producción


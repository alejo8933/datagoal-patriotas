# 🐙 Estrategia de Control de Versiones: DATA_GOAL

Este documento define cómo trabajará el equipo con GitHub y Git para el proyecto **DATA_GOAL**.

## 🔗 Enlace al Repositorio
* **URL:** `https://github.com/alejo8933/DataGoal-Cantera-Patriotas-Sport-Bacata`

## 🌿 Estrategia de Ramas (Branching Flow)
Utilizaremos un flujo basado en ramas para mantener el código organizado:
- `main`: Contiene el código completamente estable y listo para producción.
- `dev` (o `develop`): Rama de desarrollo principal. Todo el trabajo nuevo de los integrantes se integra aquí primero.
- `feature/[nombre-tarea]`: Ramas individuales creadas a partir de `dev` para agregar nuevas funcionalidades (ej. `feature/login`, `feature/registro-asistencia`).
- `fix/[nombre-error]`: Ramas para corrección de bugs o errores urgentes.

## 📝 Convenciones de Commits
Para mantener un historial de proyecto claro, los mensajes de los commits deben iniciar con un prefijo que indique el tipo de cambio:
* `feat:` Implementación de una funcionalidad nueva. (Ej. `feat: agregar formulario de pagos`)
* `fix:` Corrección de un error. (Ej. `fix: corregir cálculo de edad por categoría`)
* `docs:` Cambios específicos en documentación.
* `style:` Cambios visuales o de diseño (UI/UX, CSS).
* `refactor:` Reestructuración de código sin alterar su comportamiento externo.

## 🔁 Proceso de Integración (Pull Requests)
1. **Regla de oro:** Prohibido hacer *commit* directo a la rama `main` o `dev`.
2. Al terminar una tarea en tu rama `feature/`, debes subir tus cambios y crear un **Pull Request (PR)** apuntando hacia la rama `dev`.
3. Al menos 1 miembro diferente del equipo debe revisar brevemente el código antes de aprobar y realizar el *Merge*.

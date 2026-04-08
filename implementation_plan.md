# Implementación de Roles y Módulos Seguros

Este plan detalla los pasos para reestructurar y asegurar las rutas del proyecto según los roles de usuario (`admin`, `entrenador`, `jugador`). El objetivo principal es asegurar que el inicio de sesión redirija a cada rol a su módulo correspondiente y prohibir estrictamente que un rol acceda al módulo de otro.

## User Review Required

> [!WARNING]
> Crear nuevos directorios de rutas modificará la estructura de tu proyecto. Específicamente, moveremos las responsabilidades de "home del usuario autenticado" a direcciones bajo `/dashboard/[rol]`. ¿Estás de acuerdo con crear esta estructura en `src/app/dashboard/`?
>
> También, ten en cuenta que asumo que tu base de datos de Supabase ya tiene un "Trigger" que inserta una fila en la tabla `perfiles` cuando un usuario se registra. Si no lo has implementado en Supabase todavía, dímelo y te ayudaré con el script SQL de registro.

## Proposed Changes

---

### Enrutamiento y Módulos Protegidos (Layouts)

Actualmente, las rutas `/dashboard/admin`, `/dashboard/entrenador`, y `/dashboard/jugador` no existen, aunque `useAuth.ts` intenta redirigir a ellas. Vamos a crear esta estructura. Utilizaremos **Server Components** en los `layout.tsx` para interceptar a usuarios con el rol equivocado antes de que la página renderice.

#### [NEW] `src/app/dashboard/layout.tsx`
Un Layout general para el dashboard que obtendrá la sesión del usuario para evitar llamadas duplicadas innecesarias y proporcionará el marco visual (por ejemplo, el Sidebar o Navbar del panel de control).

#### [NEW] `src/app/dashboard/admin/layout.tsx`
#### [NEW] `src/app/dashboard/admin/page.tsx`
Protegeremos este módulo obteniendo el perfil (`perfiles.rol`) en el lado del servidor. Si el rol no es `admin`, se redireccionará mediante `redirect('/dashboard/' + rol_real)`. La página mostrará el inicio del administrador.

#### [NEW] `src/app/dashboard/entrenador/layout.tsx`
#### [NEW] `src/app/dashboard/entrenador/page.tsx`
Protegeremos este módulo verificando que el rol sea `entrenador`.

#### [NEW] `src/app/dashboard/jugador/layout.tsx`
#### [NEW] `src/app/dashboard/jugador/page.tsx`
Protegeremos este módulo verificando que el rol sea `jugador`.

---

### Mejoras de Seguridad en Middleware

#### [MODIFY] `middleware.ts`
El middleware actual solo evita que usuarios no autenticados entren a `/dashboard`. Lo mejoraremos para que sea inteligente: si alguien entra a `/dashboard` a secas, pero está logueado, lo redireccionaremos automáticamente al dashboard correcto según su rol, leyendo la base de datos o decodificando de inmediato. Como acceder a la BD en el Edge Runtime de Next.js (middleware) a veces es limitante con paquetes completos, mantendremos la protección base en el middleware y la protección estricta delegada de los Layouts.

---

### Lógica de Autenticación y APIs

#### [MODIFY] `src/hooks/useAuth.ts`
El sistema actual es funcional, pero podemos añadir manejo de errores mejorados al iniciar sesión y redirigir correctamente. Me aseguraré de que la recarga de las rutas post-login (`router.refresh()`) ocurra limpiamente garantizando que los Server Components lean la nueva cookie Auth antes de redirigir a `/dashboard/[rol]`.

#### [MODIFY] `src/app/(auth)/login/LoginForm.tsx`
Pequeñas validaciones visuales (por ejemplo, evitar clicks múltiples y mejorar el estado visual de carga) si es necesario.

#### [MODIFY] `src/app/(auth)/registro/RegisterForm.tsx` y `src/types/domain/auth.schema.ts`
**Refactorización de Roles**: Tienes toda la razón. El formulario actual obliga a ingresar "Categoría" y "Posición" (Portero, Delantero, etc.), lo cual es exclusivo de un **Candidato a Jugador**. 
Lo modificaremos para que sea **dinámico**:
1. El usuario seleccionará al principio el rol a solicitar (`Candidato a Jugador` o `Candidato a Entrenador`). Los administradores normalmente se crean por invitación interna, así que lo ocultaremos del registro público por seguridad (o lo dejamos dependiendo de tu decisión).
2. Si elige **Jugador**, mostrará los campos de `Posición` y `Categoría`.
3. Si elige **Entrenador**, ocultaremos la `Posición` y opcionalmente pediremos `Especialidad` o simplemente los datos personales base.
4. Ajustaremos los esquemas de validación Zod (`auth.schema.ts`) para que los campos deportivos sean opcionales basados en el rol.

## Open Questions

> [!IMPORTANT]
> 1. **Base de Datos (Trigger)**: Cuando un usuario se registra (`authService.ts` llama a `supabase.auth.signUp`), ¿ya tienes el "trigger" configurado en Supabase que toma a ese usuario y lo inserta mágicamente a la tabla `perfiles` con rol tipo `jugador` o debo ayudarte creando ese código SQL para que lo corras en la consola de Supabase?
> 2. **Roles de Rutas Adicionales**: Tienes carpetas como `src/app/entrenamientos`, `src/app/equipos`, etc. ¿Te gustaría que estas características fuesen movidas adentro del `/dashboard/` de cada rol, o son rutas de la "página pública"?

## Verification Plan

### Manual Verification
1. Ingresaremos el usuario de en el formulario de login. Si es administrador, nos aseguraremos de que nos dirija a `/dashboard/admin`.
2. Siendo `admin`, intentaremos escribir en la URL `/dashboard/jugador` para confirmar que nos bloquea y nos retorna forzosamente a `/dashboard/admin`.
3. Validaremos la funcionalidad de Registro e inicio de sesión desde la Interfaz gráfica para certificar que el proceso ocurre sin errores.

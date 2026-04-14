import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          // Actualizamos request cookies (para componentes que lean en el mismo ciclo)
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          // Actualizamos la respuesta base (si hacemos next)
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  console.log('[middleware] pathname:', request.nextUrl.pathname, '| user:', user ? user.id : 'null', '| authError:', authError)
  const { pathname } = request.nextUrl

  // Función de ayuda para redirigir copiando las cookies que Supabase pudo haber refrescado
  const redirectWithCookies = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url)
    // Copiar cualquier cookie que se haya seteado en `response` a `redirectResponse`
    response.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // ── Sin sesión → login ────────────────────────────────────────
  if (pathname.startsWith('/dashboard') && !user) {
    return redirectWithCookies(new URL('/login', request.url))
  }

  // Cliente Admin para leer perfiles saltándose RLS
  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  // ── Con sesión → no dejar entrar a login/registro ─────────────
  if ((pathname === '/login' || pathname === '/registro') && user) {
    // Redirigir según rol
    const { data: perfil } = await supabaseAdmin
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single()

    const destinos: Record<string, string> = {
      admin:        '/dashboard/admin',
      entrenador:   '/dashboard/entrenador',
      jugador:      '/dashboard/jugador',
    }

    const destino = destinos[perfil?.rol ?? ''] ?? '/dashboard'
    return redirectWithCookies(new URL(destino, request.url))
  }

  // ── Verificación de rol por ruta ──────────────────────────────
  const rutasProtegidas = [
    '/dashboard/admin',
    '/dashboard/entrenador',
    '/dashboard/jugador',
  ]

  const rutaProtegida = rutasProtegidas.find(r => pathname.startsWith(r))

  if (user && rutaProtegida) {
    const { data: perfil } = await supabaseAdmin
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single()

    const rol = perfil?.rol

    const rolesPermitidos: Record<string, string> = {
      '/dashboard/admin':      'admin',
      '/dashboard/entrenador': 'entrenador',
      '/dashboard/jugador':    'jugador',
    }

    if (rol !== rolesPermitidos[rutaProtegida]) {
      return redirectWithCookies(new URL('/no-autorizado', request.url))
    }
  }

  // ── Redirigir /dashboard genérico según rol ───────────────────
  if (pathname === '/dashboard' && user) {
    const { data: perfil } = await supabaseAdmin
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single()

    const destinos: Record<string, string> = {
      admin:      '/dashboard/admin',
      entrenador: '/dashboard/entrenador',
      jugador:    '/dashboard/jugador',
    }

    const destino = destinos[perfil?.rol ?? ''] ?? '/'
    return redirectWithCookies(new URL(destino, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
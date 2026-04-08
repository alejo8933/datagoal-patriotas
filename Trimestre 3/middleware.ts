import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // ── Sin sesión → login ────────────────────────────────────────
  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ── Con sesión → no dejar entrar a login/registro ─────────────
  if ((pathname === '/login' || pathname === '/registro') && user) {
    // Redirigir según rol
    const { data: perfil } = await supabase
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
    return NextResponse.redirect(new URL(destino, request.url))
  }

  // ── Verificación de rol por ruta ──────────────────────────────
  const rutasProtegidas = [
    '/dashboard/admin',
    '/dashboard/entrenador',
    '/dashboard/jugador',
  ]

  const rutaProtegida = rutasProtegidas.find(r => pathname.startsWith(r))

  if (user && rutaProtegida) {
    const { data: perfil } = await supabase
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
      return NextResponse.redirect(new URL('/no-autorizado', request.url))
    }
  }

  // ── Redirigir /dashboard genérico según rol ───────────────────
  if (pathname === '/dashboard' && user) {
    const { data: perfil } = await supabase
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
    return NextResponse.redirect(new URL(destino, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EntrenamientosPanel from '@/components/entrenador/EntrenamientosPanel'
import { getEntrenamientosDashboard, getJugadoresRegistrados } from '@/lib/entrenador/entrenamientos'

export default async function EntrenamientosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { entrenamientos, asistencias } = await getEntrenamientosDashboard();
  const totalJugadores = await getJugadoresRegistrados();

  return (
    <EntrenamientosPanel 
       entrenamientos={entrenamientos} 
       asistencias={asistencias} 
       totalJugadores={totalJugadores} 
    />
  )
}

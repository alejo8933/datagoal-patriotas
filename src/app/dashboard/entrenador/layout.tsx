import HeaderEntrenador from '@/components/layout/HeaderEntrenador'

export default function EntrenadorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderEntrenador />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {children}
      </main>
    </div>
  )
}
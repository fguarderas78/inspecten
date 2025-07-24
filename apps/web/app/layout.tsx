import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'INSPECTEN',
  description: 'Sistema de inspección de propiedades',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
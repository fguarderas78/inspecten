import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'INSPECTEN - Sistema de Gestión de Inspecciones',
  description: 'Plataforma profesional para gestión de inspecciones de propiedades',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ 
        margin: 0, 
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale'
      }}>
        {children}
      </body>
    </html>
  )
}
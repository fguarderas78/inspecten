import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'INSPECTEN - Sistema de Inspecciones',
  description: 'Plataforma profesional para gestión de inspecciones de propiedades',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              font-size: 14px;
              line-height: 1.5;
              color: #111827;
              background-color: #f3f4f6;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }

            h1, h2, h3, h4, h5, h6 {
              margin: 0;
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: #111827;
            }

            p {
              margin: 0;
            }

            a {
              color: #dc2626;
              text-decoration: none;
              transition: 150ms ease-in-out;
            }

            a:hover {
              color: #b91c1c;
            }

            /* Scrollbar personalizada */
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }

            ::-webkit-scrollbar-track {
              background: #f3f4f6;
            }

            ::-webkit-scrollbar-thumb {
              background: #d1d5db;
              border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }

            /* Animaciones */
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes slideIn {
              from {
                transform: translateX(-100%);
              }
              to {
                transform: translateX(0);
              }
            }

            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }

            /* Utilidades */
            .fade-in {
              animation: fadeIn 0.3s ease-out;
            }

            .slide-in {
              animation: slideIn 0.3s ease-out;
            }

            /* Focus visible */
            :focus-visible {
              outline: 2px solid #dc2626;
              outline-offset: 2px;
            }

            /* Selección de texto */
            ::selection {
              background-color: #dc2626;
              color: white;
            }

            /* Reset de botones */
            button {
              font-family: inherit;
            }

            /* Reset de inputs */
            input, select, textarea {
              font-family: inherit;
            }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
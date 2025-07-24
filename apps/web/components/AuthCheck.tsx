'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar si hay un usuario o token de Google en localStorage
    const user = localStorage.getItem('user')
    const googleToken = localStorage.getItem('google_token')
    
    if (pathname.startsWith('/dashboard')) {
      // Si está en dashboard y no hay usuario ni token, redirigir a login
      if (!user && !googleToken) {
        router.push('/')
      } else {
        setIsAuthenticated(true)
      }
    } else if (pathname === '/') {
      // Si está en login y hay usuario o token, redirigir a dashboard
      if (user || googleToken) {
        router.push('/dashboard')
      }
    }
    
    setIsLoading(false)
  }, [pathname, router])

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6'
      }}>
        <div>Cargando...</div>
      </div>
    )
  }

  // Si está en una ruta protegida y no está autenticado, no mostrar nada
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
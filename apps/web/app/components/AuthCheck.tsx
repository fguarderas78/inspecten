'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const user = localStorage.getItem('user')
    
    if (pathname.startsWith('/dashboard')) {
      if (!user) {
        router.push('/')
      } else {
        setIsAuthenticated(true)
      }
    } else if (pathname === '/') {
      if (user) {
        router.push('/dashboard')
      }
    }
    
    setIsLoading(false)
  }, [pathname, router])

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

  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    return null
  }

  return <>{children}</>
}
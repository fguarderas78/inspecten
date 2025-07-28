'use client'

import { useState, useEffect } from 'react'

export default function GoogleAuthButton() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/google')
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
      
      // Obtener email del usuario de las cookies
      const email = document.cookie
        .split('; ')
        .find(row => row.startsWith('user_email='))
        ?.split('=')[1]
      
      if (email) {
        setUserEmail(decodeURIComponent(email))
      }
    } catch (error) {
      console.error('Error checking auth:', error)
      setIsAuthenticated(false)
    }
  }

  const handleLogin = () => {
    window.location.href = '/api/auth/google?action=login'
  }

  const handleLogout = async () => {
    // Limpiar cookies
    document.cookie = 'google_refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'google_access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    
    setIsAuthenticated(false)
    setUserEmail('')
    
    // Recargar para actualizar el estado
    window.location.reload()
  }

  if (isAuthenticated === null) {
    return (
      <div style={{
        padding: '10px 20px',
        backgroundColor: '#f3f4f6',
        borderRadius: '6px',
        fontSize: '14px'
      }}>
        Verificando autenticación...
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px',
        backgroundColor: '#f3f4f6',
        borderRadius: '6px',
        fontSize: '14px'
      }}>
        <span style={{ color: '#10b981' }}>✓</span>
        <span>Conectado como: {userEmail}</span>
        <button
          onClick={handleLogout}
          style={{
            padding: '4px 8px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Desconectar
        </button>
      </div>
    )
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#fee2e2',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <p style={{ marginBottom: '10px', color: '#991b1b' }}>
        Para usar Google Drive, necesitas autenticarte
      </p>
      <button
        onClick={handleLogin}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285f4',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20454Z" fill="white"/>
          <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="white"/>
          <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="white"/>
          <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="white"/>
        </svg>
        Conectar con Google
      </button>
    </div>
  )
}
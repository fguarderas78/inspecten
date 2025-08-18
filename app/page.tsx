'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Validaciones básicas
    if (!email || !password) {
      setError('Por favor complete todos los campos')
      setIsLoading(false)
      return
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Por favor ingrese un correo válido')
      setIsLoading(false)
      return
    }

    // Credenciales temporales para desarrollo
    // TODO: Reemplazar con autenticación real del backend
    const validCredentials = [
      { email: 'admin@inspecten.com', password: 'admin123', role: 'Admin' },
      { email: 'francisco@inspecten.com', password: 'inspecten123', role: 'Admin' },
      { email: 'inspector@inspecten.com', password: 'inspector123', role: 'Inspector' }
    ]

    // Simular delay de red
    setTimeout(() => {
      const user = validCredentials.find(
        cred => cred.email.toLowerCase() === email.toLowerCase() && cred.password === password
      )

      if (user) {
        // Guardar sesión
        sessionStorage.setItem('userEmail', user.email)
        sessionStorage.setItem('userRole', user.role)
        sessionStorage.setItem('isAuthenticated', 'true')
        
        // Si "recordarme" está marcado, guardar en localStorage
        if (rememberMe) {
          localStorage.setItem('savedEmail', user.email)
        } else {
          localStorage.removeItem('savedEmail')
        }

        router.push('/dashboard')
      } else {
        setError('Credenciales incorrectas. Por favor, intente nuevamente.')
        setIsLoading(false)
      }
    }, 1000)
  }

  // Cargar email guardado si existe (pero no autocompletar)
  useState(() => {
    const savedEmail = localStorage.getItem('savedEmail')
    if (savedEmail && rememberMe) {
      setEmail(savedEmail)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '420px'
      }}>
        {/* Logo y Título */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#dc2626',
            marginBottom: '8px'
          }}>
            INSPECTEN
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '14px'
          }}>
            Sistema de Gestión de Inspecciones
          </p>
        </div>

        {/* Mensaje de credenciales de prueba (solo desarrollo) */}
        <div style={{
          backgroundColor: '#dbeafe',
          border: '1px solid #3b82f6',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '13px'
        }}>
          <strong>Credenciales de prueba:</strong><br/>
          • admin@inspecten.com / admin123<br/>
          • francisco@inspecten.com / inspecten123<br/>
          • inspector@inspecten.com / inspector123
        </div>

        {/* Formulario */}
        <form onSubmit={handleLogin} autoComplete="off">
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              autoComplete="off"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s',
                ...(error && { borderColor: '#ef4444' })
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#dc2626'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? '#ef4444' : '#d1d5db'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="new-password"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  paddingRight: '40px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  ...(error && { borderColor: '#ef4444' })
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#dc2626'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = error ? '#ef4444' : '#d1d5db'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  fontSize: '20px',
                  padding: '4px'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Recordarme */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#374151'
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  marginRight: '8px',
                  cursor: 'pointer'
                }}
              />
              Recordarme
            </label>
            <a
              href="#"
              style={{
                fontSize: '14px',
                color: '#dc2626',
                textDecoration: 'none'
              }}
              onClick={(e) => {
                e.preventDefault()
                alert('Función de recuperación de contraseña no implementada')
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #f87171',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#991b1b'
            }}>
              {error}
            </div>
          )}

          {/* Botón de login */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#9ca3af' : '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#b91c1c'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#dc2626'
              }
            }}
          >
            {isLoading ? (
              <>
                <span style={{
                  display: 'inline-block',
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Ingresando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          paddingTop: '20px',
          borderTop: '1px solid #e5e7eb',
          textAlign: 'center',
          fontSize: '12px',
          color: '#9ca3af'
        }}>
          © 2024 INSPECTEN. Todos los derechos reservados.
        </div>
      </div>

      {/* Estilos para animación */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
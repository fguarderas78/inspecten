'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {    
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),       
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al iniciar sesión')
        return
      }

      // Guardar usuario en localStorage (temporal)      
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirigir al dashboard
      router.push('/dashboard')
    } catch (error) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#A8252E',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Logo Background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1,
        opacity: 0.1
      }}>
        <svg width="600" height="400" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">       
          <path d="M150 150 L250 100 L350 150 L350 250 L250 300 L150 250 Z" stroke="white" strokeWidth="8" fill="none"/>
          <path d="M100 280 Q150 320 200 280 T300 280" stroke="white" strokeWidth="8" fill="none"/>
          <circle cx="420" cy="280" r="60" stroke="#6B7280" strokeWidth="8" fill="none"/>
          <path d="M400 280 L440 320" stroke="#6B7280" strokeWidth="8"/>
          <path d="M440 260 L400 300" stroke="#6B7280" strokeWidth="8"/>
        </svg>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',     
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ marginBottom: '20px' }}>
            <svg width="280" height="140" viewBox="0 0 280 140" fill="none" xmlns="http://www.w3.org/2000/svg">   
              {/* Casa con líneas */}
              <g transform="translate(60, 20)">
                {/* Techo */}
                <path d="M40 0 L0 25 L0 30 L5 30 L5 28 L40 5 L75 28 L75 30 L80 30 L80 25 Z" fill="#A8252E"/>        
                {/* Paredes */}
                <rect x="10" y="28" width="60" height="40" fill="none" stroke="#A8252E" strokeWidth="4"/>
                {/* Cable/Línea curva */}
                <path d="M-20 70 Q20 85 40 70 Q60 55 80 70" stroke="#A8252E" strokeWidth="4" fill="none"/>
              </g>

              {/* Check en círculo */}
              <g transform="translate(160, 40)">
                <circle cx="30" cy="30" r="28" stroke="#6B7280" strokeWidth="4" fill="none"/>
                <path d="M15 30 L25 40 L45 20" stroke="#6B7280" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
            </svg>
          </div>

          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '-2px',
            lineHeight: 1
          }}>
            <span style={{ color: '#A8252E' }}>INSPEC</span>
            <span style={{ color: '#6B7280' }}>TEN</span>
          </h1>
        </div>

        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          textAlign: 'center',
          marginBottom: '32px',
          color: '#111827'
        }}>
          Iniciar Sesión
        </h2>

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="admin@inspecten.com"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#A8252E'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#A8252E'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: loading ? '#D97077' : '#A8252E',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(168, 37, 46, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#8A1F26'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#A8252E'
            }}
          >
            {loading ? 'Iniciando...' : 'Ingresar'}      
          </button>
        </form>

        <div style={{
          marginTop: '28px',
          padding: '16px',
          backgroundColor: '#F9FAFB',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#6b7280',
          border: '1px solid #e5e7eb'
        }}>
          <strong style={{ color: '#374151' }}>Usuario de prueba:</strong><br />
          <div style={{ marginTop: '4px' }}>
            Email: admin@inspecten.com<br />
            Contraseña: admin123
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        textAlign: 'center',
        color: 'white',
        fontSize: '13px',
        opacity: 0.8
      }}>
        © 2024 INSPECTEN - Sistema de Gestión de Inspecciones
      </div>
    </div>
  )
}
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
      // Por ahora, validación directa sin API
      if (email === 'admin@inspecten.com' && password === 'admin123') {
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          email: email,
          name: 'Francisco Guarderas',
          role: 'admin'
        }))
        router.push('/dashboard')
      } else {
        setError('Credenciales inválidas')
      }
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
      backgroundColor: '#A8252E'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '420px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '-2px'
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
                boxSizing: 'border-box'
              }}
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
                boxSizing: 'border-box'
              }}
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
              cursor: loading ? 'not-allowed' : 'pointer'
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
    </div>
  )
}
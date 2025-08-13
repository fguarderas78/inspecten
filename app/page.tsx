'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Cargar el script de Google
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      // Inicializar Google Sign In
      window.google.accounts.id.initialize({
        client_id: '276697031867-17li97nhqr5adtrp8o8e7pr7lbop6jp0.apps.googleusercontent.com',
        callback: handleGoogleLogin,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: 'signin',
        ux_mode: 'popup',
      })

      // Renderizar el botón
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          locale: 'es'
        }
      )
    }

    return () => {
      const scriptTag = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
      if (scriptTag) {
        document.body.removeChild(scriptTag)
      }
    }
  }, [])

  const handleGoogleLogin = async (response: any) => {
    setError('')
    setIsLoading(true)

    try {
      // Decodificar el token JWT de Google
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      
      // Verificar que el email termine en @inspecten.com o sea el tuyo para pruebas
      const allowedEmails = ['fguarderas@cogucosa.com']; // Email de prueba
      const isAllowedEmail = allowedEmails.includes(payload.email);
      
      if (!payload.email.endsWith('@inspecten.com') && !isAllowedEmail) {
        setError('Acceso restringido a cuentas corporativas @inspecten.com')
        setIsLoading(false)
        return
      }

      // Verificar que el email esté verificado
      if (!payload.email_verified) {
        setError('Por favor verifica tu cuenta de Google primero')
        setIsLoading(false)
        return
      }

      // Guardar información del usuario
      sessionStorage.setItem('userEmail', payload.email)
      sessionStorage.setItem('userName', payload.name)
      sessionStorage.setItem('userPicture', payload.picture)
      sessionStorage.setItem('isAuthenticated', 'true')

      // Redirigir al dashboard
      router.push('/dashboard')

    } catch (error) {
      console.error('Error en login:', error)
      setError('Error al iniciar sesión. Por favor intente nuevamente.')
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
      padding: '20px'
    }}>
      {/* Contenedor principal con sombra profesional */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '440px',
        overflow: 'hidden'
      }}>
        {/* Header con fondo */}
        <div style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          padding: '40px 40px 32px',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Logo */}
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}>
              {/* Aquí va el logo de INSPECTEN */}
              <img 
                src="/Inspecten-01.png" 
                alt="INSPECTEN" 
                style={{
                  width: '60px',
                  height: '60px',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  // Si no se encuentra el logo, mostrar texto
                  e.currentTarget.style.display = 'none'
                  const textLogo = document.createElement('div')
                  textLogo.innerHTML = '<strong style="color: #dc2626; font-size: 24px;">IN</strong>'
                  e.currentTarget.parentElement?.appendChild(textLogo)
                }}
              />
            </div>
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: '300',
            color: 'white',
            margin: '0 0 8px 0',
            letterSpacing: '2px'
          }}>
            INSPECTEN
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0,
            fontWeight: '400'
          }}>
            Sistema de Gestión de Inspecciones
          </p>
        </div>

        {/* Contenido del formulario */}
        <div style={{
          padding: '40px'
        }}>
          {/* Mensaje de bienvenida */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '12px'
            }}>
              Portal Corporativo
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Acceso exclusivo para empleados con cuenta<br />
              <span style={{
                color: '#dc2626',
                fontWeight: '600'
              }}>@inspecten.com</span>
            </p>
          </div>

          {/* Botón de Google Sign In */}
          <div 
            id="google-signin-button" 
            style={{
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'center',
              filter: isLoading ? 'opacity(0.6)' : 'none',
              pointerEvents: isLoading ? 'none' : 'auto'
            }}
          >
            {/* Google renderizará el botón aquí */}
          </div>

          {/* Mensaje de error */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#991b1b',
              textAlign: 'center',
              animation: 'slideIn 0.3s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>⚠️</span>
              {error}
            </div>
          )}

          {/* Indicador de carga */}
          {isLoading && (
            <div style={{
              textAlign: 'center',
              marginBottom: '20px',
              color: '#6b7280',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #dc2626',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></span>
              Verificando credenciales...
            </div>
          )}

          {/* Línea divisora */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '32px 0 24px',
            gap: '16px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
            <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}>
              SEGURIDAD
            </span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }}></div>
          </div>

          {/* Información de seguridad */}
          <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <span style={{ fontSize: '20px', marginTop: '2px' }}>🔒</span>
              <div>
                <p style={{
                  fontSize: '13px',
                  color: '#4b5563',
                  margin: '0 0 4px 0',
                  fontWeight: '600'
                }}>
                  Conexión segura con Google Workspace
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  Autenticación de dos factores disponible.<br />
                  Todos los accesos son monitoreados y registrados.
                </p>
              </div>
            </div>
          </div>

          {/* Enlaces de ayuda */}
          <div style={{
            textAlign: 'center',
            paddingTop: '12px'
          }}>
            <p style={{
              fontSize: '13px',
              color: '#9ca3af',
              marginBottom: '8px'
            }}>
              ¿Necesitas ayuda?
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              fontSize: '14px'
            }}>
              <a
                href="mailto:soporte@inspecten.com"
                style={{
                  color: '#dc2626',
                  textDecoration: 'none',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none'
                }}
              >
                📧 Soporte
              </a>
              <a
                href="https://docs.inspecten.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#dc2626',
                  textDecoration: 'none',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textDecoration = 'underline'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textDecoration = 'none'
                }}
              >
                📚 Manual
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          backgroundColor: '#f9fafb',
          padding: '16px',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            margin: 0
          }}>
            © 2024 INSPECTEN. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
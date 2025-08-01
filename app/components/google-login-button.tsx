// components/google-login-button.tsx
'use client'

import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

export function GoogleLoginButton() {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      setLoading(true);
      try {
        // Guardar el token
        localStorage.setItem('google_access_token', response.access_token);
        setIsLogged(true);
        console.log('✅ Conectado a Google');
      } catch (error) {
        console.error('Error al conectar:', error);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.error('Error en el login');
    },
    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/calendar'
  });

  if (isLogged) {
    return (
      <div style={{
        padding: '8px 12px',
        backgroundColor: '#10b981',
        color: 'white',
        borderRadius: '6px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <span>✓</span>
        <span>Google Conectado</span>
      </div>
    );
  }

  return (
    <button
      onClick={() => login()}
      disabled={loading}
      style={{
        width: '100%',
        padding: '8px 12px',
        backgroundColor: '#4285f4',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: loading ? 'wait' : 'pointer',
        fontSize: '13px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#fff"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#fff"/>
        <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#fff"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#fff"/>
      </svg>
      {loading ? 'Conectando...' : 'Conectar Google'}
    </button>
  );
}
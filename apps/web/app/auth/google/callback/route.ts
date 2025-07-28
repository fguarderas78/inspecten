// app/api/auth/google/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { cookies } from 'next/headers'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NODE_ENV === 'production' 
    ? 'https://inspect10.us/api/auth/google/callback'
    : 'http://localhost:3000/api/auth/google/callback'
)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  
  if (error) {
    return NextResponse.redirect('/dashboard?error=auth_denied')
  }
  
  if (!code) {
    return NextResponse.redirect('/dashboard?error=no_code')
  }
  
  try {
    // Intercambiar código por tokens
    const { tokens } = await oauth2Client.getToken(code)
    
    // Guardar tokens en cookies seguras
    const cookieStore = cookies()
    
    // Guardar refresh token (expira en 30 días)
    if (tokens.refresh_token) {
      cookieStore.set('google_refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 días
        path: '/',
      })
    }
    
    // Guardar access token (expira en 1 hora)
    if (tokens.access_token) {
      cookieStore.set('google_access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hora
        path: '/',
      })
    }
    
    // Obtener información del usuario
    oauth2Client.setCredentials(tokens)
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data } = await oauth2.userinfo.get()
    
    // Guardar email del usuario
    if (data.email) {
      cookieStore.set('user_email', data.email, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
    }
    
    return NextResponse.redirect('/dashboard?success=authenticated')
  } catch (error) {
    console.error('Error en callback:', error)
    return NextResponse.redirect('/dashboard?error=auth_failed')
  }
}
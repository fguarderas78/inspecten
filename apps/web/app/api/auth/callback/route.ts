import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = 'http://localhost:3000';

  if (error) {
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=auth_denied`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=no_code`);
  }

  try {
    // Intercambiar código por tokens REALES
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code,
        client_id: '276697031867-17li97nhqr5adtrp8o8e7pr7lbop6jp0.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:3000/api/auth/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();
    console.log('Tokens recibidos:', tokens);

    if (tokens.access_token) {
      const response = NextResponse.redirect(`${baseUrl}/dashboard/settings?driveConnected=true`);
      
      // Guardar el token real
      response.cookies.set('google_access_token', tokens.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 60 * 60, // 1 hora
        path: '/'
      });

      if (tokens.refresh_token) {
        response.cookies.set('google_refresh_token', tokens.refresh_token, {
          httpOnly: true,
          secure: false,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 30, // 30 días
          path: '/'
        });
      }

      return response;
    } else {
      console.error('No se recibió access_token:', tokens);
      return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=no_token`);
    }
  } catch (error) {
    console.error('Error in callback:', error);
    return NextResponse.redirect(`${baseUrl}/dashboard/settings?error=callback_error`);
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = '276697031867-17li97nhqr5adtrp8o8e7pr7lbop6jp0.apps.googleusercontent.com';
  const redirectUri = 'http://localhost:3000/api/auth/callback';
  const scope = 'https://www.googleapis.com/auth/drive.file';
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scope,
    access_type: 'offline',
    prompt: 'select_account'
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.redirect(googleAuthUrl);
}

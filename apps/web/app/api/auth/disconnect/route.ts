import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  
  // Eliminar la cookie
  cookieStore.delete('google_token');
  
  return NextResponse.json({ success: true });
}

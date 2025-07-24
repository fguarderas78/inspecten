import { NextResponse } from 'next/server'

// Mock users para autenticación temporal
const mockUsers = [
  {
    id: '1',
    email: 'admin@inspecten.com',
    password: 'admin123', // En producción NUNCA hacer esto
    name: 'Francisco Guarderas',
    role: 'admin'
  }
]

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Verificación mock
    const user = mockUsers.find(
      u => u.email === email && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // En producción usarías JWT o sesiones reales
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({
      user: userWithoutPassword,
      token: 'mock-jwt-token-' + Date.now(),
      message: 'Login exitoso'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error en autenticación' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Verificar sesión (mock)
  return NextResponse.json({
    authenticated: true,
    user: {
      id: '1',
      email: 'admin@inspecten.com',
      name: 'Francisco Guarderas',
      role: 'admin'
    }
  })
}
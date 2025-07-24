import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todas las propiedades
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'active'

    const properties = await prisma.property.findMany({
      where: { status: status },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(properties)

  } catch (error) {
    console.error('Error al obtener propiedades:', error)
    return NextResponse.json(
      { error: 'Error al obtener propiedades' },
      { status: 500 }
    )
  }
}
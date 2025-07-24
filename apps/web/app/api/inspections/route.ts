import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener todas las inspecciones
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''

    // Construir el query
    let where: any = {}

    // Filtrar por estado si no es "all"
    if (status !== 'all') {
      where.status = status
    }

    // Agregar búsqueda si existe
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { property: { name: { contains: search, mode: 'insensitive' } } },
        { inspector: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    const inspections = await prisma.inspection.findMany({
      where,
      include: {
        property: true,
        inspector: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(inspections)

  } catch (error) {
    console.error('Error al obtener inspecciones:', error)
    return NextResponse.json(
      { error: 'Error al obtener inspecciones' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva inspección
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, propertyId, inspectorId, date, time, comments, clientName } = body

    // Validar datos requeridos
    if (!name || !propertyId || !inspectorId || !date || !clientName) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    // Generar código único para la inspección
    const count = await prisma.inspection.count()
    const code = `INS${String(count + 1).padStart(3, '0')}`

    // Combinar fecha y hora
    const inspectionDate = new Date(date)
    if (time) {
      const [hours, minutes] = time.split(':')
      inspectionDate.setHours(parseInt(hours), parseInt(minutes))
    }

    const inspection = await prisma.inspection.create({
      data: {
        code,
        name,
        status: 'scheduled',
        progress: 0,
        date: inspectionDate,
        comments,
        clientName,
        propertyId,
        inspectorId
      },
      include: {
        property: true,
        inspector: true
      }
    })

    return NextResponse.json({
      message: 'Inspección creada exitosamente',
      inspection
    })

  } catch (error) {
    console.error('Error al crear inspección:', error)
    return NextResponse.json(
      { error: 'Error al crear inspección' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar inspección
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, status, progress } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (progress !== undefined) updateData.progress = progress

    const inspection = await prisma.inspection.update({
      where: { id },
      data: updateData,
      include: {
        property: true,
        inspector: true
      }
    })

    return NextResponse.json({
      message: 'Inspección actualizada exitosamente',
      inspection
    })

  } catch (error) {
    console.error('Error al actualizar inspección:', error)
    return NextResponse.json(
      { error: 'Error al actualizar inspección' },
      { status: 500 }
    )
  }
}
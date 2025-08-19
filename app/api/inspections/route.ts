import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';  // 👈 Esta es la ruta correcta

// GET - Obtener todas las inspecciones
export async function GET() {
  try {
    const inspections = await prisma.inspection.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(inspections);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener inspecciones' }, { status: 500 });
  }
}

// POST - Crear nueva inspección
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generar código único
    const year = new Date().getFullYear();
    const count = await prisma.inspection.count();
    const code = `INS-${year}-${String(count + 1).padStart(3, '0')}`;
    
    const inspection = await prisma.inspection.create({
      data: {
        code,
        propertyId: data.propertyId,
        clientName: data.clientName,
        clientEmail: data.clientEmail || null,
        type: data.type,
        status: 'programada',
        progress: 0,
        inspectorId: data.inspectorId,
        inspectorName: data.inspectorName,
        scheduledDate: new Date(data.scheduledDate),
        notes: data.notes || null
      }
    });
    
    return NextResponse.json(inspection);
  } catch (error) {
    console.error('Error creando inspección:', error);
    return NextResponse.json({ error: 'Error al crear inspección' }, { status: 500 });
  }
}
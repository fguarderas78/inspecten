import { NextResponse } from 'next/server'

// Datos temporales sin base de datos
const mockInspections = [
  {
    id: '1',
    propertyId: '1',
    property: 'Casa Ejemplo',
    date: '2024-01-15',
    status: 'completed',
    inspector: 'Juan Pérez'
  },
  {
    id: '2', 
    propertyId: '2',
    property: 'Edificio Centro',
    date: '2024-01-20',
    status: 'pending',
    inspector: 'María García'
  }
]

export async function GET() {
  try {
    return NextResponse.json({ inspections: mockInspections })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching inspections' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const newInspection = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json(
      { inspection: newInspection, message: 'Created successfully' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating inspection' },
      { status: 500 }
    )
  }
}
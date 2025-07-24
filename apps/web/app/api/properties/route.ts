import { NextResponse } from 'next/server'

// Datos temporales sin base de datos
const mockProperties = [
  {
    id: '1',
    name: 'Casa Moderna Valle',
    address: 'Av. Principal 123, Valle de los Chillos',
    type: 'residential',
    owner: 'María González',
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: '2',
    name: 'Edificio Corporativo Centro',
    address: 'Av. Amazonas N45-123, Quito',
    type: 'commercial',
    owner: 'Empresa XYZ',
    status: 'active',
    createdAt: '2024-01-12'
  },
  {
    id: '3',
    name: 'Bodega Industrial Norte',
    address: 'Panamericana Norte Km 15',
    type: 'industrial',
    owner: 'Industrias ABC',
    status: 'active',
    createdAt: '2024-01-15'
  }
]

export async function GET() {
  try {
    return NextResponse.json({ properties: mockProperties })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching properties' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newProperty = {
      id: Date.now().toString(),
      ...body,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    
    return NextResponse.json(
      { property: newProperty, message: 'Property created successfully' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating property' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    return NextResponse.json(
      { property: { ...body, updatedAt: new Date().toISOString() } },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error updating property' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    return NextResponse.json(
      { message: `Property ${id} deleted successfully` },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Error deleting property' },
      { status: 500 }
    )
  }
}
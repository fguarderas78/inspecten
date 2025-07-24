import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  // Crear un usuario de prueba
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  const user = await prisma.user.create({
    data: {
      email: 'admin@inspecten.com',
      password: hashedPassword,
      name: 'Francisco Guarderas',
      role: 'admin'
    }
  })

  console.log('Usuario creado:', user.email)

  // Crear algunas propiedades de ejemplo
  const propertiesData = [
    {
      name: 'Casa Residencial Norte',
      address: 'Calle 45 #123',
      owner: 'María García',
      type: 'Residencial',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
    },
    {
      name: 'Edificio Comercial Centro',
      address: 'Av. Principal #456',
      owner: 'Juan Pérez',
      type: 'Comercial',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400'
    },
    {
      name: 'Bodega Industrial Sur',
      address: 'Zona Industrial Km 5',
      owner: 'Empresa XYZ',
      type: 'Industrial',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=400'
    },
    {
      name: 'Apartamento 5B Torre Sol',
      address: 'Torre Sol, Piso 5',
      owner: 'Carlos Méndez',
      type: 'Residencial',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
    },
    {
      name: 'Local Plaza Mayor',
      address: 'Plaza Mayor Local 15',
      owner: 'Ana Torres',
      type: 'Comercial',
      status: 'archived',
      imageUrl: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=400'
    },
    {
      name: 'Casa Conjunto Cerrado',
      address: 'Conjunto Los Pinos #45',
      owner: 'Luis Ramírez',
      type: 'Residencial',
      status: 'archived',
      imageUrl: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400'
    },
    {
      name: 'Oficina Torre Ejecutiva',
      address: 'Torre Ejecutiva Piso 12',
      owner: 'Corporación Tech',
      type: 'Comercial',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400'
    },
    {
      name: 'Villa Campestre',
      address: 'Km 12 Vía Samborondón',
      owner: 'Familia Rodríguez',
      type: 'Residencial',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
    },
    {
      name: 'Planta de Producción',
      address: 'Parque Industrial Norte',
      owner: 'Industrias Alfa',
      type: 'Industrial',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'
    },
    {
      name: 'Penthouse Vista al Río',
      address: 'Malecón 2000, Torre A',
      owner: 'Sofía Martínez',
      type: 'Residencial',
      status: 'active',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'
    }
  ]

  const createdProperties = []
  for (const prop of propertiesData) {
    const property = await prisma.property.create({
      data: prop
    })
    createdProperties.push(property)
  }

  console.log(`${propertiesData.length} Propiedades creadas`)

  // Crear varias inspecciones de ejemplo
  const inspectionsData = [
    {
      code: 'INS001',
      name: 'Inspección Anual Completa',
      status: 'completed',
      progress: 100,
      date: new Date('2024-03-20T10:00:00'),
      clientName: 'María García',
      propertyId: createdProperties[0].id,
      inspectorId: user.id
    },
    {
      code: 'INS002',
      name: 'Revisión Sistema Eléctrico',
      status: 'in-progress',
      progress: 75,
      date: new Date('2024-03-21T14:00:00'),
      clientName: 'Juan Pérez',
      propertyId: createdProperties[1].id,
      inspectorId: user.id
    },
    {
      code: 'INS003',
      name: 'Inspección Pre-compra',
      status: 'scheduled',
      progress: 0,
      date: new Date('2024-03-25T09:00:00'),
      clientName: 'Empresa XYZ',
      propertyId: createdProperties[2].id,
      inspectorId: user.id
    },
    {
      code: 'INS004',
      name: 'Evaluación Estructural',
      status: 'scheduled',
      progress: 0,
      date: new Date('2024-03-26T11:00:00'),
      clientName: 'Carlos Méndez',
      propertyId: createdProperties[3].id,
      inspectorId: user.id
    },
    {
      code: 'INS005',
      name: 'Inspección de Seguridad',
      status: 'completed',
      progress: 100,
      date: new Date('2024-03-18T15:00:00'),
      clientName: 'Ana Torres',
      propertyId: createdProperties[4].id,
      inspectorId: user.id,
      comments: 'Inspección completada sin observaciones'
    }
  ]

  for (const inspData of inspectionsData) {
    await prisma.inspection.create({
      data: inspData
    })
  }

  console.log(`${inspectionsData.length} Inspecciones creadas`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
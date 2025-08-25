import { NextRequest, NextResponse } from 'next/server'

// Simulación de base de datos en memoria (reemplazar con tu base de datos real)
const inspectionsDB = new Map<string, any>();

// GET - Verificar si existe documento en Google Drive
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Buscar en tu base de datos real
    // const inspection = await db.inspection.findUnique({ where: { id: params.id } })
    
    // Por ahora usamos la simulación
    const inspection = inspectionsDB.get(params.id) || { id: params.id, googleDriveId: null }
    
    return NextResponse.json({
      id: inspection.id,
      googleDriveId: inspection.googleDriveId
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al verificar documento' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo documento en Google Drive
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { inspectionData, customTemplate } = body
    
    // Verificar si ya existe un documento
    const existingInspection = inspectionsDB.get(params.id)
    if (existingInspection?.googleDriveId) {
      return NextResponse.json({
        googleDriveId: existingInspection.googleDriveId,
        message: 'El documento ya existe'
      })
    }
    
    // Usar la plantilla personalizada si se proporciona, o generar una por defecto
    const documentContent = customTemplate || `
REPORTE DE INSPECCIÓN - ${inspectionData.code}

INFORMACIÓN GENERAL
==================
Código: ${inspectionData.code}
Cliente: ${inspectionData.clientName}
Email: ${inspectionData.clientEmail || 'No especificado'}
Tipo: ${inspectionData.type}
Inspector: ${inspectionData.inspectorName}
Fecha Programada: ${new Date(inspectionData.scheduledDate).toLocaleDateString('es-ES')}
Estado: ${inspectionData.status}
Progreso: ${inspectionData.progress}%

PROPIEDAD
=========
ID: ${inspectionData.propertyId}

OBSERVACIONES
=============
${inspectionData.notes || 'Sin observaciones'}

CHECKLIST
=========
[Pendiente de completar]

CONCLUSIONES
============
[Pendiente de completar]

FIRMAS
======
Inspector: _______________________
Cliente: _________________________
Fecha: ___________________________
    `
    
    // Simular la creación del documento en Google Drive
    // En producción, aquí usarías la API real de Google Drive
    const newDocId = `gdoc-${params.id}-${Date.now()}`
    
    // En producción, aquí crearías el documento real en Google Drive:
    /*
    const auth = new google.auth.GoogleAuth({
      keyFile: 'path/to/credentials.json',
      scopes: ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/documents'],
    });
    
    const drive = google.drive({ version: 'v3', auth });
    const docs = google.docs({ version: 'v1', auth });
    
    // Crear el documento
    const doc = await docs.documents.create({
      requestBody: {
        title: `Inspección ${inspectionData.code} - ${inspectionData.clientName}`,
      },
    });
    
    // Insertar el contenido
    await docs.documents.batchUpdate({
      documentId: doc.data.documentId,
      requestBody: {
        requests: [{
          insertText: {
            location: { index: 1 },
            text: documentContent,
          },
        }],
      },
    });
    
    const newDocId = doc.data.documentId;
    */
    
    // Guardar el ID en la "base de datos"
    inspectionsDB.set(params.id, {
      ...existingInspection,
      id: params.id,
      googleDriveId: newDocId
    })
    
    // En producción, actualizarías tu base de datos real:
    // await db.inspection.update({
    //   where: { id: params.id },
    //   data: { googleDriveId: newDocId }
    // })
    
    console.log(`Documento creado para inspección ${params.id}:`, newDocId)
    console.log('Contenido del documento:', documentContent.substring(0, 200) + '...')
    
    return NextResponse.json({
      googleDriveId: newDocId,
      message: 'Documento creado exitosamente',
      documentUrl: `https://docs.google.com/document/d/${newDocId}/edit`
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al crear documento' },
      { status: 500 }
    )
  }
}
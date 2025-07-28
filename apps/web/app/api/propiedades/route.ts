import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// Configuración de autenticación
// IMPORTANTE: En producción, usa OAuth2 o Service Account
const auth = new google.auth.GoogleAuth({
  credentials: {
    // Estos valores vendrán de tu Service Account JSON
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
  ],
})

const drive = google.drive({ version: 'v3', auth })
const sheets = google.sheets({ version: 'v4', auth })

// ID de tu carpeta "registro de propiedades"
const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || 'TU_FOLDER_ID_AQUI'

// Función para buscar o crear hoja de cálculo
async function findOrCreateSpreadsheet() {
  try {
    // Buscar si ya existe
    const response = await drive.files.list({
      q: `name='Propiedades Inspecten' and mimeType='application/vnd.google-apps.spreadsheet' and '${FOLDER_ID}' in parents and trashed=false`,
      fields: 'files(id, name)',
    })

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!
    }

    // Crear nueva hoja de cálculo
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'Propiedades Inspecten',
        },
        sheets: [{
          properties: {
            title: 'Propiedades',
          },
        }],
      },
    })

    // Mover a la carpeta correcta
    await drive.files.update({
      fileId: spreadsheet.data.spreadsheetId!,
      addParents: FOLDER_ID,
      fields: 'id, parents',
    })

    // Agregar encabezados
    const headers = [
      'ID', 'Nombre', 'Dirección', 'Tipo', 'Propietario', 
      'Teléfono', 'Email', 'Superficie', 'Habitaciones', 
      'Baños', 'Estacionamientos', 'Estado', 'Fecha Registro', 
      'Última Inspección', 'Próxima Inspección', 'Notas', 'URL Imagen'
    ]

    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheet.data.spreadsheetId!,
      range: 'Propiedades!A1:Q1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    })

    return spreadsheet.data.spreadsheetId!
  } catch (error) {
    console.error('Error al crear spreadsheet:', error)
    throw error
  }
}

// POST - Guardar nueva propiedad
export async function POST(request: Request) {
  try {
    const propiedad = await request.json()
    
    // Obtener o crear spreadsheet
    const spreadsheetId = await findOrCreateSpreadsheet()
    
    // Preparar datos para insertar
    const values = [[
      propiedad.id,
      propiedad.nombre,
      propiedad.direccion,
      propiedad.tipo,
      propiedad.propietario,
      propiedad.telefono,
      propiedad.email || '',
      propiedad.superficie || '',
      propiedad.habitaciones || '',
      propiedad.banos || '',
      propiedad.estacionamientos || '',
      propiedad.estado,
      propiedad.fechaRegistro,
      propiedad.ultimaInspeccion || '',
      propiedad.proximaInspeccion || '',
      propiedad.notas || '',
      propiedad.imagen || ''
    ]]
    
    // Agregar fila
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Propiedades!A:Q',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values,
      },
    })
    
    // Si hay imagen, guardarla en Drive
    if (propiedad.imagen && propiedad.imagen.startsWith('data:image')) {
      try {
        // Crear carpeta para imágenes si no existe
        const imagesFolderResponse = await drive.files.list({
          q: `name='imagenes_propiedades' and mimeType='application/vnd.google-apps.folder' and '${FOLDER_ID}' in parents and trashed=false`,
          fields: 'files(id)',
        })
        
        let imagesFolderId = FOLDER_ID
        if (imagesFolderResponse.data.files && imagesFolderResponse.data.files.length > 0) {
          imagesFolderId = imagesFolderResponse.data.files[0].id!
        } else {
          // Crear carpeta de imágenes
          const folder = await drive.files.create({
            requestBody: {
              name: 'imagenes_propiedades',
              mimeType: 'application/vnd.google-apps.folder',
              parents: [FOLDER_ID],
            },
          })
          imagesFolderId = folder.data.id!
        }
        
        // Convertir base64 a buffer
        const base64Data = propiedad.imagen.split(',')[1]
        const imageBuffer = Buffer.from(base64Data, 'base64')
        
        // Subir imagen
        const imageFile = await drive.files.create({
          requestBody: {
            name: `${propiedad.id}_${propiedad.nombre}.jpg`,
            parents: [imagesFolderId],
          },
          media: {
            mimeType: 'image/jpeg',
            body: imageBuffer,
          },
        })
        
        // Hacer la imagen pública
        await drive.permissions.create({
          fileId: imageFile.data.id!,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        })
        
        // Actualizar URL de imagen en la hoja
        const imageUrl = `https://drive.google.com/uc?id=${imageFile.data.id}`
        // Aquí podrías actualizar la celda con la URL de la imagen
      } catch (imageError) {
        console.error('Error al subir imagen:', imageError)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Propiedad guardada en Google Drive',
      spreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
    })
  } catch (error) {
    console.error('Error al guardar propiedad:', error)
    return NextResponse.json(
      { success: false, error: 'Error al guardar en Google Drive' },
      { status: 500 }
    )
  }
}

// GET - Obtener todas las propiedades
export async function GET() {
  try {
    const spreadsheetId = await findOrCreateSpreadsheet()
    
    // Leer datos
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Propiedades!A2:Q',
    })
    
    const rows = response.data.values || []
    
    // Convertir a objetos
    const propiedades = rows.map(row => ({
      id: row[0],
      nombre: row[1],
      direccion: row[2],
      tipo: row[3],
      propietario: row[4],
      telefono: row[5],
      email: row[6],
      superficie: row[7],
      habitaciones: row[8] ? parseInt(row[8]) : undefined,
      banos: row[9] ? parseInt(row[9]) : undefined,
      estacionamientos: row[10] ? parseInt(row[10]) : undefined,
      estado: row[11],
      fechaRegistro: row[12],
      ultimaInspeccion: row[13],
      proximaInspeccion: row[14],
      notas: row[15],
      imagen: row[16],
    }))
    
    return NextResponse.json({ 
      success: true, 
      propiedades,
      total: propiedades.length 
    })
  } catch (error) {
    console.error('Error al leer propiedades:', error)
    return NextResponse.json(
      { success: false, error: 'Error al leer de Google Drive' },
      { status: 500 }
    )
  }
}
// app/services/googleService.ts
import { google } from 'googleapis'
import { GoogleAuth, OAuth2Client } from 'google-auth-library'
import { cookies } from 'next/headers'

// Función para obtener cliente OAuth desde cookies
export function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NODE_ENV === 'production' 
      ? 'https://inspect10.us/api/auth/google/callback'
      : 'http://localhost:3000/api/auth/google/callback'
  )
  
  // Obtener tokens de las cookies
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('google_refresh_token')?.value
  const accessToken = cookieStore.get('google_access_token')?.value
  
  if (refreshToken) {
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
      access_token: accessToken,
    })
  }
  
  return oauth2Client
}

// Función para verificar autenticación
export async function checkAuth() {
  const oauth2Client = getOAuth2Client()
  const credentials = oauth2Client.credentials
  
  if (!credentials.refresh_token) {
    return { authenticated: false, needsAuth: true }
  }
  
  try {
    // Intentar refrescar el token si es necesario
    const { credentials: newCredentials } = await oauth2Client.refreshAccessToken()
    oauth2Client.setCredentials(newCredentials)
    
    // Actualizar access token en cookies si se renovó
    if (newCredentials.access_token) {
      const cookieStore = cookies()
      cookieStore.set('google_access_token', newCredentials.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60, // 1 hora
        path: '/',
      })
    }
    
    return { authenticated: true, needsAuth: false }
  } catch (error) {
    return { authenticated: false, needsAuth: true }
  }
}

// Servicios de Google usando OAuth
export const googleDrive = () => google.drive({ version: 'v3', auth: getOAuth2Client() })
export const googleSheets = () => google.sheets({ version: 'v4', auth: getOAuth2Client() })
export const googleDocs = () => google.docs({ version: 'v1', auth: getOAuth2Client() })
export const googleCalendar = () => google.calendar({ version: 'v3', auth: getOAuth2Client() })

// IDs de carpetas principales
export const FOLDERS = {
  MAIN: process.env.GOOGLE_DRIVE_MAIN_FOLDER_ID || '',
  PROPIEDADES: process.env.GOOGLE_DRIVE_PROPIEDADES_FOLDER_ID || '',
  INSPECCIONES: process.env.GOOGLE_DRIVE_INSPECCIONES_FOLDER_ID || '',
  REPORTES: process.env.GOOGLE_DRIVE_REPORTES_FOLDER_ID || '',
  USUARIOS: process.env.GOOGLE_DRIVE_USUARIOS_FOLDER_ID || '',
  CHECKLISTS: process.env.GOOGLE_DRIVE_CHECKLISTS_FOLDER_ID || '',
}

// Funciones helper generales
export async function findOrCreateFolder(folderName: string, parentId?: string) {
  const drive = googleDrive()
  
  try {
    // Buscar si existe
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' ${
        parentId ? `and '${parentId}' in parents` : ''
      } and trashed=false`,
      fields: 'files(id, name)',
    })

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id!
    }

    // Crear si no existe
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : [],
    }

    const folder = await drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    })

    return folder.data.id!
  } catch (error) {
    console.error('Error creating folder:', error)
    throw error
  }
}

// Función para subir archivos
export async function uploadFile(
  fileName: string, 
  mimeType: string, 
  content: Buffer | string, 
  folderId?: string
) {
  const drive = googleDrive()
  
  try {
    const fileMetadata = {
      name: fileName,
      parents: folderId ? [folderId] : [],
    }

    const media = {
      mimeType,
      body: content,
    }

    const file = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    })

    return {
      id: file.data.id,
      url: file.data.webViewLink,
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Función para crear o actualizar hoja de cálculo
export async function createOrUpdateSpreadsheet(
  spreadsheetName: string,
  sheetName: string,
  headers: string[],
  folderId?: string
) {
  const drive = googleDrive()
  const sheets = googleSheets()
  
  try {
    // Buscar si existe
    const searchQuery = folderId 
      ? `name='${spreadsheetName}' and mimeType='application/vnd.google-apps.spreadsheet' and '${folderId}' in parents and trashed=false`
      : `name='${spreadsheetName}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`
      
    const response = await drive.files.list({
      q: searchQuery,
      fields: 'files(id, name)',
    })

    let spreadsheetId: string

    if (response.data.files && response.data.files.length > 0) {
      spreadsheetId = response.data.files[0].id!
    } else {
      // Crear nueva
      const spreadsheet = await sheets.spreadsheets.create({
        requestBody: {
          properties: {
            title: spreadsheetName,
          },
          sheets: [{
            properties: {
              title: sheetName,
            },
          }],
        },
      })

      spreadsheetId = spreadsheet.data.spreadsheetId!

      // Mover a la carpeta si se especificó
      if (folderId) {
        await drive.files.update({
          fileId: spreadsheetId,
          addParents: folderId,
          fields: 'id, parents',
        })
      }

      // Agregar encabezados
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1:${String.fromCharCode(65 + headers.length - 1)}1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers],
        },
      })
    }

    return spreadsheetId
  } catch (error) {
    console.error('Error with spreadsheet:', error)
    throw error
  }
}

// Función para agregar fila a hoja de cálculo
export async function appendToSheet(
  spreadsheetId: string,
  sheetName: string,
  values: any[]
) {
  const sheets = googleSheets()
  
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [values],
      },
    })
  } catch (error) {
    console.error('Error appending to sheet:', error)
    throw error
  }
}

// Función para leer datos de hoja
export async function readFromSheet(
  spreadsheetId: string,
  range: string
) {
  const sheets = googleSheets()
  
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })
    
    return response.data.values || []
  } catch (error) {
    console.error('Error reading from sheet:', error)
    throw error
  }
}

// Función para crear documento
export async function createDocument(
  title: string,
  content: string,
  folderId?: string
) {
  const docs = googleDocs()
  const drive = googleDrive()
  
  try {
    // Crear documento
    const doc = await docs.documents.create({
      requestBody: {
        title,
      },
    })

    const documentId = doc.data.documentId!

    // Mover a carpeta si se especificó
    if (folderId) {
      await drive.files.update({
        fileId: documentId,
        addParents: folderId,
        fields: 'id, parents',
      })
    }

    // Agregar contenido si se proporcionó
    if (content) {
      await docs.documents.batchUpdate({
        documentId,
        requestBody: {
          requests: [{
            insertText: {
              location: { index: 1 },
              text: content,
            },
          }],
        },
      })
    }

    return documentId
  } catch (error) {
    console.error('Error creating document:', error)
    throw error
  }
}

// Función para programar evento en calendario
export async function createCalendarEvent(
  calendarId: string = 'primary',
  eventDetails: {
    summary: string
    description?: string
    start: Date
    end: Date
    attendees?: string[]
  }
) {
  const calendar = googleCalendar()
  
  try {
    const event = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.start.toISOString(),
          timeZone: 'America/Guayaquil',
        },
        end: {
          dateTime: eventDetails.end.toISOString(),
          timeZone: 'America/Guayaquil',
        },
        attendees: eventDetails.attendees?.map(email => ({ email })),
      },
    })

    return event.data
  } catch (error) {
    console.error('Error creating calendar event:', error)
    throw error
  }
}
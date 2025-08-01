// lib/google-config.js
// Configuración central para todas las APIs de Google

export const googleConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '276697031867-17li97nhqr5adtrp8o8e7pr7lbop6jp0.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  
  // Configuración de email
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true'
  },
  
  // Scopes necesarios para las APIs
  scopes: [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.send'
  ],
  
  // IDs de carpetas en Drive
  folders: {
    inspections: process.env.GOOGLE_DRIVE_INSPECTIONS_FOLDER_ID || '',
    properties: process.env.GOOGLE_DRIVE_PROPERTIES_FOLDER_ID || '',
    budgets: process.env.GOOGLE_DRIVE_BUDGETS_FOLDER_ID || ''
  }
};
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

class GoogleDriveOAuthService {
  private oauth2Client: OAuth2Client;
  private drive: any;
  
  constructor() {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
  }

  // Generar URL de autorización
  getAuthUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
    });
  }

  // Intercambiar código por tokens
  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    
    // Guardar tokens en base de datos o sesión
    return tokens;
  }

  // Configurar cliente con tokens existentes
  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
    this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });
  }

  // Refrescar token si es necesario
  async refreshTokenIfNeeded(tokens: any) {
    this.oauth2Client.setCredentials(tokens);
    
    if (tokens.expiry_date && tokens.expiry_date <= Date.now()) {
      const { credentials } = await this.oauth2Client.refreshAccessToken();
      return credentials;
    }
    
    return tokens;
  }

  // Crear archivo en Drive
  async createInspectionFile(inspectionData: any) {
    if (!this.drive) {
      throw new Error('Drive client not initialized. Call setCredentials first.');
    }

    try {
      // Primero, buscar o crear la carpeta
      const folderId = await this.findOrCreateFolder();
      
      const fileName = `INSPECCION_${inspectionData.code}_${new Date().toISOString().split('T')[0]}.json`;
      
      const fileMetadata = {
        name: fileName,
        parents: [folderId],
        mimeType: 'application/json',
      };

      const media = {
        mimeType: 'application/json',
        body: JSON.stringify(inspectionData, null, 2),
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink',
      });

      return {
        success: true,
        fileId: response.data.id,
        fileName: response.data.name,
        fileUrl: response.data.webViewLink,
      };
    } catch (error) {
      console.error('Error creating file in Drive:', error);
      return { success: false, error };
    }
  }

  // Actualizar archivo existente
  async updateInspectionFile(fileId: string, inspectionData: any) {
    if (!this.drive) {
      throw new Error('Drive client not initialized. Call setCredentials first.');
    }

    try {
      const media = {
        mimeType: 'application/json',
        body: JSON.stringify({
          ...inspectionData,
          lastUpdated: new Date().toISOString(),
        }, null, 2),
      };

      const response = await this.drive.files.update({
        fileId: fileId,
        media: media,
      });

      return { success: true, response: response.data };
    } catch (error) {
      console.error('Error updating file in Drive:', error);
      return { success: false, error };
    }
  }

  // Buscar archivo por código de inspección
  async findInspectionFile(inspectionCode: string) {
    if (!this.drive) {
      throw new Error('Drive client not initialized. Call setCredentials first.');
    }

    try {
      const folderId = await this.findOrCreateFolder();
      const response = await this.drive.files.list({
        q: `name contains 'INSPECCION_${inspectionCode}' and '${folderId}' in parents and trashed = false`,
        fields: 'files(id, name)',
      });

      if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0];
      }
      return null;
    } catch (error) {
      console.error('Error searching file:', error);
      return null;
    }
  }

  // Buscar o crear carpeta de respaldos
  async findOrCreateFolder() {
    try {
      // Buscar carpeta existente
      const response = await this.drive.files.list({
        q: "name='INSPECTEN_Respaldos' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'files(id, name)',
        spaces: 'drive',
      });

      if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0].id;
      }

      // Crear carpeta si no existe
      const fileMetadata = {
        name: 'INSPECTEN_Respaldos',
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folder = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id',
      });

      return folder.data.id;
    } catch (error) {
      console.error('Error with folder:', error);
      throw error;
    }
  }

  // Verificar si hay tokens válidos
  hasValidTokens(tokens: any): boolean {
    if (!tokens || !tokens.access_token) {
      return false;
    }

    // Si hay fecha de expiración, verificar que no haya expirado
    if (tokens.expiry_date) {
      return tokens.expiry_date > Date.now();
    }

    return true;
  }
}

export default GoogleDriveOAuthService;
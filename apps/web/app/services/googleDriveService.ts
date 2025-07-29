import { google } from 'googleapis';

class GoogleDriveService {
  private drive: any;
  
  constructor(accessToken: string) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });
    this.drive = google.drive({ version: 'v3', auth });
  }

  async createBackupFolder() {
    try {
      // Buscar si la carpeta ya existe
      const response = await this.drive.files.list({
        q: "name='INSPECTEN_Respaldos' and mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'files(id, name)',
      });

      if (response.data.files && response.data.files.length > 0) {
        return response.data.files[0].id;
      }

      // Crear la carpeta si no existe
      const fileMetadata = {
        name: 'INSPECTEN_Respaldos',
        mimeType: 'application/vnd.google-apps.folder',
      };

      const folder = await this.drive.files.create({
        requestBody: fileMetadata,
        fields: 'id',
      });

      console.log('Carpeta creada:', folder.data.id);
      return folder.data.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }

  async uploadInspection(inspectionData: any) {
    try {
      const folderId = await this.createBackupFolder();
      const fileName = `INSPECCION_${inspectionData.code}_${new Date().toISOString().split('T')[0]}.json`;
      
      const fileMetadata = {
        name: fileName,
        parents: folderId ? [folderId] : [],
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

      console.log('Archivo creado:', response.data);
      return {
        success: true,
        fileId: response.data.id,
        fileName: response.data.name,
        fileUrl: response.data.webViewLink,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
}

export default GoogleDriveService;

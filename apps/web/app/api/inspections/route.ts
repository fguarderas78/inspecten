import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import GoogleDriveService from '../../services/googleDriveService';

export async function POST(request: NextRequest) {
  try {
    const inspectionData = await request.json();
    const cookieStore = cookies();
    const accessToken = cookieStore.get('google_access_token');

    let driveResult = { success: false, message: 'No Google Drive token' };

    if (accessToken) {
      try {
        const driveService = new GoogleDriveService(accessToken.value);
        driveResult = await driveService.uploadInspection(inspectionData);
        console.log('Respaldo creado:', driveResult);
      } catch (driveError) {
        console.error('Error en respaldo:', driveError);
        driveResult = {
          success: false,
          message: 'Error al crear respaldo',
          error: driveError
        };
      }
    }

    const result = {
      ...inspectionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      driveBackup: driveResult
    };

    return NextResponse.json({
      success: true,
      data: result,
      driveBackup: driveResult
    });
  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json(
      { success: false, error: 'Error creating inspection' },
      { status: 500 }
    );
  }
}

// lib/services/email-service.js
// Servicio para enviar notificaciones por email

import nodemailer from 'nodemailer';
import { googleConfig } from '../google-config';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: googleConfig.email.host,
        port: googleConfig.email.port,
        secure: googleConfig.email.secure,
        auth: {
          user: googleConfig.email.user,
          pass: googleConfig.email.pass
        }
      });
      
      console.log('✅ Servicio de email configurado');
    } catch (error) {
      console.error('❌ Error configurando email:', error);
    }
  }

  // Enviar notificación de nueva tarea
  async sendTaskNotification(taskData) {
    const { assignedTo, taskName, dueDate, priority, description } = taskData;
    
    const mailOptions = {
      from: `"INSPECTEN" <${googleConfig.email.user}>`,
      to: assignedTo,
      subject: `Nueva Tarea Asignada: ${taskName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">INSPECTEN</h1>
            <p style="margin: 5px 0;">Sistema de Gestión de Inspecciones</p>
          </div>
          
          <div style="padding: 20px; background-color: #f3f4f6;">
            <h2 style="color: #111827;">Nueva Tarea Asignada</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">${taskName}</h3>
              
              <p><strong>Fecha de vencimiento:</strong> ${dueDate}</p>
              <p><strong>Prioridad:</strong> <span style="color: ${priority === 'Alta' ? '#dc2626' : priority === 'Media' ? '#f59e0b' : '#10b981'}">${priority}</span></p>
              
              ${description ? `<p><strong>Descripción:</strong><br>${description}</p>` : ''}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://inspect10.us/dashboard/tasks" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Ver Tarea
              </a>
            </div>
          </div>
          
          <div style="background-color: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 INSPECTEN. Todos los derechos reservados.</p>
          </div>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      return { success: false, error: error.message };
    }
  }

  // Enviar notificación de inspección programada
  async sendInspectionNotification(inspectionData) {
    const { clientEmail, propertyName, inspectorName, date, time, address } = inspectionData;
    
    const mailOptions = {
      from: `"INSPECTEN" <${googleConfig.email.user}>`,
      to: clientEmail,
      subject: `Inspección Programada - ${propertyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">INSPECTEN</h1>
            <p style="margin: 5px 0;">Sistema de Gestión de Inspecciones</p>
          </div>
          
          <div style="padding: 20px; background-color: #f3f4f6;">
            <h2 style="color: #111827;">Inspección Programada</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #dc2626; margin-top: 0;">${propertyName}</h3>
              
              <p><strong>Fecha:</strong> ${date}</p>
              <p><strong>Hora:</strong> ${time}</p>
              <p><strong>Inspector:</strong> ${inspectorName}</p>
              <p><strong>Dirección:</strong> ${address}</p>
            </div>
            
            <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #991b1b;">
                <strong>Importante:</strong> Por favor asegúrese de que la propiedad esté accesible en la fecha y hora indicadas.
              </p>
            </div>
          </div>
          
          <div style="background-color: #374151; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2024 INSPECTEN. Todos los derechos reservados.</p>
          </div>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Notificación de inspección enviada:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error enviando notificación:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();
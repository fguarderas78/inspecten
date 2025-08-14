// utils/dateFormatter.ts

/**
 * Formatea una fecha de manera consistente entre servidor y cliente
 * @param date - Fecha a formatear (string o Date)
 * @param format - Formato deseado ('short', 'long', 'time')
 * @returns Fecha formateada
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Validar fecha
  if (isNaN(dateObj.getTime())) return '';
  
  // Usar formato consistente sin depender del locale del sistema
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  switch (format) {
    case 'short':
      // Formato: DD/MM/YYYY
      return `${day}/${month}/${year}`;
      
    case 'long':
      // Formato: 19 de enero de 2024
      const months = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ];
      return `${day} de ${months[dateObj.getMonth()]} de ${year}`;
      
    case 'time':
      // Formato: DD/MM/YYYY HH:mm
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
      
    default:
      return `${day}/${month}/${year}`;
  }
}

/**
 * Formatea fecha relativa (ej: "Hace 2 días")
 */
export function formatRelativeDate(date: string | Date): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      if (diffMinutes < 5) return 'Hace un momento';
      return `Hace ${diffMinutes} minutos`;
    }
    if (diffHours === 1) return 'Hace 1 hora';
    return `Hace ${diffHours} horas`;
  }
  
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? 'Hace 1 semana' : `Hace ${weeks} semanas`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? 'Hace 1 mes' : `Hace ${months} meses`;
  }
  
  const years = Math.floor(diffDays / 365);
  return years === 1 ? 'Hace 1 año' : `Hace ${years} años`;
}

/**
 * Formatea el estado de una inspección
 */
export function getInspectionStatus(scheduledDate: string | Date): {
  status: 'overdue' | 'today' | 'upcoming' | 'completed';
  text: string;
  color: string;
} {
  const dateObj = typeof scheduledDate === 'string' ? new Date(scheduledDate) : scheduledDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateObj.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((dateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return {
      status: 'overdue',
      text: 'Vencida',
      color: '#ef4444'
    };
  } else if (diffDays === 0) {
    return {
      status: 'today',
      text: 'Hoy',
      color: '#f59e0b'
    };
  } else if (diffDays <= 7) {
    return {
      status: 'upcoming',
      text: `En ${diffDays} días`,
      color: '#3b82f6'
    };
  } else {
    return {
      status: 'upcoming',
      text: formatDate(dateObj, 'short'),
      color: '#6b7280'
    };
  }
}
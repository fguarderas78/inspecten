'use client'

import { useEffect, useState } from 'react'

interface ClientDateProps {
  date: string | Date
  format?: 'short' | 'long' | 'time'
}

export default function ClientDate({ date, format = 'short' }: ClientDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('')
  
  useEffect(() => {
    if (!date) return
    
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    // Validar fecha
    if (isNaN(dateObj.getTime())) {
      setFormattedDate('')
      return
    }
    
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    
    switch (format) {
      case 'short':
        setFormattedDate(`${day}/${month}/${year}`)
        break
        
      case 'long':
        const months = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ]
        setFormattedDate(`${day} de ${months[dateObj.getMonth()]} de ${year}`)
        break
        
      case 'time':
        const hours = dateObj.getHours().toString().padStart(2, '0')
        const minutes = dateObj.getMinutes().toString().padStart(2, '0')
        setFormattedDate(`${day}/${month}/${year} ${hours}:${minutes}`)
        break
        
      default:
        setFormattedDate(`${day}/${month}/${year}`)
    }
  }, [date, format])
  
  // Mostrar un placeholder mientras se carga
  if (!formattedDate) {
    return <span style={{ opacity: 0 }}>00/00/0000</span>
  }
  
  return <span>{formattedDate}</span>
}
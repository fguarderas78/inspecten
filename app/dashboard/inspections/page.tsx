'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Inspection {
  id: string
  code: string
  propertyId: string
  clientName: string
  clientEmail?: string
  type: string
  status: string
  progress: number
  inspectorId: string
  inspectorName: string
  scheduledDate: string
  completedDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
  googleDriveId?: string
}

export default function InspectionsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('all')
  const [showNewInspectionModal, setShowNewInspectionModal] = useState(false)
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null)
  const [showInspectionDetails, setShowInspectionDetails] = useState(false)
  const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null)
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [templateContent, setTemplateContent] = useState('')

  // Cargar inspecciones de la base de datos
  useEffect(() => {
    fetchInspections()
  }, [])

  const fetchInspections = async () => {
    try {
      const response = await fetch('/api/inspections')
      if (response.ok) {
        const data = await response.json()
        setInspections(data)
      }
    } catch (error) {
      console.error('Error al cargar inspecciones:', error)
    } finally {
      setLoading(false)
    }
  }

  // Función para generar la plantilla
  const generateTemplate = () => {
    if (!selectedInspection) return
    
    const template = `REPORTE DE INSPECCIÓN - ${selectedInspection.code}
=====================================

INFORMACIÓN GENERAL
==================
Código de Inspección: ${selectedInspection.code}
Fecha de Creación: ${formatDate(selectedInspection.createdAt)}
Estado Actual: ${getStatusText(selectedInspection.status)}
Progreso: ${selectedInspection.progress}%

DATOS DEL CLIENTE
=================
Nombre: ${selectedInspection.clientName}
Email: ${selectedInspection.clientEmail || 'No especificado'}
Teléfono: [Por completar]
Dirección: [Por completar]

INFORMACIÓN DE LA PROPIEDAD
===========================
ID de Propiedad: ${selectedInspection.propertyId}
Tipo de Propiedad: [Por completar]
Dirección: [Por completar]
Características: [Por completar]

DETALLES DE LA INSPECCIÓN
=========================
Tipo de Inspección: ${selectedInspection.type}
Inspector Asignado: ${selectedInspection.inspectorName}
Fecha Programada: ${formatDate(selectedInspection.scheduledDate)}
Fecha de Realización: ${selectedInspection.completedDate ? formatDate(selectedInspection.completedDate) : 'Pendiente'}

OBSERVACIONES INICIALES
=======================
${selectedInspection.notes || 'Sin observaciones iniciales'}

CHECKLIST DE INSPECCIÓN
=======================
[ ] Estructura exterior
[ ] Sistema eléctrico
[ ] Sistema de plomería
[ ] Techos y cubiertas
[ ] Ventanas y puertas
[ ] Sistemas de climatización
[ ] Áreas comunes
[ ] Seguridad y emergencias
[ ] Otros: _________________

HALLAZGOS Y OBSERVACIONES
=========================
1. [Describir hallazgo]
   - Ubicación: 
   - Severidad: 
   - Recomendación: 

2. [Describir hallazgo]
   - Ubicación: 
   - Severidad: 
   - Recomendación: 

RECOMENDACIONES
===============
- [Recomendación 1]
- [Recomendación 2]
- [Recomendación 3]

CONCLUSIONES
============
[Escribir las conclusiones generales de la inspección]

PRÓXIMOS PASOS
==============
1. [Acción requerida]
2. [Acción requerida]
3. [Acción requerida]

FIRMAS Y VALIDACIÓN
===================
Inspector: _________________________ Fecha: __________
           ${selectedInspection.inspectorName}

Cliente: ____________________________ Fecha: __________
         ${selectedInspection.clientName}

Supervisor: _________________________ Fecha: __________

---
Documento generado por INSPECTEN
Fecha de generación: ${new Date().toLocaleString('es-ES')}
`
    
    setTemplateContent(template)
  }

  // Función para guardar la plantilla y actualizar en Google Drive
  const handleSaveTemplate = async (inspection: Inspection) => {
    try {
      // Si ya existe un documento en Google Drive, actualizarlo
      if (inspection.googleDriveId) {
        // Aquí podrías implementar la actualización del documento
        // Por ahora solo mostramos un mensaje
        alert('Plantilla guardada. En producción, esto actualizaría el documento en Google Drive.')
      } else {
        // Si no existe, crear uno nuevo con la plantilla editada
        const response = await fetch(`/api/inspections/${inspection.id}/google-drive`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inspectionData: {
              code: inspection.code,
              clientName: inspection.clientName,
              clientEmail: inspection.clientEmail,
              type: inspection.type,
              inspectorName: inspection.inspectorName,
              propertyId: inspection.propertyId,
              scheduledDate: inspection.scheduledDate,
              status: inspection.status,
              notes: inspection.notes,
              progress: inspection.progress
            },
            customTemplate: templateContent // Enviar la plantilla personalizada
          })
        })
        
        if (response.ok) {
          const result = await response.json()
          alert('Documento creado en Google Drive con la plantilla personalizada!')
          
          // Actualizar la inspección con el ID del documento
          await fetch(`/api/inspections/${inspection.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              googleDriveId: result.googleDriveId
            }),
          })
          
          // Recargar inspecciones
          await fetchInspections()
          
          // Cambiar a la pestaña de información
          setShowTemplateEditor(false)
        }
      }
    } catch (error) {
      console.error('Error al guardar plantilla:', error)
      alert('Error al guardar la plantilla')
    }
  }
  
  // Función para crear/editar inspección en Google Drive
  const handleGoogleDriveEdit = async (inspection: Inspection) => {
    try {
      // Verificar si la inspección ya tiene un documento en Google Drive
      const response = await fetch(`/api/inspections/${inspection.id}/google-drive`, {
        method: 'GET'
      })
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.googleDriveId || inspection.googleDriveId) {
          // Si ya existe, abrir el documento
          const docId = data.googleDriveId || inspection.googleDriveId
          window.open(`https://docs.google.com/document/d/${docId}/edit`, '_blank')
        } else {
          // Si no existe, mostrar mensaje y cambiar a la pestaña de plantilla
          if (confirm('No existe un documento en Google Drive para esta inspección. ¿Deseas crear uno ahora?')) {
            setShowTemplateEditor(true)
            generateTemplate()
          }
        }
      }
    } catch (error) {
      console.error('Error con Google Drive:', error)
      alert('Error al conectar con Google Drive')
    }
  }

  // Función para descargar inspección como PDF
  const handleDownloadPDF = async (inspection: Inspection) => {
    try {
      const response = await fetch(`/api/inspections/${inspection.id}/pdf`, {
        method: 'GET',
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Inspeccion_${inspection.code}_${inspection.clientName.replace(/\s+/g, '_')}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Error al generar el PDF')
      }
    } catch (error) {
      console.error('Error al descargar PDF:', error)
      alert('Error al descargar el PDF')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      const formElement = e.currentTarget
      const formData = {
        propertyId: (formElement.elements.namedItem('property') as HTMLSelectElement).value,
        clientName: (formElement.elements.namedItem('clientName') as HTMLInputElement).value,
        clientEmail: (formElement.elements.namedItem('clientEmail') as HTMLInputElement)?.value || '',
        type: (formElement.elements.namedItem('type') as HTMLSelectElement).value,
        inspectorId: (formElement.elements.namedItem('inspector') as HTMLSelectElement).value,
        inspectorName: (formElement.elements.namedItem('inspector') as HTMLSelectElement).options[(formElement.elements.namedItem('inspector') as HTMLSelectElement).selectedIndex].text,
        scheduledDate: `${(formElement.elements.namedItem('date') as HTMLInputElement).value}T${(formElement.elements.namedItem('time') as HTMLInputElement).value}`,
        notes: (formElement.elements.namedItem('notes') as HTMLTextAreaElement)?.value || ''
      };

      // 1. Crear la inspección en la base de datos
      const response = await fetch('/api/inspections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newInspection = await response.json();
        
        // 2. Generar la plantilla para el nuevo documento
        const template = `REPORTE DE INSPECCIÓN - ${newInspection.code}
=====================================

INFORMACIÓN GENERAL
==================
Código de Inspección: ${newInspection.code}
Fecha de Creación: ${new Date().toLocaleDateString('es-ES')}
Estado Actual: Programada
Progreso: 0%

DATOS DEL CLIENTE
=================
Nombre: ${formData.clientName}
Email: ${formData.clientEmail || 'No especificado'}
Teléfono: [Por completar]
Dirección: [Por completar]

INFORMACIÓN DE LA PROPIEDAD
===========================
ID de Propiedad: ${formData.propertyId}
Tipo de Propiedad: [Por completar]
Dirección: [Por completar]
Características: [Por completar]

DETALLES DE LA INSPECCIÓN
=========================
Tipo de Inspección: ${formData.type}
Inspector Asignado: ${formData.inspectorName}
Fecha Programada: ${new Date(formData.scheduledDate).toLocaleDateString('es-ES')}
Hora Programada: ${new Date(formData.scheduledDate).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}

OBSERVACIONES INICIALES
=======================
${formData.notes || 'Sin observaciones iniciales'}

CHECKLIST DE INSPECCIÓN
=======================
[ ] Estructura exterior
[ ] Sistema eléctrico
[ ] Sistema de plomería
[ ] Techos y cubiertas
[ ] Ventanas y puertas
[ ] Sistemas de climatización
[ ] Áreas comunes
[ ] Seguridad y emergencias
[ ] Otros: _________________

[El resto del documento se completará durante la inspección]

---
Documento generado automáticamente por INSPECTEN
Fecha: ${new Date().toLocaleString('es-ES')}
`;
        
        // 3. Crear automáticamente el documento en Google Drive
        const googleDriveResponse = await fetch(`/api/inspections/${newInspection.id}/google-drive`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            inspectionData: {
              code: newInspection.code,
              clientName: formData.clientName,
              clientEmail: formData.clientEmail,
              type: formData.type,
              inspectorName: formData.inspectorName,
              propertyId: formData.propertyId,
              scheduledDate: formData.scheduledDate,
              status: 'programada',
              notes: formData.notes,
              progress: 0
            },
            customTemplate: template
          })
        });
        
        if (googleDriveResponse.ok) {
          const googleDoc = await googleDriveResponse.json();
          console.log('Documento creado en Google Drive:', googleDoc.googleDriveId);
          
          // 4. Actualizar la inspección con el ID de Google Drive
          await fetch(`/api/inspections/${newInspection.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              googleDriveId: googleDoc.googleDriveId
            }),
          });
          
          alert(`✅ Inspección ${newInspection.code} creada exitosamente!\n📄 Documento creado en Google Drive`);
        } else {
          // Si falla Google Drive, aún así la inspección se creó
          alert(`⚠️ Inspección ${newInspection.code} creada, pero hubo un error al crear el documento en Google Drive.`);
        }
        
        setShowNewInspectionModal(false);
        fetchInspections(); // Recargar la lista
      } else {
        throw new Error('Error al crear inspección');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la inspección. Por favor intenta de nuevo.');
    }
  }

  const viewInspectionDetails = (inspection: Inspection) => {
    setSelectedInspection(inspection)
    setShowInspectionDetails(true)
    setActiveActionMenu(null)
  }

  const handleClickOutside = () => {
    setActiveActionMenu(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completada': return '#10b981'
      case 'en_proceso': return '#f59e0b'
      case 'programada': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completada': return 'Completada'
      case 'en_proceso': return 'En Proceso'
      case 'programada': return 'Programada'
      default: return status
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  // Filtrado
  const filteredInspections = inspections.filter(inspection => {
    const matchesSearch = 
      inspection.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.inspectorName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || inspection.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        fontSize: '18px',
        color: '#6b7280'
      }}>
        Cargando inspecciones...
      </div>
    )
  }

  return (
    <div onClick={handleClickOutside}>
      {/* Header */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px'
          }}>
            Inspecciones
          </h1>
          <p style={{ color: '#6b7280' }}>
            Total: {inspections.length} inspecciones
          </p>
        </div>
        <button
          onClick={() => setShowNewInspectionModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>+</span> Nueva Inspección
        </button>
      </div>

      {/* Filtros */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 200px',
          gap: '16px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder="Buscar por código, cliente o inspector..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="completada">Completadas</option>
            <option value="en_proceso">En Proceso</option>
            <option value="programada">Programadas</option>
          </select>
        </div>
      </div>

      {/* Lista de Inspecciones Simplificada */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Encabezados */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 150px 120px 120px 80px',
          padding: '12px 20px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          fontSize: '13px',
          fontWeight: '600',
          color: '#374151'
        }}>
          <div>Código</div>
          <div>Cliente</div>
          <div>Inspector</div>
          <div>Fecha</div>
          <div>Estado</div>
          <div>Acciones</div>
        </div>

        {/* Filas */}
        {filteredInspections.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            No se encontraron inspecciones
          </div>
        ) : (
          filteredInspections.map((inspection, index) => (
            <div
              key={inspection.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 150px 120px 120px 80px',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: index < filteredInspections.length - 1 ? '1px solid #e5e7eb' : 'none',
                fontSize: '14px',
                transition: 'background-color 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white'
              }}
            >
              <div style={{ fontWeight: '600', color: '#111827' }}>
                {inspection.code}
              </div>
              <div style={{ color: '#374151' }}>
                {inspection.clientName}
              </div>
              <div style={{ color: '#6b7280' }}>
                {inspection.inspectorName}
              </div>
              <div style={{ color: '#6b7280' }}>
                {formatDate(inspection.scheduledDate)}
              </div>
              <div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: `${getStatusColor(inspection.status)}20`,
                  color: getStatusColor(inspection.status)
                }}>
                  {getStatusText(inspection.status)}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => viewInspectionDetails(inspection)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: '#374151'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  Detalles
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nueva Inspección */}
      {showNewInspectionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setShowNewInspectionModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '24px',
              color: '#111827'
            }}>
              Nueva Inspección
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Propiedad
                </label>
                <select
                  name="property"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Seleccionar propiedad</option>
                  <option value="1">Casa Mediterránea - Av. Principal 123</option>
                  <option value="2">Edificio Central - Centro Comercial</option>
                  <option value="3">Villa Los Pinos - Urbanización Norte</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Cliente
                </label>
                <input
                  name="clientName"
                  type="text"
                  required
                  placeholder="Nombre del cliente"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Email del Cliente (Opcional)
                </label>
                <input
                  name="clientEmail"
                  type="email"
                  placeholder="cliente@email.com"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Tipo de Inspección
                </label>
                <select
                  name="type"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="general">Inspección General</option>
                  <option value="preventiva">Inspección Preventiva</option>
                  <option value="correctiva">Inspección Correctiva</option>
                  <option value="seguridad">Inspección de Seguridad</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Fecha
                  </label>
                  <input
                    name="date"
                    type="date"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Hora
                  </label>
                  <input
                    name="time"
                    type="time"
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Inspector Asignado
                </label>
                <select
                  name="inspector"
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Seleccionar inspector</option>
                  <option value="1">Carlos Rodríguez</option>
                  <option value="2">Ana Martínez</option>
                  <option value="3">Pedro Sánchez</option>
                  <option value="4">Francisco Guarderas</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Notas (Opcional)
                </label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Agregar notas o instrucciones especiales..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowNewInspectionModal(false)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Crear Inspección
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detalles de Inspección */}
      {showInspectionDetails && selectedInspection && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => {
          setShowInspectionDetails(false)
          setShowTemplateEditor(false)
        }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '32px',
              borderRadius: '12px',
              width: '90%',
              maxWidth: showTemplateEditor ? '800px' : '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              transition: 'max-width 0.3s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '24px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {selectedInspection.code}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Creada: {formatDate(selectedInspection.createdAt)}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowInspectionDetails(false)
                  setShowTemplateEditor(false)
                }}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            {/* Tabs para alternar entre detalles y editor */}
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #e5e7eb',
              marginBottom: '24px'
            }}>
              <button
                onClick={() => setShowTemplateEditor(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: !showTemplateEditor ? '2px solid #dc2626' : '2px solid transparent',
                  color: !showTemplateEditor ? '#dc2626' : '#6b7280',
                  fontWeight: !showTemplateEditor ? '600' : '400',
                  cursor: 'pointer',
                  marginBottom: '-2px',
                  transition: 'all 0.2s'
                }}
              >
                Información
              </button>
              <button
                onClick={() => {
                  setShowTemplateEditor(true)
                  generateTemplate()
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: showTemplateEditor ? '2px solid #dc2626' : '2px solid transparent',
                  color: showTemplateEditor ? '#dc2626' : '#6b7280',
                  fontWeight: showTemplateEditor ? '600' : '400',
                  cursor: 'pointer',
                  marginBottom: '-2px',
                  transition: 'all 0.2s'
                }}
              >
                Plantilla del Documento
              </button>
            </div>

            {/* Contenido según el tab seleccionado */}
            {!showTemplateEditor ? (
              // Vista de información (tu código actual)
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '20px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '12px'
                  }}>
                    Información General
                  </h3>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px'
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Cliente:</span>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: '4px 0' }}>
                        {selectedInspection.clientName}
                      </p>
                      {selectedInspection.clientEmail && (
                        <p style={{ fontSize: '13px', color: '#6b7280' }}>{selectedInspection.clientEmail}</p>
                      )}
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Inspector:</span>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: '4px 0' }}>
                        {selectedInspection.inspectorName}
                      </p>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Tipo de Inspección:</span>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: '4px 0' }}>
                        {selectedInspection.type}
                      </p>
                    </div>
                    <div>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Propiedad ID:</span>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: '4px 0' }}>
                        {selectedInspection.propertyId}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '12px'
                  }}>
                    Estado y Fechas
                  </h3>
                  <div style={{
                    backgroundColor: '#f9fafb',
                    padding: '16px',
                    borderRadius: '8px'
                  }}>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Estado:</span>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '13px',
                          fontWeight: '500',
                          backgroundColor: `${getStatusColor(selectedInspection.status)}20`,
                          color: getStatusColor(selectedInspection.status)
                        }}>
                          {getStatusText(selectedInspection.status)}
                        </span>
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Fecha Programada:</span>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: '4px 0' }}>
                        {formatDate(selectedInspection.scheduledDate)}
                      </p>
                    </div>
                    {selectedInspection.completedDate && (
                      <div>
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Fecha Completada:</span>
                        <p style={{ fontSize: '15px', fontWeight: '500', color: '#111827', margin: '4px 0' }}>
                          {formatDate(selectedInspection.completedDate)}
                        </p>
                      </div>
                    )}
                    <div style={{ marginTop: '16px' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Progreso:</span>
                      <div style={{ marginTop: '8px' }}>
                        <div style={{
                          backgroundColor: '#e5e7eb',
                          height: '8px',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${selectedInspection.progress}%`,
                            height: '100%',
                            backgroundColor: getStatusColor(selectedInspection.status),
                            transition: 'width 0.3s ease'
                          }} />
                        </div>
                        <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                          {selectedInspection.progress}% completado
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedInspection.notes && (
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '12px'
                    }}>
                      Notas
                    </h3>
                    <div style={{
                      backgroundColor: '#f9fafb',
                      padding: '16px',
                      borderRadius: '8px'
                    }}>
                      <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                        {selectedInspection.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Vista del editor de plantilla
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Plantilla del Documento
                  </h3>
                  <button
                    onClick={generateTemplate}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f3f4f6',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      color: '#374151'
                    }}
                  >
                    Regenerar Plantilla
                  </button>
                </div>
                
                <textarea
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '400px',
                    padding: '16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    lineHeight: '1.6',
                    resize: 'vertical'
                  }}
                />
                
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'start'
                }}>
                  <span style={{ fontSize: '16px' }}>💡</span>
                  <div style={{ fontSize: '13px', color: '#92400e' }}>
                    <strong>Tip:</strong> Esta plantilla se usará para crear/actualizar el documento en Google Drive. 
                    Puedes editarla antes de guardar los cambios.
                  </div>
                </div>
              </div>
            )}

            {/* Acciones */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'space-between',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                {showTemplateEditor ? (
                  <button
                    onClick={() => handleSaveTemplate(selectedInspection)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#dc2626',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                      <polyline points="17 21 17 13 7 13 7 21"/>
                      <polyline points="7 3 7 8 15 8"/>
                    </svg>
                    Guardar Plantilla
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleGoogleDriveEdit(selectedInspection)}
                      style={{
                        padding: '10px 20px',
                        border: '1px solid #3b82f6',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        color: '#3b82f6',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#3b82f6'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.color = '#3b82f6'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                      {selectedInspection.googleDriveId ? 'Abrir en Google Drive' : 'Crear en Google Drive'}
                    </button>
                    
                    <button
                      onClick={() => handleDownloadPDF(selectedInspection)}
                      style={{
                        padding: '10px 20px',
                        border: '1px solid #10b981',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        color: '#10b981',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#10b981'
                        e.currentTarget.style.color = 'white'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white'
                        e.currentTarget.style.color = '#10b981'
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Descargar PDF
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => {
                  setShowInspectionDetails(false)
                  setShowTemplateEditor(false)
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
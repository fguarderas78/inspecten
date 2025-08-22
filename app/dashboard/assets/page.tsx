'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Property {
  id: number
  name: string
  address: string
  template: string
  clientName: string
  clientEmail: string
  clientPhone: string
  status: 'active' | 'inactive'
  lastInspection: string
  nextInspection: string
  inspections: number
  createdAt: string
}

interface Template {
  id: number
  name: string
  category: string
}

export default function AssetsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTemplate, setFilterTemplate] = useState('all')
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  // Templates/Formularios disponibles
  const templates: Template[] = [
    { id: 1, name: 'Inspección Residencial Completa', category: 'Residencial' },
    { id: 2, name: 'Inspección Comercial Básica', category: 'Comercial' },
    { id: 3, name: 'Evaluación Industrial', category: 'Industrial' },
    { id: 4, name: 'Checklist de Seguridad', category: 'Seguridad' },
    { id: 5, name: 'Inspección Pre-Venta', category: 'Residencial' },
    { id: 6, name: 'Evaluación Post-Construcción', category: 'Construcción' }
  ]

  // Estado para las propiedades con datos iniciales
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      name: 'Torre Alfa - Piso 12',
      address: 'Av. Principal 123, Guayaquil',
      template: 'Inspección Residencial Completa',
      clientName: 'María García',
      clientEmail: 'maria.garcia@email.com',
      clientPhone: '0991234567',
      status: 'active',
      lastInspection: '2024-01-15',
      nextInspection: '2024-02-15',
      inspections: 8,
      createdAt: '2023-06-15'
    },
    {
      id: 2,
      name: 'Edificio Central',
      address: 'Calle 9 de Octubre 456',
      template: 'Inspección Comercial Básica',
      clientName: 'Juan Pérez',
      clientEmail: 'juan.perez@empresa.com',
      clientPhone: '0998765432',
      status: 'active',
      lastInspection: '2024-01-10',
      nextInspection: '2024-02-10',
      inspections: 12,
      createdAt: '2023-03-20'
    }
  ])

  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    template: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    status: 'active' as 'active' | 'inactive'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingProperty) {
      // Actualizar propiedad existente
      setProperties(properties.map(prop => 
        prop.id === editingProperty.id 
          ? { ...prop, ...formData }
          : prop
      ))
    } else {
      // Crear nueva propiedad
      const newProperty: Property = {
        id: properties.length + 1,
        ...formData,
        lastInspection: '-',
        nextInspection: '-',
        inspections: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setProperties([...properties, newProperty])
    }
    
    // Resetear formulario y cerrar modal
    setFormData({
      name: '',
      address: '',
      template: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      status: 'active'
    })
    setShowNewPropertyModal(false)
    setEditingProperty(null)
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
    setFormData({
      name: property.name,
      address: property.address,
      template: property.template,
      clientName: property.clientName,
      clientEmail: property.clientEmail,
      clientPhone: property.clientPhone,
      status: property.status
    })
    setShowNewPropertyModal(true)
  }

  const handleNewInspection = (propertyId: number) => {
    router.push(`/dashboard/inspections/new?property=${propertyId}`)
  }

  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterTemplate === 'all' || property.template === filterTemplate
    
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Propiedades
        </h1>
        <p style={{ color: '#6b7280' }}>
          Gestiona las propiedades y sus inspecciones
        </p>
      </div>

      {/* Filters and Actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, dirección o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '300px'
            }}
          />
          <select
            value={filterTemplate}
            onChange={(e) => setFilterTemplate(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="all">Todos los formularios</option>
            {templates.map(template => (
              <option key={template.id} value={template.name}>{template.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowNewPropertyModal(true)}
          style={{
            padding: '8px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          + Nueva Propiedad
        </button>
      </div>

      {/* Properties Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Propiedad
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Cliente
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Formulario
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Inspecciones
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Estado
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Próxima Inspección
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property, index) => (
              <tr 
                key={property.id}
                style={{ 
                  borderBottom: index < filteredProperties.length - 1 ? '1px solid #e5e7eb' : 'none',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <td style={{ padding: '16px' }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                      {property.name}
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280' }}>
                      {property.address}
                    </p>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <div>
                    <p style={{ color: '#111827', marginBottom: '2px' }}>
                      {property.clientName}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>
                      {property.clientEmail}
                    </p>
                    <p style={{ fontSize: '13px', color: '#6b7280' }}>
                      {property.clientPhone}
                    </p>
                  </div>
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    fontSize: '14px',
                    padding: '4px 8px',
                    backgroundColor: '#fef2f2',
                    color: '#dc2626',
                    borderRadius: '4px',
                    display: 'inline-block'
                  }}>
                    {property.template}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold',
                    color: property.inspections > 0 ? '#10b981' : '#6b7280'
                  }}>
                    {property.inspections}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: property.status === 'active' ? '#d1fae5' : '#e5e7eb',
                    color: property.status === 'active' ? '#065f46' : '#6b7280'
                  }}>
                    {property.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '14px', color: '#111827' }}>
                    {property.nextInspection}
                  </p>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={() => handleNewInspection(property.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Nueva Inspección
                    </button>
                    <button
                      onClick={() => handleEdit(property)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'white',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New/Edit Property Modal */}
      {showNewPropertyModal && (
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
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '32px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
              {editingProperty ? 'Editar Propiedad' : 'Nueva Propiedad'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              {/* Información de la Propiedad */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                  Información de la Propiedad
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Nombre de la Propiedad *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Formulario de Inspección *
                  </label>
                  <select
                    name="template"
                    value={formData.template}
                    onChange={handleInputChange}
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
                    <option value="">Selecciona un formulario...</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.name}>
                        {template.name} ({template.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Información del Cliente */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#374151' }}>
                  Información del Cliente
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Email del Cliente *
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
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

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Teléfono del Cliente *
                  </label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
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

              {/* Estado */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewPropertyModal(false)
                    setEditingProperty(null)
                    setFormData({
                      name: '',
                      address: '',
                      template: '',
                      clientName: '',
                      clientEmail: '',
                      clientPhone: '',
                      status: 'active'
                    })
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
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
                    padding: '10px 20px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  {editingProperty ? 'Guardar Cambios' : 'Crear Propiedad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
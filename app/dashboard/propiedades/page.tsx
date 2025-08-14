'use client'

import { useState, useEffect } from 'react'
import { theme } from '@/lib/theme'
import NewPropertyForm from '@/components/NewPropertyForm'

interface Property {
  id: string
  name: string
  type: string
  address: string
  owner: string
  ownerEmail: string
  inspector?: string
  status: 'active' | 'inactive' | 'maintenance'
  lastInspection?: string
  nextInspection?: string
  value?: number
  monthlyRent?: number
  area?: number
  image?: string
}

export default function AssetsPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [showNewProperty, setShowNewProperty] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)

  // Datos de ejemplo
  useEffect(() => {
    const sampleProperties: Property[] = [
      {
        id: '1',
        name: 'Torre Alfa - Piso 12',
        type: 'commercial',
        address: 'Av. Principal 123, Guayaquil',
        owner: 'Empresa ABC S.A.',
        ownerEmail: 'contacto@empresaabc.com',
        inspector: 'Carlos Mendez',
        status: 'active',
        lastInspection: '2024-01-10',
        nextInspection: '2024-02-10',
        value: 350000,
        monthlyRent: 2500,
        area: 250
      },
      {
        id: '2',
        name: 'Edificio Central',
        type: 'residential',
        address: 'Calle Secundaria 456, Guayaquil',
        owner: 'Juan Pérez',
        ownerEmail: 'juan.perez@email.com',
        inspector: 'Ana García',
        status: 'active',
        lastInspection: '2024-01-05',
        nextInspection: '2024-02-05',
        value: 180000,
        monthlyRent: 1200,
        area: 120
      },
      {
        id: '3',
        name: 'Local Comercial 45',
        type: 'commercial',
        address: 'Plaza Norte 789, Guayaquil',
        owner: 'María López',
        ownerEmail: 'maria.lopez@email.com',
        status: 'maintenance',
        lastInspection: '2023-12-15',
        nextInspection: '2024-03-15',
        value: 95000,
        monthlyRent: 800,
        area: 80
      },
      {
        id: '4',
        name: 'Bodega Industrial Norte',
        type: 'industrial',
        address: 'Km 10.5 Vía Daule, Guayaquil',
        owner: 'Importadora XYZ',
        ownerEmail: 'gerencia@importadoraxyz.com',
        inspector: 'Roberto Silva',
        status: 'active',
        lastInspection: '2024-01-15',
        nextInspection: '2024-02-15',
        value: 450000,
        monthlyRent: 3500,
        area: 800
      }
    ]

    setProperties(sampleProperties)
    setFilteredProperties(sampleProperties)
  }, [])

  // Filtrar propiedades
  useEffect(() => {
    let filtered = properties

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.owner.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(property => property.type === filterType)
    }

    // Filtro por estado
    if (filterStatus !== 'all') {
      filtered = filtered.filter(property => property.status === filterStatus)
    }

    setFilteredProperties(filtered)
  }, [searchTerm, filterType, filterStatus, properties])

  // Manejar nueva propiedad
  const handleNewProperty = (newProperty: any) => {
    const property: Property = {
      id: newProperty.id,
      name: newProperty.name,
      type: newProperty.type,
      address: `${newProperty.address.street} ${newProperty.address.number}, ${newProperty.address.city}`,
      owner: newProperty.owner.name,
      ownerEmail: newProperty.owner.email,
      inspector: newProperty.inspection.inspectorName,
      status: 'active',
      lastInspection: newProperty.inspection.lastInspectionDate,
      nextInspection: newProperty.inspection.nextInspectionDate,
      value: newProperty.pricing.currentValue,
      monthlyRent: newProperty.pricing.monthlyRent,
      area: newProperty.details.area
    }

    setProperties([...properties, property])
  }

  // Estadísticas
  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    totalValue: properties.reduce((sum, p) => sum + (p.value || 0), 0),
    monthlyIncome: properties.reduce((sum, p) => sum + (p.monthlyRent || 0), 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return theme.colors.success
      case 'inactive': return theme.colors.gray[400]
      case 'maintenance': return theme.colors.warning
      default: return theme.colors.gray[400]
    }
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      residential: 'Residencial',
      commercial: 'Comercial',
      industrial: 'Industrial',
      office: 'Oficina',
      land: 'Terreno'
    }
    return types[type] || type
  }

  return (
    <div>
      {/* Header con estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xl
      }}>
        <div style={{
          backgroundColor: theme.colors.background.paper,
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.sm,
          borderLeft: `4px solid ${theme.colors.primary.main}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.secondary,
                marginBottom: '4px'
              }}>
                Total Propiedades
              </p>
              <p style={{
                fontSize: '28px',
                fontWeight: '600',
                color: theme.colors.text.primary,
                margin: 0
              }}>
                {stats.total}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: theme.colors.primary.main + '20',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={theme.colors.primary.main}>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: theme.colors.background.paper,
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.sm,
          borderLeft: `4px solid ${theme.colors.success}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.secondary,
                marginBottom: '4px'
              }}>
                Propiedades Activas
              </p>
              <p style={{
                fontSize: '28px',
                fontWeight: '600',
                color: theme.colors.text.primary,
                margin: 0
              }}>
                {stats.active}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: theme.colors.success + '20',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={theme.colors.success}>
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: theme.colors.background.paper,
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.sm,
          borderLeft: `4px solid ${theme.colors.info}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.secondary,
                marginBottom: '4px'
              }}>
                Valor Total
              </p>
              <p style={{
                fontSize: '28px',
                fontWeight: '600',
                color: theme.colors.text.primary,
                margin: 0
              }}>
                ${stats.totalValue.toLocaleString()}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: theme.colors.info + '20',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={theme.colors.info}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1.93.66 1.64 2.08 1.64 1.51 0 2.1-.59 2.1-1.43 0-.73-.41-1.21-2.15-1.61-2.05-.47-3.31-1.28-3.31-2.91 0-1.53 1.16-2.62 2.96-2.96V6h2.67v1.46c1.47.29 2.7 1.23 2.85 3.01h-1.97c-.12-.8-.66-1.39-1.9-1.39-1.31 0-1.91.53-1.91 1.29 0 .68.41 1.08 2.14 1.49 2.03.46 3.34 1.22 3.34 3.08.01 1.71-1.26 2.79-3.11 3.15z"/>
              </svg>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: theme.colors.background.paper,
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.sm,
          borderLeft: `4px solid ${theme.colors.warning}`
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{
                fontSize: theme.typography.caption.fontSize,
                color: theme.colors.text.secondary,
                marginBottom: '4px'
              }}>
                Ingreso Mensual
              </p>
              <p style={{
                fontSize: '28px',
                fontWeight: '600',
                color: theme.colors.text.primary,
                margin: 0
              }}>
                ${stats.monthlyIncome.toLocaleString()}
              </p>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: theme.colors.warning + '20',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={theme.colors.warning}>
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de herramientas */}
      <div style={{
        backgroundColor: theme.colors.background.paper,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.sm,
        marginBottom: theme.spacing.lg
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: theme.spacing.md
        }}>
          {/* Búsqueda y filtros */}
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
            flex: 1,
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative', minWidth: '300px' }}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={theme.colors.gray[500]}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <input
                type="text"
                placeholder="Buscar por nombre, dirección o propietario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: `1px solid ${theme.colors.gray[300]}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: '14px',
                  outline: 'none',
                  transition: theme.transitions.fast
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.primary.main
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.gray[300]
                }}
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '10px 16px',
                border: `1px solid ${theme.colors.gray[300]}`,
                borderRadius: theme.borderRadius.md,
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">Todos los tipos</option>
              <option value="residential">Residencial</option>
              <option value="commercial">Comercial</option>
              <option value="industrial">Industrial</option>
              <option value="office">Oficina</option>
              <option value="land">Terreno</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '10px 16px',
                border: `1px solid ${theme.colors.gray[300]}`,
                borderRadius: theme.borderRadius.md,
                fontSize: '14px',
                backgroundColor: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>

          {/* Acciones */}
          <div style={{
            display: 'flex',
            gap: theme.spacing.md,
            alignItems: 'center'
          }}>
            {/* Toggle vista */}
            <div style={{
              display: 'flex',
              backgroundColor: theme.colors.gray[100],
              borderRadius: theme.borderRadius.md,
              padding: '4px'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  color: viewMode === 'grid' ? theme.colors.primary.main : theme.colors.gray[600],
                  transition: theme.transitions.fast
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
                </svg>
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 12px',
                  backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                  border: 'none',
                  borderRadius: theme.borderRadius.sm,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '14px',
                  color: viewMode === 'list' ? theme.colors.primary.main : theme.colors.gray[600],
                  transition: theme.transitions.fast
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
                Lista
              </button>
            </div>

            <button
              onClick={() => setShowNewProperty(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: theme.colors.primary.main,
                color: 'white',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: theme.transitions.fast
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary.dark
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.primary.main
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Nueva Propiedad
            </button>
          </div>
        </div>
      </div>

      {/* Vista de propiedades */}
      {filteredProperties.length === 0 ? (
        <div style={{
          backgroundColor: theme.colors.background.paper,
          padding: theme.spacing.xxl,
          borderRadius: theme.borderRadius.lg,
          textAlign: 'center',
          boxShadow: theme.shadows.sm
        }}>
          <p style={{ fontSize: '18px', color: theme.colors.text.secondary, marginBottom: '8px' }}>
            No se encontraron propiedades
          </p>
          <p style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Crea una nueva propiedad para comenzar'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: theme.spacing.lg
        }}>
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              style={{
                backgroundColor: theme.colors.background.paper,
                borderRadius: theme.borderRadius.lg,
                boxShadow: theme.shadows.sm,
                overflow: 'hidden',
                transition: theme.transitions.normal,
                cursor: 'pointer'
              }}
              onClick={() => {
                setSelectedProperty(property)
                setShowPropertyDetails(true)
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = theme.shadows.md
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = theme.shadows.sm
              }}
            >
              {/* Imagen */}
              <div style={{
                height: '200px',
                backgroundColor: theme.colors.gray[100],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <span style={{ fontSize: '64px', color: theme.colors.gray[400] }}>
                  {property.type === 'residential' ? '🏠' :
                   property.type === 'commercial' ? '🏢' :
                   property.type === 'industrial' ? '🏭' :
                   property.type === 'office' ? '🏛️' : '🏗️'}
                </span>
                
                {/* Badge de estado */}
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 12px',
                  backgroundColor: 'white',
                  borderRadius: theme.borderRadius.pill,
                  fontSize: '12px',
                  fontWeight: '500',
                  color: getStatusColor(property.status),
                  border: `1px solid ${getStatusColor(property.status)}30`
                }}>
                  {property.status === 'active' ? 'Activo' :
                   property.status === 'inactive' ? 'Inactivo' : 'Mantenimiento'}
                </span>
              </div>

              {/* Contenido */}
              <div style={{ padding: theme.spacing.lg }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: theme.colors.text.primary,
                  margin: '0 0 8px 0'
                }}>
                  {property.name}
                </h3>

                <p style={{
                  fontSize: '14px',
                  color: theme.colors.text.secondary,
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {property.address}
                </p>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: theme.colors.primary.main + '20',
                    color: theme.colors.primary.dark,
                    borderRadius: theme.borderRadius.pill,
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {getTypeLabel(property.type)}
                  </span>

                  {property.monthlyRent && (
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: theme.colors.text.primary
                    }}>
                      ${property.monthlyRent.toLocaleString()}/mes
                    </span>
                  )}
                </div>

                <div style={{
                  paddingTop: '12px',
                  borderTop: `1px solid ${theme.colors.gray[200]}`,
                  fontSize: '13px',
                  color: theme.colors.text.secondary
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Propietario:</span>
                    <span style={{ fontWeight: '500', color: theme.colors.text.primary }}>
                      {property.owner}
                    </span>
                  </div>
                  {property.inspector && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Inspector:</span>
                      <span style={{ fontWeight: '500', color: theme.colors.text.primary }}>
                        {property.inspector}
                      </span>
                    </div>
                  )}
                </div>

                {/* Acciones rápidas */}
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginTop: '16px'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Nueva inspección para:', property.name)
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: theme.colors.primary.main,
                      color: 'white',
                      border: 'none',
                      borderRadius: theme.borderRadius.md,
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: theme.transitions.fast
                    }}
                  >
                    Nueva Inspección
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Ver detalles de:', property.name)
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'white',
                      color: theme.colors.primary.main,
                      border: `1px solid ${theme.colors.primary.main}`,
                      borderRadius: theme.borderRadius.md,
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: theme.transitions.fast
                    }}
                  >
                    Ver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Vista de lista
        <div style={{
          backgroundColor: theme.colors.background.paper,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.sm,
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: theme.colors.gray[50] }}>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.colors.text.secondary }}>
                  PROPIEDAD
                </th>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.colors.text.secondary }}>
                  DIRECCIÓN
                </th>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.colors.text.secondary }}>
                  PROPIETARIO
                </th>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.colors.text.secondary }}>
                  TIPO
                </th>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.colors.text.secondary }}>
                  ESTADO
                </th>
                <th style={{ padding: theme.spacing.md, textAlign: 'left', fontSize: '13px', fontWeight: '600', color: theme.colors.text.secondary }}>
                  VALOR
                </th>
                <th style={{ padding: theme.spacing.md, textAlign: 'center', fontSize: '13px', fontWeight: '600', color: theme.colors.text.secondary }}>
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property, index) => (
                <tr
                  key={property.id}
                  style={{
                    borderBottom: index < filteredProperties.length - 1 ? `1px solid ${theme.colors.gray[200]}` : 'none',
                    cursor: 'pointer',
                    transition: theme.transitions.fast
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.gray[50]
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => {
                    setSelectedProperty(property)
                    setShowPropertyDetails(true)
                  }}
                >
                  <td style={{ padding: theme.spacing.md }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '500', color: theme.colors.text.primary, margin: 0 }}>
                        {property.name}
                      </p>
                      {property.area && (
                        <p style={{ fontSize: '12px', color: theme.colors.text.secondary, margin: '2px 0 0 0' }}>
                          {property.area} m²
                        </p>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: theme.spacing.md, fontSize: '14px', color: theme.colors.text.secondary }}>
                    {property.address}
                  </td>
                  <td style={{ padding: theme.spacing.md }}>
                    <div>
                      <p style={{ fontSize: '14px', color: theme.colors.text.primary, margin: 0 }}>
                        {property.owner}
                      </p>
                      <p style={{ fontSize: '12px', color: theme.colors.text.secondary, margin: '2px 0 0 0' }}>
                        {property.ownerEmail}
                      </p>
                    </div>
                  </td>
                  <td style={{ padding: theme.spacing.md }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      backgroundColor: theme.colors.primary.main + '20',
                      color: theme.colors.primary.dark,
                      borderRadius: theme.borderRadius.pill,
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {getTypeLabel(property.type)}
                    </span>
                  </td>
                  <td style={{ padding: theme.spacing.md }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      backgroundColor: getStatusColor(property.status) + '20',
                      color: getStatusColor(property.status),
                      borderRadius: theme.borderRadius.pill,
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      <span style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: getStatusColor(property.status),
                        borderRadius: '50%'
                      }}></span>
                      {property.status === 'active' ? 'Activo' :
                       property.status === 'inactive' ? 'Inactivo' : 'Mantenimiento'}
                    </span>
                  </td>
                  <td style={{ padding: theme.spacing.md, fontSize: '14px', fontWeight: '500', color: theme.colors.text.primary }}>
                    ${property.value?.toLocaleString() || '---'}
                  </td>
                  <td style={{ padding: theme.spacing.md, textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log('Acciones para:', property.name)
                      }}
                      style={{
                        padding: '6px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: theme.colors.gray[600],
                        borderRadius: theme.borderRadius.sm,
                        transition: theme.transitions.fast
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.gray[100]
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de nueva propiedad */}
      {showNewProperty && (
        <NewPropertyForm
          onClose={() => setShowNewProperty(false)}
          onSave={handleNewProperty}
        />
      )}
    </div>
  )
}'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PropiedadesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState('list') // list o grid
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false)

  // Datos de ejemplo
  const properties = [
    {
      id: 1,
      name: 'Torre Alfa - Piso 12',
      type: 'Residencial',
      address: 'Av. Principal 123, Guayaquil',
      owner: 'Juan Pérez',
      status: 'active',
      lastInspection: '2024-01-15',
      nextInspection: '2024-02-15',
      inspector: 'Carlos Mendez',
      area: '120 m²',
      value: '$85,000'
    },
    {
      id: 2,
      name: 'Casa Los Ceibos',
      type: 'Residencial',
      address: 'Calle 5ta #234, Los Ceibos',
      owner: 'María García',
      status: 'active',
      lastInspection: '2024-01-10',
      nextInspection: '2024-02-10',
      inspector: 'Ana López',
      area: '250 m²',
      value: '$180,000'
    },
    {
      id: 3,
      name: 'Oficina Centro',
      type: 'Comercial',
      address: 'Edificio Trade Center, Piso 8',
      owner: 'Roberto Silva',
      status: 'active',
      lastInspection: '2023-12-20',
      nextInspection: '2024-01-20',
      inspector: 'Pedro Ruiz',
      area: '85 m²',
      value: '$120,000'
    },
    {
      id: 4,
      name: 'Local Comercial Mall',
      type: 'Comercial',
      address: 'Mall del Sol, Local 45',
      owner: 'Carmen Díaz',
      status: 'inactive',
      lastInspection: '2023-11-30',
      nextInspection: '-',
      inspector: 'Carlos Mendez',
      area: '60 m²',
      value: '$95,000'
    },
    {
      id: 5,
      name: 'Bodega Industrial Norte',
      type: 'Industrial',
      address: 'Km 12 Via Daule',
      owner: 'Luis Martínez',
      status: 'active',
      lastInspection: '2024-01-05',
      nextInspection: '2024-02-05',
      inspector: 'Ana López',
      area: '500 m²',
      value: '$250,000'
    },
    {
      id: 6,
      name: 'Departamento Vista Mar',
      type: 'Residencial',
      address: 'Malecón 2000, Torre B',
      owner: 'Ana Rodríguez',
      status: 'active',
      lastInspection: '2024-01-12',
      nextInspection: '2024-02-12',
      inspector: 'Pedro Ruiz',
      area: '95 m²',
      value: '$110,000'
    }
  ]

  // Filtrar propiedades
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.owner.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || property.type === filterType
    
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10b981' : '#6b7280'
  }

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Activo' : 'Inactivo'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Residencial': return '#3b82f6'
      case 'Comercial': return '#f59e0b'
      case 'Industrial': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  // Función para formatear fechas
  const formatDate = (date: string): string => {
    if (!date || date === '-') return '-'
    const dateObj = new Date(date)
    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#111827',
          marginBottom: '8px'
        }}>
          Propiedades
        </h1>
        <p style={{ color: '#6b7280' }}>
          Gestiona todas las propiedades registradas en el sistema
        </p>
      </div>

      {/* Barra de herramientas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
          {/* Búsqueda */}
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Buscar por nombre, dirección o propietario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <svg
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#9ca3af'
              }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filtro por tipo */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: 'white',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="all">Todos los tipos</option>
            <option value="Residencial">Residencial</option>
            <option value="Comercial">Comercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Toggle vista */}
          <div style={{
            display: 'flex',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '6px 12px',
                backgroundColor: viewMode === 'list' ? '#dc2626' : 'white',
                color: viewMode === 'list' ? 'white' : '#6b7280',
                border: 'none',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
              </svg>
              Lista
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '6px 12px',
                backgroundColor: viewMode === 'grid' ? '#dc2626' : 'white',
                color: viewMode === 'grid' ? 'white' : '#6b7280',
                border: 'none',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
              Grid
            </button>
          </div>

          {/* Botón nueva propiedad */}
          <button
            onClick={() => setShowNewPropertyModal(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '18px' }}>+</span>
            Nueva Propiedad
          </button>
        </div>
      </div>

      {/* Vista de Lista */}
      {viewMode === 'list' && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {/* Encabezados de tabla */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 2fr 1fr 1fr 1fr 1fr 100px',
            padding: '12px 20px',
            backgroundColor: '#f9fafb',
            borderBottom: '1px solid #e5e7eb',
            fontSize: '13px',
            fontWeight: '600',
            color: '#374151'
          }}>
            <div>Propiedad</div>
            <div>Tipo</div>
            <div>Dirección</div>
            <div>Propietario</div>
            <div>Área</div>
            <div>Última Insp.</div>
            <div>Estado</div>
            <div>Acciones</div>
          </div>

          {/* Filas de datos */}
          {filteredProperties.map((property, index) => (
            <div
              key={property.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 2fr 1fr 1fr 1fr 1fr 100px',
                padding: '12px 20px',
                borderBottom: index < filteredProperties.length - 1 ? '1px solid #f3f4f6' : 'none',
                fontSize: '14px',
                alignItems: 'center',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ fontWeight: '500', color: '#111827' }}>
                {property.name}
              </div>
              
              <div>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: `${getTypeColor(property.type)}20`,
                  color: getTypeColor(property.type)
                }}>
                  {property.type}
                </span>
              </div>
              
              <div style={{ 
                color: '#6b7280',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {property.address}
              </div>
              
              <div style={{ color: '#6b7280' }}>
                {property.owner}
              </div>
              
              <div style={{ color: '#6b7280' }}>
                {property.area}
              </div>
              
              <div style={{ color: '#6b7280' }}>
                {formatDate(property.lastInspection)}
              </div>
              
              <div>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: `${getStatusColor(property.status)}20`,
                  color: getStatusColor(property.status)
                }}>
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(property.status)
                  }} />
                  {getStatusText(property.status)}
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/dashboard/inspections?propertyId=${property.id}`)
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                  title="Nueva inspección"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Aquí iría la lógica de editar
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                  title="Editar"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Menú de más opciones
                  }}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                  title="Más opciones"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista de Grid */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '20px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '4px'
                }}>
                  {property.name}
                </h3>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: `${getTypeColor(property.type)}20`,
                  color: getTypeColor(property.type)
                }}>
                  {property.type}
                </span>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                  {property.address}
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280' }}>
                  Propietario: <span style={{ color: '#374151', fontWeight: '500' }}>{property.owner}</span>
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '16px',
                fontSize: '13px'
              }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Área:</span>
                  <span style={{ color: '#374151', marginLeft: '4px', fontWeight: '500' }}>{property.area}</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Valor:</span>
                  <span style={{ color: '#374151', marginLeft: '4px', fontWeight: '500' }}>{property.value}</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Última insp:</span>
                  <span style={{ color: '#374151', marginLeft: '4px' }}>{formatDate(property.lastInspection)}</span>
                </div>
                <div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: `${getStatusColor(property.status)}20`,
                    color: getStatusColor(property.status)
                  }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: getStatusColor(property.status)
                    }} />
                    {getStatusText(property.status)}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                paddingTop: '12px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/dashboard/inspections?propertyId=${property.id}`)
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Nueva Inspección
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Ver detalles
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje si no hay propiedades */}
      {filteredProperties.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <svg
            style={{
              width: '48px',
              height: '48px',
              margin: '0 auto 16px',
              color: '#9ca3af'
            }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>
            No se encontraron propiedades
          </p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Intenta cambiar los filtros o agregar una nueva propiedad
          </p>
        </div>
      )}

      {/* Modal de nueva propiedad (placeholder) */}
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              Nueva Propiedad
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              Aquí iría el formulario para agregar una nueva propiedad
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowNewPropertyModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowNewPropertyModal(false)}
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
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
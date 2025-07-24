'use client'

import { useState } from 'react'

export default function PresupuestosPage() {
  const [presupuestos, setPresupuestos] = useState([
    {
      id: 1,
      codigo: 'PRES-2024-001',
      cliente: 'María García',
      propiedad: 'Casa Los Pinos',
      fecha: '2024-01-15',
      monto: 2500,
      estado: 'Aprobado',
      items: 4
    },
    {
      id: 2,
      codigo: 'PRES-2024-002',
      cliente: 'Carlos Mendoza',
      propiedad: 'Edificio Central',
      fecha: '2024-01-14',
      monto: 4800,
      estado: 'Pendiente',
      items: 6
    },
    {
      id: 3,
      codigo: 'PRES-2024-003',
      cliente: 'Ana Rodríguez',
      propiedad: 'Local Comercial Norte',
      fecha: '2024-01-13',
      monto: 1800,
      estado: 'Enviado',
      items: 3
    }
  ])

  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('todos')

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Aprobado': return '#10b981'
      case 'Pendiente': return '#f59e0b'
      case 'Enviado': return '#3b82f6'
      case 'Rechazado': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const filteredPresupuestos = presupuestos.filter(presupuesto => {
    const matchesSearch = presupuesto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         presupuesto.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         presupuesto.propiedad.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterEstado === 'todos' || presupuesto.estado === filterEstado
    return matchesSearch && matchesFilter
  })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Presupuestos
        </h1>
        <p style={{ color: '#6b7280' }}>Gestiona cotizaciones y presupuestos de inspecciones</p>
      </div>

      {/* Estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Total Presupuestos</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>{presupuestos.length}</p>
          <p style={{ fontSize: '12px', color: '#10b981' }}>+12% este mes</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Monto Total</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>
            ${presupuestos.reduce((sum, p) => sum + p.monto, 0).toLocaleString()}
          </p>
          <p style={{ fontSize: '12px', color: '#10b981' }}>+18% este mes</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Tasa Conversión</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827' }}>68%</p>
          <p style={{ fontSize: '12px', color: '#10b981' }}>+5% este mes</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Pendientes</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}>
            {presupuestos.filter(p => p.estado === 'Pendiente').length}
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>Por aprobar</p>
        </div>
      </div>

      {/* Controles */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', flex: 1 }}>
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar por código, cliente o propiedad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '300px'
            }}
          />

          {/* Filtro de Estado */}
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="todos">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Enviado">Enviado</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        {/* Botón Nuevo */}
        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ➕ Nuevo Presupuesto
        </button>
      </div>

      {/* Lista de Presupuestos */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Código
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Cliente
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Propiedad
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Fecha
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Items
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Monto
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Estado
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPresupuestos.map((presupuesto) => (
              <tr key={presupuesto.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>
                  {presupuesto.codigo}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                  {presupuesto.cliente}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                  {presupuesto.propiedad}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>
                  {new Date(presupuesto.fecha).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', color: '#374151' }}>
                  {presupuesto.items}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>
                  ${presupuesto.monto.toLocaleString()}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: `${getEstadoColor(presupuesto.estado)}20`,
                    color: getEstadoColor(presupuesto.estado)
                  }}>
                    {presupuesto.estado}
                  </span>
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'transparent',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      👁️ Ver
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'transparent',
                        color: '#10b981',
                        border: '1px solid #10b981',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      📧 Enviar
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'transparent',
                        color: '#6b7280',
                        border: '1px solid #6b7280',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      📄 PDF
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPresupuestos.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No se encontraron presupuestos
          </div>
        )}
      </div>

      {/* Modal Nuevo Presupuesto */}
      {showModal && (
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
            padding: '32px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
              Nuevo Presupuesto
            </h2>

            <form>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  Cliente
                </label>
                <input
                  type="text"
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

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  Propiedad
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Seleccionar propiedad</option>
                  <option value="1">Casa Los Pinos</option>
                  <option value="2">Edificio Central</option>
                  <option value="3">Local Comercial Norte</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  Tipo de Inspección
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="general">Inspección General</option>
                  <option value="compra">Pre-compra</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="seguro">Para Seguro</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  Validez (días)
                </label>
                <input
                  type="number"
                  defaultValue="30"
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
                  Notas
                </label>
                <textarea
                  rows={3}
                  placeholder="Notas adicionales..."
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

              {/* Items del Presupuesto */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                  Items del Presupuesto
                </h3>
                <div style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  padding: '16px'
                }}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                      <input
                        type="text"
                        placeholder="Descripción del servicio"
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Cantidad"
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                      <input
                        type="number"
                        placeholder="Precio"
                        style={{
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    + Agregar Item
                  </button>
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
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
                  Crear Presupuesto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
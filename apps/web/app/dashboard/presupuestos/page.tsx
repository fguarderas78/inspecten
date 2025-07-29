'use client'

import { useState } from 'react'

export default function PresupuestosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const presupuestos = [
    {
      id: 1,
      code: 'PRES-001',
      client: 'María García',
      property: 'Casa Cumbayá',
      amount: 450.00,
      status: 'Aprobado',
      date: '2024-01-15',
      validUntil: '2024-02-15'
    },
    {
      id: 2,
      code: 'PRES-002',
      client: 'Juan Pérez',
      property: 'Oficina Centro',
      amount: 1200.00,
      status: 'Pendiente',
      date: '2024-01-18',
      validUntil: '2024-02-18'
    },
    {
      id: 3,
      code: 'PRES-003',
      client: 'Ana López',
      property: 'Local Comercial',
      amount: 850.00,
      status: 'Rechazado',
      date: '2024-01-10',
      validUntil: '2024-02-10'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprobado': return '#10b981'
      case 'Pendiente': return '#f59e0b'
      case 'Rechazado': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const filteredPresupuestos = presupuestos.filter(presupuesto => {
    const matchesSearch = 
      presupuesto.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      presupuesto.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      presupuesto.property.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || presupuesto.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
          Presupuestos
        </h1>
        <p style={{ color: '#6b7280' }}>
          Gestiona y da seguimiento a los presupuestos de inspección
        </p>
      </div>

      {/* Barra de herramientas */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar por código, cliente o propiedad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              width: '300px',
              fontSize: '14px'
            }}
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>

        <button
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
            gap: '8px'
          }}
        >
          + Nuevo Presupuesto
        </button>
      </div>

      {/* Tabla de presupuestos */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>
                Código
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>
                Cliente
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>
                Propiedad
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>
                Monto
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>
                Estado
              </th>
              <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>
                Válido hasta
              </th>
              <th style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151', textTransform: 'uppercase' }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPresupuestos.map((presupuesto) => (
              <tr key={presupuesto.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '500' }}>
                  {presupuesto.code}
                </td>
                <td style={{ padding: '16px', fontSize: '14px' }}>
                  {presupuesto.client}
                </td>
                <td style={{ padding: '16px', fontSize: '14px' }}>
                  {presupuesto.property}
                </td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>
                  ${presupuesto.amount.toFixed(2)}
                </td>
                <td style={{ padding: '16px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: `${getStatusColor(presupuesto.status)}20`,
                    color: getStatusColor(presupuesto.status)
                  }}>
                    {presupuesto.status}
                  </span>
                </td>
                <td style={{ padding: '16px', fontSize: '14px' }}>
                  {new Date(presupuesto.validUntil).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Ver
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Editar
                    </button>
                    {presupuesto.status === 'Pendiente' && (
                      <button
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        Aprobar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Estadísticas */}
      <div style={{
        marginTop: '32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Total Presupuestado
          </h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
            $2,500.00
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Presupuestos Aprobados
          </h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
            1
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
            Pendientes de Aprobación
          </h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
            1
          </p>
        </div>
      </div>
    </div>
  )
}
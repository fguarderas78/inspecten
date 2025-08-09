'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, CheckCircle, Camera, FileText, Users, Clock, Shield, Phone, Mail, MapPin } from 'lucide-react'

export default function Page() {
  const [activeService, setActiveService] = useState(0)

  const SERVICES = useMemo(
    () => [
      { 
        key: 'homes', 
        title: 'Inspecciones de Hogares', 
        desc: 'Evaluación integral de vivienda incluyendo techo, estructura, instalaciones, humedad, seguridad y más. Informe detallado con fotos y prioridades de reparación.',
        icon: '🏠',
        features: ['Evaluación de estructura', 'Sistemas eléctricos', 'Plomería', 'HVAC', 'Seguridad']
      },
      { 
        key: 'commercial', 
        title: 'Inspecciones Comerciales', 
        desc: 'Auditoría técnica de locales, oficinas y bodegas. Verificación de sistemas críticos y cumplimiento básico para operación segura.',
        icon: '🏢',
        features: ['Sistemas contra incendios', 'Accesibilidad', 'Códigos de construcción', 'Seguridad ocupacional', 'Instalaciones']
      },
      { 
        key: 'construction', 
        title: 'Inspección de Obras', 
        desc: 'Visitas de obra con checklists por disciplina, avance físico, control de calidad y desvíos respecto a planos y especificaciones.',
        icon: '🧱',
        features: ['Control de calidad', 'Seguimiento de cronograma', 'Cumplimiento de especificaciones', 'Documentación fotográfica']
      },
      { 
        key: 'oversight', 
        title: 'Fiscalización de Construcción', 
        desc: 'Supervisión de contratistas, control documental, seguimiento de NC/observaciones y bitácora fotográfica trazable.',
        icon: '📝',
        features: ['Supervisión técnica', 'Control documental', 'Gestión de observaciones', 'Bitácora digital']
      },
      { 
        key: 'fleet', 
        title: 'Inspección de Vehículos', 
        desc: 'Checklist de seguridad, estado mecánico y estética con evidencia fotográfica y reportes comparables en el tiempo.',
        icon: '🚗',
        features: ['Estado mecánico', 'Seguridad vehicular', 'Documentación', 'Historial de mantenimiento']
      },
      { 
        key: 'land', 
        title: 'Inspección de Terrenos', 
        desc: 'Levantamiento visual de riesgos, accesos, cercos, drenajes, edificaciones existentes y servicios disponibles.',
        icon: '🌳',
        features: ['Análisis topográfico', 'Servicios disponibles', 'Riesgos ambientales', 'Accesibilidad']
      },
    ],
    []
  )

  const FEATURES = [
    { 
      icon: <FileText className="w-8 h-8" />,
      title: 'Reportes Visuales y Claros', 
      desc: 'Informes estructurados por secciones con fotografías de alta calidad, marcas explicativas y recomendaciones prioritarias. Exportable a PDF/Word para decisiones rápidas.' 
    },
    { 
      icon: <Camera className="w-8 h-8" />,
      title: 'App Móvil de Campo', 
      desc: 'Checklists inteligentes, captura de fotos y notas de voz, firma digital y sincronización automática en la nube para equipos de trabajo.' 
    },
    { 
      icon: <Clock className="w-8 h-8" />,
      title: 'Trazabilidad Completa', 
      desc: 'Historial detallado por activo o propiedad, seguimiento de correcciones implementadas y KPIs por proyecto, sede o flota vehicular.' 
    },
    { 
      icon: <Users className="w-8 h-8" />,
      title: 'Plantillas Personalizables', 
      desc: 'Formularios adaptados a tu operación específica: viviendas, retail, obra civil, MEP, seguridad industrial o gestión de flotas.' 
    },
  ]

  const STATS = []

  const STEPS = [
    { 
      number: '01', 
      title: 'Agenda tu Inspección', 
      desc: 'Cuéntanos el tipo de servicio requerido y la ubicación. Coordinamos fecha, hora y condiciones de acceso.' 
    },
    { 
      number: '02', 
      title: 'Inspección Profesional', 
      desc: 'Nuestro equipo realiza una evaluación técnica completa con checklist especializado y registro fotográfico organizado.' 
    },
    { 
      number: '03', 
      title: 'Informe Detallado', 
      desc: 'Recibes un reporte digital claro con hallazgos categorizados, prioridades de acción y recomendaciones específicas.' 
    },
  ]

  return (
    <main className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-red-600">INSPECTEN</div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#servicios" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Servicios</a>
              <a href="#caracteristicas" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Características</a>
              <a href="#proceso" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Proceso</a>
              <a href="#contacto" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Contacto</a>
            </nav>
            <a href="mailto:info@inspecten.com" className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors font-medium">
              Solicitar Información
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background gradients */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Inspecciones <span className="text-red-600">Profesionales</span> para su Tranquilidad
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Próximamente estaremos detectando problemas antes de que sean costosos. Informes claros con fotografías de alta calidad, 
                recomendaciones técnicas y prioridades de acción. Especializados en hogares, comercios, obras, flotas y más.
              </p>
              
              {/* Coming Soon Message */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-10">
                <div className="flex items-center justify-center text-red-700">
                  <Shield className="w-6 h-6 mr-3" />
                  <span className="text-lg font-semibold">Próximamente en Ecuador - ¡Solicita información!</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="mailto:info@inspecten.com" className="bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-colors font-semibold text-lg inline-flex items-center justify-center">
                  Solicitar Información
                  <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {SERVICES.slice(0, 4).map((service, index) => (
                    <motion.div 
                      key={service.key}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                    >
                      <div className="text-4xl mb-3">{service.icon}</div>
                      <h3 className="font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{service.desc.slice(0, 80)}...</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="servicios" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Servicios</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ofrecemos servicios especializados de inspección para diferentes sectores, 
              adaptándonos a las necesidades específicas de cada cliente.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {SERVICES.map((service, index) => (
              <motion.div 
                key={service.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="caracteristicas" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir INSPECTEN?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestra tecnología avanzada y experiencia profesional nos permiten 
              ofrecer el mejor servicio de inspección del mercado.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS SECTION */}
      <section id="proceso" className="py-20 bg-gradient-to-br from-red-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestro Proceso</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un proceso simple y eficiente que garantiza resultados de calidad en cada inspección.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg h-full">
                  <div className="text-6xl font-bold text-red-600 mb-4">{step.number}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-red-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              ¿Listo para conocer más sobre nuestros servicios?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Contáctanos hoy y descubre por qué seremos la opción preferida 
              para inspecciones profesionales en todo el país.
            </p>
            <a href="mailto:info@inspecten.com" className="bg-white text-red-600 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors font-semibold text-lg inline-flex items-center">
              Solicitar Información Gratuita
              <ChevronRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contacto" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Contacto</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Próximamente estaremos listos para ayudarte con tus inspecciones. 
                Contáctanos y mantente informado sobre nuestro lanzamiento.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-red-500 mr-4" />
                  <span className="text-gray-300">+593 (09) 1234-5678</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-red-500 mr-4" />
                  <span className="text-gray-300">info@inspecten.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-red-500 mr-4" />
                  <span className="text-gray-300">Guayaquil, Ecuador</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Solicita Información</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Nombre" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                  />
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                  />
                </div>
                <input 
                  type="tel" 
                  placeholder="Teléfono" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                />
                <select className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-red-500 focus:outline-none">
                  <option>Tipo de Inspección de Interés</option>
                  <option>Inspección de Hogar</option>
                  <option>Inspección Comercial</option>
                  <option>Inspección de Obra</option>
                  <option>Fiscalización</option>
                  <option>Inspección de Vehículos</option>
                  <option>Inspección de Terrenos</option>
                </select>
                <textarea 
                  placeholder="Mensaje (opcional)" 
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none resize-none"
                ></textarea>
                <a 
                  href="mailto:info@inspecten.com"
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold text-center block"
                >
                  Enviar Solicitud
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold text-red-600 mb-4 md:mb-0">INSPECTEN</div>
            <div className="text-gray-400 text-center md:text-right">
              <p>© 2025 INSPECTEN. Todos los derechos reservados.</p>
              <p className="mt-1">Inspecciones profesionales para su tranquilidad.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
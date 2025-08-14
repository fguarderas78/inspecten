// lib/theme.ts
// Sistema de diseño completo para INSPECTEN

export const theme = {
  // Colores principales
  colors: {
    // Primarios
    primary: {
      main: '#00BFA5',      // Verde turquesa (principal)
      light: '#5DF2D6',     
      dark: '#00897B',
      contrast: '#FFFFFF'
    },
    // Secundarios
    secondary: {
      main: '#FF1744',      // Rosa/Rojo para acciones
      light: '#FF5983',
      dark: '#C4001D',
      contrast: '#FFFFFF'
    },
    // Grises
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121'
    },
    // Estados
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#F44336',
    info: '#2196F3',
    // Fondos
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
      dark: '#263238'
    },
    // Texto
    text: {
      primary: '#263238',
      secondary: '#546E7A',
      disabled: '#90A4AE',
      hint: '#B0BEC5'
    }
  },

  // Tipografía
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.5px'
    },
    h2: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.3px'
    },
    h3: {
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.4
    },
    body1: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5
    },
    body2: {
      fontSize: '13px',
      fontWeight: 400,
      lineHeight: 1.5
    },
    button: {
      fontSize: '14px',
      fontWeight: 500,
      letterSpacing: '0.5px',
      textTransform: 'none'
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: 1.5
    }
  },

  // Espaciado
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },

  // Bordes
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    pill: '9999px'
  },

  // Sombras
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
  },

  // Transiciones
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out'
  }
}

// Componentes base estilizados
export const components = {
  // Botón primario
  primaryButton: {
    padding: '10px 20px',
    backgroundColor: theme.colors.primary.main,
    color: theme.colors.primary.contrast,
    border: 'none',
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
    fontFamily: theme.typography.fontFamily,
    letterSpacing: theme.typography.button.letterSpacing,
    cursor: 'pointer',
    transition: theme.transitions.fast,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    '&:hover': {
      backgroundColor: theme.colors.primary.dark
    }
  },

  // Botón secundario
  secondaryButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: theme.colors.primary.main,
    border: `1px solid ${theme.colors.gray[300]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.button.fontSize,
    fontWeight: theme.typography.button.fontWeight,
    fontFamily: theme.typography.fontFamily,
    cursor: 'pointer',
    transition: theme.transitions.fast,
    '&:hover': {
      backgroundColor: theme.colors.gray[50],
      borderColor: theme.colors.primary.main
    }
  },

  // Card
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.sm,
    padding: theme.spacing.lg,
    border: `1px solid ${theme.colors.gray[200]}`,
    transition: theme.transitions.normal
  },

  // Input
  input: {
    width: '100%',
    padding: '10px 14px',
    border: `1px solid ${theme.colors.gray[300]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.body1.fontSize,
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.colors.background.paper,
    transition: theme.transitions.fast,
    outline: 'none',
    '&:focus': {
      borderColor: theme.colors.primary.main,
      boxShadow: `0 0 0 3px ${theme.colors.primary.main}20`
    }
  },

  // Badge
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: theme.borderRadius.pill,
    fontSize: theme.typography.caption.fontSize,
    fontWeight: 500,
    fontFamily: theme.typography.fontFamily
  },

  // Tabla
  table: {
    width: '100%',
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    boxShadow: theme.shadows.sm
  }
}

// Estilos globales
export const globalStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.body1.fontSize};
    line-height: ${theme.typography.body1.lineHeight};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.default};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-family: ${theme.typography.fontFamily};
    color: ${theme.colors.text.primary};
  }

  p {
    margin: 0;
  }

  a {
    color: ${theme.colors.primary.main};
    text-decoration: none;
    transition: ${theme.transitions.fast};
  }

  a:hover {
    color: ${theme.colors.primary.dark};
  }

  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.gray[100]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray[400]};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.gray[500]};
  }

  /* Animaciones */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Utilidades */
  .fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
  }

  /* Focus visible */
  :focus-visible {
    outline: 2px solid ${theme.colors.primary.main};
    outline-offset: 2px;
  }

  /* Selección de texto */
  ::selection {
    background-color: ${theme.colors.primary.main};
    color: white;
  }
`

// Hook para usar el tema
export const useTheme = () => theme

// Funciones auxiliares
export const getStatusColor = (status: string) => {
  const statusColors = {
    scheduled: theme.colors.info,
    'in-progress': theme.colors.warning,
    completed: theme.colors.success,
    cancelled: theme.colors.error,
    pending: theme.colors.gray[500]
  }
  return statusColors[status] || theme.colors.gray[500]
}

export const getPriorityColor = (priority: string) => {
  const priorityColors = {
    urgent: theme.colors.error,
    high: theme.colors.warning,
    normal: theme.colors.info,
    low: theme.colors.success
  }
  return priorityColors[priority] || theme.colors.gray[500]
}
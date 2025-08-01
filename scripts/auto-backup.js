// auto-backup.js
// Sistema de respaldo automático para INSPECTEN
// Detecta cambios y los sube automáticamente a GitHub

const chokidar = require('chokidar');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');

// Configuración
const CONFIG = {
  // Intervalo mínimo entre commits (en milisegundos)
  COMMIT_INTERVAL: 60000, // 1 minuto
  
  // Archivos y carpetas a ignorar
  IGNORE_PATTERNS: [
    'node_modules/**',
    '.git/**',
    '.next/**',
    '*.log',
    '.env.local',
    '.DS_Store',
    'npm-debug.log*',
    'yarn-debug.log*',
    'yarn-error.log*'
  ],
  
  // Colores para la consola
  COLORS: {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
  }
};

// Inicializar git
const git = simpleGit();

// Variables de control
let lastCommitTime = 0;
let pendingChanges = new Set();
let commitTimer = null;

// Funciones de utilidad
const log = {
  info: (msg) => console.log(`${CONFIG.COLORS.blue}ℹ${CONFIG.COLORS.reset}  ${msg}`),
  success: (msg) => console.log(`${CONFIG.COLORS.green}✓${CONFIG.COLORS.reset}  ${msg}`),
  warning: (msg) => console.log(`${CONFIG.COLORS.yellow}⚠${CONFIG.COLORS.reset}  ${msg}`),
  error: (msg) => console.log(`${CONFIG.COLORS.red}✗${CONFIG.COLORS.reset}  ${msg}`),
  change: (msg) => console.log(`${CONFIG.COLORS.cyan}◆${CONFIG.COLORS.reset}  ${msg}`)
};

// Función para hacer commit y push
async function commitAndPush() {
  const now = Date.now();
  
  // Verificar intervalo mínimo
  if (now - lastCommitTime < CONFIG.COMMIT_INTERVAL) {
    log.warning('Esperando intervalo mínimo entre commits...');
    scheduleCommit();
    return;
  }
  
  try {
    // Verificar si hay cambios
    const status = await git.status();
    
    if (status.files.length === 0) {
      log.info('No hay cambios para respaldar');
      pendingChanges.clear();
      return;
    }
    
    // Preparar mensaje de commit
    const filesChanged = Array.from(pendingChanges).slice(0, 5);
    const moreFiles = pendingChanges.size > 5 ? ` y ${pendingChanges.size - 5} más` : '';
    const commitMessage = `Auto-backup: ${filesChanged.join(', ')}${moreFiles} - ${new Date().toLocaleString('es-EC')}`;
    
    // Hacer commit
    await git.add('.');
    await git.commit(commitMessage);
    
    log.success(`Commit realizado: ${status.files.length} archivos`);
    
    // Hacer push
    await git.push();
    log.success('Respaldo subido a GitHub ✓');
    log.info('inspect10.us se actualizará en unos segundos...');
    
    // Actualizar tiempo y limpiar cambios
    lastCommitTime = now;
    pendingChanges.clear();
    
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      log.info('No hay cambios nuevos');
    } else if (error.message.includes('not a git repository')) {
      log.error('Error: Esta carpeta no es un repositorio Git');
      log.info('Ejecuta primero: git init');
      process.exit(1);
    } else if (error.message.includes('no upstream branch')) {
      log.error('Error: No hay rama remota configurada');
      log.info('Ejecuta primero: git push -u origin main');
    } else {
      log.error(`Error al respaldar: ${error.message}`);
    }
  }
}

// Programar commit
function scheduleCommit() {
  // Cancelar timer anterior si existe
  if (commitTimer) {
    clearTimeout(commitTimer);
  }
  
  // Programar nuevo commit
  const delay = Math.max(CONFIG.COMMIT_INTERVAL - (Date.now() - lastCommitTime), 5000);
  commitTimer = setTimeout(commitAndPush, delay);
}

// Función principal
async function startAutoBackup() {
  console.log(`
${CONFIG.COLORS.bright}${CONFIG.COLORS.cyan}
╔═══════════════════════════════════════╗
║   🚀 AUTO-BACKUP INSPECTEN ACTIVO 🚀  ║
╚═══════════════════════════════════════╝
${CONFIG.COLORS.reset}`);
  
  // Verificar que estamos en un repositorio Git
  try {
    await git.status();
    log.success('Repositorio Git detectado');
  } catch (error) {
    log.error('No se encontró repositorio Git');
    log.info('Inicializa Git primero con: git init');
    process.exit(1);
  }
  
  // Verificar conexión remota
  try {
    const remotes = await git.getRemotes(true);
    if (remotes.length > 0) {
      log.success(`Conectado a: ${remotes[0].refs.push}`);
    } else {
      log.warning('No hay repositorio remoto configurado');
      log.info('Configura uno con: git remote add origin [URL]');
    }
  } catch (error) {
    log.warning('No se pudo verificar el remoto');
  }
  
  log.info('Vigilando cambios en el proyecto...');
  log.info(`Intervalo de respaldo: ${CONFIG.COMMIT_INTERVAL / 1000} segundos`);
  console.log('');
  
  // Configurar watcher
  const watcher = chokidar.watch('.', {
    ignored: CONFIG.IGNORE_PATTERNS,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });
  
  // Eventos del watcher
  watcher
    .on('add', (filePath) => {
      log.change(`Archivo creado: ${filePath}`);
      pendingChanges.add(filePath);
      scheduleCommit();
    })
    .on('change', (filePath) => {
      log.change(`Archivo modificado: ${filePath}`);
      pendingChanges.add(filePath);
      scheduleCommit();
    })
    .on('unlink', (filePath) => {
      log.change(`Archivo eliminado: ${filePath}`);
      pendingChanges.add(filePath);
      scheduleCommit();
    })
    .on('error', (error) => {
      log.error(`Error del watcher: ${error}`);
    });
  
  // Manejar salida del programa
  process.on('SIGINT', () => {
    console.log('\n');
    log.info('Cerrando auto-backup...');
    
    if (pendingChanges.size > 0) {
      log.warning(`${pendingChanges.size} cambios pendientes de respaldar`);
      log.info('Realizando último respaldo...');
      commitAndPush().then(() => {
        process.exit(0);
      });
    } else {
      log.success('Auto-backup cerrado correctamente');
      process.exit(0);
    }
  });
}

// Verificar si se está ejecutando directamente
if (require.main === module) {
  startAutoBackup();
}

module.exports = { startAutoBackup };
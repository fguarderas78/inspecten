// cleanup-inspecten.js
// Script para limpiar y reorganizar la estructura de INSPECTEN
// Ejecutar desde: C:\Users\coguc\Documents\GitHub\inspecten

const fs = require('fs');
const path = require('path');

console.log('🧹 Iniciando limpieza y reorganización de INSPECTEN...\n');

// Rutas principales
const rootDir = process.cwd();
const duplicateDir = path.join(rootDir, 'inspecten');

// 1. Verificar si existe la carpeta duplicada
if (fs.existsSync(duplicateDir)) {
    console.log('⚠️  Encontrada estructura duplicada en /inspecten/inspecten/');
    
    // Archivos importantes a preservar de la estructura duplicada
    const filesToPreserve = [
        'apps/web/app/dashboard/page.tsx',
        'apps/web/app/dashboard/layout.tsx',
        'apps/web/app/dashboard/assets/page.tsx',
        'apps/web/app/dashboard/inspections/page.tsx',
        'apps/web/app/dashboard/tasks/page.tsx',
        'apps/web/app/dashboard/schedules/page.tsx',
        'apps/web/app/dashboard/users/page.tsx',
        'apps/web/app/dashboard/checklists/page.tsx',
        'apps/web/app/dashboard/settings/page.tsx',
        'apps/web/app/dashboard/propiedades/page.tsx',
        'apps/web/app/dashboard/presupuestos/page.tsx',
        'apps/web/app/dashboard/dashboard-components.tsx'
    ];

    console.log('\n📦 Copiando archivos del dashboard...');
    
    filesToPreserve.forEach(file => {
        const sourcePath = path.join(duplicateDir, file);
        const destPath = path.join(rootDir, 'app', file.replace('apps/web/app/', ''));
        
        if (fs.existsSync(sourcePath)) {
            // Crear directorio si no existe
            const destDir = path.dirname(destPath);
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            
            // Copiar archivo
            try {
                fs.copyFileSync(sourcePath, destPath);
                console.log(`✅ Copiado: ${file}`);
            } catch (error) {
                console.log(`❌ Error copiando: ${file}`);
            }
        } else {
            console.log(`⏭️  No encontrado: ${file}`);
        }
    });
}

// 2. Crear estructura de carpetas faltantes
console.log('\n📁 Verificando estructura de carpetas...');

const requiredFolders = [
    'app',
    'app/dashboard',
    'app/dashboard/assets',
    'app/dashboard/inspections',
    'app/dashboard/tasks',
    'app/dashboard/schedules',
    'app/dashboard/users',
    'app/dashboard/checklists',
    'app/dashboard/settings',
    'app/dashboard/propiedades',
    'app/dashboard/presupuestos',
    'app/components',
    'public',
    'lib',
    'scripts'
];

requiredFolders.forEach(folder => {
    const folderPath = path.join(rootDir, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`✅ Creada carpeta: ${folder}`);
    } else {
        console.log(`✓ Ya existe: ${folder}`);
    }
});

// 3. Limpiar carpetas innecesarias
console.log('\n🗑️  Limpiando carpetas innecesarias...');

const foldersToClean = [
    'app/login',  // Login debe estar en app/page.tsx
    'apps',       // Carpeta no necesaria
    'inspecten/apps/web/.next', // Build cache duplicado
];

foldersToClean.forEach(folder => {
    const folderPath = path.join(rootDir, folder);
    if (fs.existsSync(folderPath)) {
        console.log(`🗑️  Marcado para eliminar: ${folder}`);
        // No eliminamos automáticamente por seguridad
        // fs.rmSync(folderPath, { recursive: true, force: true });
    }
});

// 4. Crear archivo de respaldo de la estructura
console.log('\n💾 Creando respaldo de la estructura actual...');

const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const backupFileName = `estructura-backup-${timestamp}.txt`;

function getDirectoryTree(dir, prefix = '') {
    let tree = '';
    const items = fs.readdirSync(dir);
    
    items.forEach((item, index) => {
        const itemPath = path.join(dir, item);
        const isLast = index === items.length - 1;
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory() && !item.includes('node_modules') && !item.includes('.next')) {
            tree += `${prefix}${isLast ? '└── ' : '├── '}${item}/\n`;
            tree += getDirectoryTree(itemPath, prefix + (isLast ? '    ' : '│   '));
        } else if (stats.isFile() && (item.endsWith('.tsx') || item.endsWith('.ts') || item.endsWith('.json'))) {
            tree += `${prefix}${isLast ? '└── ' : '├── '}${item}\n`;
        }
    });
    
    return tree;
}

const treeStructure = getDirectoryTree(rootDir);
fs.writeFileSync(path.join(rootDir, backupFileName), treeStructure);
console.log(`✅ Estructura guardada en: ${backupFileName}`);

// 5. Generar reporte final
console.log('\n📊 REPORTE FINAL:');
console.log('================');
console.log('\n✅ Acciones completadas:');
console.log('- Archivos del dashboard copiados a la estructura correcta');
console.log('- Carpetas necesarias verificadas/creadas');
console.log('- Estructura actual respaldada');

console.log('\n⚠️  Acciones manuales requeridas:');
console.log('1. Eliminar carpeta duplicada: /inspecten/inspecten/');
console.log('2. Eliminar carpeta: /app/login/ (si existe)');
console.log('3. Verificar que el login esté en: /app/page.tsx');
console.log('4. Ejecutar: npm run dev para probar');

console.log('\n📁 Estructura correcta:');
console.log(`
inspecten/
├── app/
│   ├── page.tsx              (login)
│   ├── layout.tsx            (layout principal)
│   └── dashboard/
│       ├── page.tsx          (dashboard principal)
│       ├── layout.tsx        (layout del dashboard)
│       ├── assets/
│       ├── inspections/
│       ├── tasks/
│       ├── schedules/
│       ├── users/
│       ├── checklists/
│       ├── settings/
│       ├── propiedades/
│       └── presupuestos/
├── public/
│   └── Inspecten-01.png
├── package.json
└── ...
`);

console.log('\n✨ Limpieza completada!');
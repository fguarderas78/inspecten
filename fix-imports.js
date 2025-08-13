// fix-imports.js
// Script para arreglar las importaciones en dashboard/layout.tsx
// Ejecutar desde: C:\Users\coguc\Documents\GitHub\inspecten

const fs = require('fs');
const path = require('path');

console.log('🔧 Arreglando importaciones en dashboard/layout.tsx...\n');

const layoutPath = path.join(process.cwd(), 'app', 'dashboard', 'layout.tsx');

if (fs.existsSync(layoutPath)) {
    // Leer el archivo
    let content = fs.readFileSync(layoutPath, 'utf8');
    
    // Remover la línea de importación problemática
    content = content.replace(/import { GoogleLoginButton } from '@\/components\/google-login-button'.*\n/g, '');
    content = content.replace(/import { GoogleLoginButton } from "@\/components\/google-login-button".*\n/g, '');
    
    // También remover cualquier uso del componente GoogleLoginButton
    content = content.replace(/<GoogleLoginButton[^>]*\/>/g, '');
    content = content.replace(/<GoogleLoginButton[^>]*>[^<]*<\/GoogleLoginButton>/g, '');
    
    // Guardar el archivo corregido
    fs.writeFileSync(layoutPath, content);
    
    console.log('✅ Archivo dashboard/layout.tsx corregido');
    console.log('✅ Importación problemática removida');
} else {
    console.log('❌ No se encontró el archivo dashboard/layout.tsx');
}

// Limpiar caché de Next.js
const nextCachePath = path.join(process.cwd(), '.next');
if (fs.existsSync(nextCachePath)) {
    console.log('\n🧹 Limpiando caché de Next.js...');
    try {
        fs.rmSync(nextCachePath, { recursive: true, force: true });
        console.log('✅ Caché limpiado');
    } catch (error) {
        console.log('⚠️  No se pudo limpiar el caché completamente');
    }
}

console.log('\n✨ Listo! Ahora ejecuta: npm run dev');
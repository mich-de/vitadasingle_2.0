#!/usr/bin/env node

/**
 * Script di pulizia automatizzata per VitaApp
 * Rimuove file duplicati e non necessari
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Avvio pulizia progetto VitaApp...\n');

// File da rimuovere
const filesToRemove = [
  'frontend/postcss.config.alternative.js',
  'frontend/postcss.config.js.backup',
  'frontend/postcss.config.mjs.backup',
  'frontend/postcss.config.alternative.js.bak'
];

// Cartelle temporanee da rimuovere (se esistono)
const tempDirectories = [
  'frontend/.temp',
  'frontend/dist-temp',
  'backend/.temp'
];

let removedCount = 0;
let errorCount = 0;

function removeFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Rimosso: ${filePath}`);
      removedCount++;
    } else {
      console.log(`⚠️  File non trovato: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Errore rimuovendo ${filePath}:`, error.message);
    errorCount++;
  }
}

function removeDirectory(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Rimossa cartella: ${dirPath}`);
      removedCount++;
    }
  } catch (error) {
    console.error(`❌ Errore rimuovendo cartella ${dirPath}:`, error.message);
    errorCount++;
  }
}

function cleanupNodeModulesCache() {
  const nodeModulesCaches = [
    'frontend/node_modules/.cache',
    'backend/node_modules/.cache'
  ];
  
  console.log('\n🗂️  Pulizia cache node_modules...');
  nodeModulesCaches.forEach(cachePath => {
    if (fs.existsSync(cachePath)) {
      removeDirectory(cachePath);
    }
  });
}

function cleanupLogFiles() {
  const logPatterns = [
    'frontend/npm-debug.log*',
    'frontend/yarn-debug.log*',
    'frontend/yarn-error.log*',
    'backend/npm-debug.log*',
    'backend/yarn-debug.log*',
    'backend/yarn-error.log*'
  ];
  
  console.log('\n📋 Pulizia file di log...');
  logPatterns.forEach(pattern => {
    const dir = path.dirname(pattern);
    const filename = path.basename(pattern);
    
    if (fs.existsSync(dir)) {
      try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          if (file.match(filename.replace('*', '.*'))) {
            const fullPath = path.join(dir, file);
            removeFile(fullPath);
          }
        });
      } catch (error) {
        console.error(`❌ Errore nel pattern ${pattern}:`, error.message);
      }
    }
  });
}

function checkEssentialFiles() {
  const essentialFiles = [
    'frontend/package.json',
    'frontend/vite.config.ts',
    'frontend/postcss.config.cjs',
    'frontend/tailwind.config.js',
    'backend/package.json',
    'backend/server.js'
  ];
  
  console.log('\n🔍 Controllo file essenziali...');
  essentialFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} - OK`);
    } else {
      console.log(`❌ MANCANTE: ${file}`);
      errorCount++;
    }
  });
}

function createGitignoreIfMissing() {
  const gitignoreContent = `# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Temporary files
*.tmp
*.temp
.temp/

# Cache
.cache/
.parcel-cache/

# OS generated files
Thumbs.db
`;

  ['frontend/.gitignore', 'backend/.gitignore'].forEach(gitignorePath => {
    if (!fs.existsSync(gitignorePath)) {
      try {
        fs.writeFileSync(gitignorePath, gitignoreContent);
        console.log(`✅ Creato: ${gitignorePath}`);
      } catch (error) {
        console.error(`❌ Errore creando ${gitignorePath}:`, error.message);
      }
    }
  });
}

// Esecuzione principale
async function main() {
  console.log('1️⃣ Rimozione file duplicati...');
  filesToRemove.forEach(removeFile);
  
  console.log('\n2️⃣ Rimozione cartelle temporanee...');
  tempDirectories.forEach(removeDirectory);
  
  cleanupNodeModulesCache();
  cleanupLogFiles();
  
  console.log('\n3️⃣ Creazione .gitignore se mancanti...');
  createGitignoreIfMissing();
  
  checkEssentialFiles();
  
  // Riepilogo
  console.log('\n' + '='.repeat(50));
  console.log('📊 RIEPILOGO PULIZIA');
  console.log('='.repeat(50));
  console.log(`✅ File/cartelle rimossi: ${removedCount}`);
  console.log(`❌ Errori: ${errorCount}`);
  
  if (errorCount === 0) {
    console.log('\n🎉 Pulizia completata con successo!');
    console.log('\n📝 Prossimi passi suggeriti:');
    console.log('   • npm install (nel frontend e backend se necessario)');
    console.log('   • npm run dev (per testare l\'applicazione)');
    console.log('   • git add . && git commit -m "Cleanup project files"');
  } else {
    console.log('\n⚠️  Pulizia completata con alcuni errori. Controlla i messaggi sopra.');
  }
  
  console.log('\n🔧 Per eseguire di nuovo: node cleanup.js');
}

// Gestione errori globali
process.on('uncaughtException', (error) => {
  console.error('❌ Errore non gestito:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rigettata:', reason);
  process.exit(1);
});

// Avvio
main().catch(console.error);
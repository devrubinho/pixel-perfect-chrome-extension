const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Criando pacote da extensão para publicação...\n');

// Verificar se dist/ existe
if (!fs.existsSync('dist')) {
  console.error('❌ Pasta dist/ não encontrada. Execute "npm run build" primeiro.');
  process.exit(1);
}

// Ler versão do manifest
const manifestPath = path.join('dist', 'manifest.json');
if (!fs.existsSync(manifestPath)) {
  console.error('❌ manifest.json não encontrado em dist/');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version || '1.0.0';
const name = manifest.name.toLowerCase().replace(/\s+/g, '-');

const zipFileName = `${name}-v${version}.zip`;
const zipPath = path.join(process.cwd(), zipFileName);

// Remover ZIP anterior se existir
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
  console.log('🗑️  Removendo ZIP anterior...');
}

// Criar ZIP
try {
  console.log('📦 Criando arquivo ZIP...');
  process.chdir('dist');
  execSync(`zip -r ../${zipFileName} . -x "*.DS_Store" "*.git*"`, { stdio: 'inherit' });
  process.chdir('..');

  // Verificar tamanho do arquivo
  const stats = fs.statSync(zipPath);
  const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);

  console.log('\n✅ Pacote criado com sucesso!');
  console.log(`📁 Arquivo: ${zipFileName}`);
  console.log(`📊 Tamanho: ${fileSizeInMB} MB`);
  console.log(`📝 Versão: ${version}`);
  console.log('\n📤 Próximos passos:');
  console.log('1. Acesse: https://chrome.google.com/webstore/devconsole');
  console.log('2. Clique em "New Item"');
  console.log(`3. Faça upload do arquivo: ${zipFileName}`);
  console.log('\n');
} catch (error) {
  console.error('❌ Erro ao criar ZIP:', error.message);
  process.exit(1);
}

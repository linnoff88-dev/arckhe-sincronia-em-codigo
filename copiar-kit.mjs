// Copia as duas peças do kit para dentro de um projeto HyperFrames seu (em <pasta>/kit/).
// O HyperFrames só enxerga arquivos dentro da pasta do projeto, por isso a cópia.
//   node copiar-kit.mjs ../meu-video
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';

const destino = process.argv[2];
if (!destino || !existsSync(destino)) { console.error('uso: node copiar-kit.mjs <pasta do projeto HyperFrames>'); process.exit(1); }
const raiz = new URL('.', import.meta.url).pathname;
mkdirSync(`${destino}/kit`, { recursive: true });
copyFileSync(raiz + 'relogio/relogio.js', `${destino}/kit/relogio.js`);
copyFileSync(raiz + 'som/sintese.mjs', `${destino}/kit/sintese.mjs`);
console.log(`ok: ${destino}/kit/relogio.js e ${destino}/kit/sintese.mjs`);

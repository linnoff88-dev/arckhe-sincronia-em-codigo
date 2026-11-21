// Série por troca de um campo: cada linha do episodios.csv vira um episódio novo, copiando o molde
// e reescrevendo SÓ o arquivo do episódio (episodio.js). O visual e o ritmo ficam iguais: é isso que faz série.
//
//   node serie/serie.mjs                      lista episódios e status
//   node serie/serie.mjs novo                 prepara o próximo "pendente"
//   node serie/serie.mjs novo 25-circulos     prepara um específico
//   node serie/serie.mjs status 25-circulos aprovado
//
// Status: pendente → fazendo → pronto → (você) aprovado → publicado. Ninguém além de você marca "aprovado".
// Configuração: serie/serie.config.json (qual pasta é o molde, para onde copiar, nome do arquivo do episódio).
import { readFileSync, writeFileSync, cpSync, existsSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const AQUI = new URL('.', import.meta.url).pathname;
const RAIZ = join(AQUI, '..');
const CFG = JSON.parse(readFileSync(join(AQUI, 'serie.config.json'), 'utf8'));
const CSV = join(AQUI, CFG.csv || 'episodios.csv');
export const STATUS = ['pendente', 'fazendo', 'pronto', 'aprovado', 'publicado'];

function ler() {
  const [cab, ...linhas] = readFileSync(CSV, 'utf8').trim().split('\n');
  const campos = cab.split(',').map((c) => c.trim());
  return { campos, linhas: linhas.map((l, i) => ({ _linha: i + 1, ...Object.fromEntries(l.split(',').map((v, k) => [campos[k], v.trim()])) })) };
}
function gravar({ campos, linhas }) {
  writeFileSync(CSV, [campos.join(','), ...linhas.map((l) => campos.map((c) => l[c]).join(','))].join('\n') + '\n');
}
function mudar(slug, status) {
  if (!STATUS.includes(status)) throw new Error(`status "${status}" não existe (use: ${STATUS.join(', ')})`);
  const t = ler(), l = t.linhas.find((x) => x.slug === slug);
  if (!l) throw new Error(`"${slug}" não está no ${CFG.csv || 'episodios.csv'}`);
  l.status = status; gravar(t);
}
// número vira número; o resto fica texto
const valor = (v) => (v !== '' && !isNaN(Number(v)) ? Number(v) : v);

function novo(pedido) {
  const t = ler();
  const l = pedido ? t.linhas.find((x) => x.slug === pedido) : t.linhas.find((x) => x.status === 'pendente');
  if (!l) { console.log(pedido ? `"${pedido}" não está no CSV.` : 'Nenhum episódio pendente.'); process.exit(pedido ? 1 : 0); }
  const hoje = new Date().toISOString().slice(0, 10);
  const pasta = join(RAIZ, CFG.destino, `${hoje}-${l.slug}`);
  if (existsSync(pasta)) { console.error(`já existe: ${pasta}`); process.exit(1); }
  mkdirSync(pasta, { recursive: true });
  const ignorar = new Set(CFG.ignorar || []);
  const molde = join(RAIZ, CFG.molde);
  cpSync(molde, pasta, { recursive: true, filter: (src) => !relative(molde, src).split('/').some((p) => ignorar.has(p)) });
  // o episódio: os campos da linha (menos slug e status) + uma semente que nunca se repete
  const ep = {};
  for (const c of t.campos) if (c !== 'slug' && c !== 'status') ep[c] = valor(l[c]);
  ep.semente = Number(hoje.replace(/-/g, '')) * 100 + l._linha;
  writeFileSync(join(pasta, CFG.arquivo), `// Episódio gerado por serie/serie.mjs a partir da linha "${l.slug}".\nexport const ${CFG.constante} = ${JSON.stringify(ep, null, 2)};\n`);
  l.status = 'fazendo'; gravar(t);
  console.log(join(CFG.destino, `${hoje}-${l.slug}`));
}

const [cmd, a, b] = process.argv.slice(2);
try {
  if (cmd === 'novo') novo(a);
  else if (cmd === 'status' && a && b) { mudar(a, b); console.log(`${a}: ${b}`); }
  else for (const l of ler().linhas) console.log(`${l.status.padEnd(10)} ${l.slug}`);
} catch (e) { console.error('✗ ' + e.message); process.exit(1); }

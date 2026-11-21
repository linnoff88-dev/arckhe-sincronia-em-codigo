// O som da demo, feito a partir da MESMA linha do tempo da imagem (js/linha.js).
// Cada batida vira uma batida de madeira no quadro exato em que a casa acende; o tom sobe com a contagem.
//   node ferramentas/som.mjs   -> assets/som.wav (-15 LUFS)
import { mkdirSync } from 'node:fs';
import { R, DURACAO } from '../js/linha.js';
import { EPISODIO } from '../episodio.js';
import { rng } from '../kit/relogio.js';
import { mixagem, batida, estalo, plop, gravarWav, normalizar } from '../kit/sintese.mjs';

const raiz = new URL('..', import.meta.url).pathname;
mkdirSync(raiz + 'assets', { recursive: true });
const s = rng(EPISODIO.semente + 7);
const mix = mixagem(DURACAO);
const QUADRO = 1 / 30;

for (const e of R.eventos) {
  if (e.tipo === 'batida') {
    const tom = 420 + 520 * (e.i / EPISODIO.n);                  // sobe conforme a contagem
    const pan = ((e.casa % Math.ceil(Math.sqrt(EPISODIO.n))) / Math.ceil(Math.sqrt(EPISODIO.n))) * 1.2 - 0.6; // segue a coluna da casa
    mix.poe(batida(s, tom), e.t + QUADRO / 2, -3 + 4 * (e.forca - 0.85), pan);
    if (s() < 0.3) mix.poe(estalo(s, 4), e.t, -14, pan);
  }
  if (e.tipo === 'fim') mix.poe(plop(s, 300), e.t, -2);
}

gravarWav(raiz + 'assets/som-bruto.wav', mix.L, mix.R);
const ok = normalizar(raiz + 'assets/som-bruto.wav', raiz + 'assets/som.wav');
console.log(ok ? `ok: assets/som.wav (${R.contar(DURACAO, 'batida')} batidas)` : 'falhou: ffmpeg não normalizou');
if (!ok) process.exit(1);

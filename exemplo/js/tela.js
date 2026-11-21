// A imagem da demo, desenhada só a partir do tempo t (evento hf-seek do HyperFrames).
// Cada batida acende uma casa da grade; o contador e a barra leem o mesmo relógio.
import { R, DURACAO, FIM } from './linha.js';
import { EPISODIO } from '../episodio.js';

const W = 1080, H = 1920;
const cv = document.getElementById('tela'), g = cv.getContext('2d');
const n = EPISODIO.n, lado = Math.ceil(Math.sqrt(n));
const TAM = 820, x0 = (W - TAM) / 2, y0 = 640, passo = TAM / lado, pad = passo * 0.14;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const out3 = (k) => 1 - Math.pow(1 - k, 3);

document.getElementById('titulo').textContent = EPISODIO.titulo;
const $cont = document.getElementById('contador'), $barra = document.getElementById('barra'), $fim = document.getElementById('fim');

function forma(x, y, r) {
  g.beginPath();
  if (EPISODIO.forma === 'circulo') g.arc(x, y, r, 0, Math.PI * 2);
  else g.roundRect(x - r, y - r, 2 * r, 2 * r, r * 0.22);
  g.fill();
}

function quadro(t) {
  t = clamp(t, 0, DURACAO);
  g.fillStyle = '#0c0c10'; g.fillRect(0, 0, W, H);
  const acesas = new Map();
  for (const e of R.eventos) if (e.tipo === 'batida' && e.t <= t) acesas.set(e.casa, e);
  const pulsoFim = R.desde(t, 'fim') < Infinity ? Math.exp(-R.desde(t, 'fim') / 0.35) : 0;
  for (let c = 0; c < n; c++) {
    const cx = x0 + (c % lado + 0.5) * passo, cy = y0 + (Math.floor(c / lado) + 0.5) * passo;
    const e = acesas.get(c), r0 = passo / 2 - pad;
    if (!e) { g.fillStyle = '#1b1b22'; forma(cx, cy, r0); continue; }
    const d = t - e.t, flash = Math.exp(-d / 0.18) * e.forca; // acende forte no quadro do evento e assenta
    g.globalAlpha = 1; g.fillStyle = EPISODIO.cor; forma(cx, cy, r0 * (1 + 0.28 * flash + 0.12 * pulsoFim));
    if (flash > 0.02) { g.globalAlpha = flash * 0.8; g.fillStyle = '#ffffff'; forma(cx, cy, r0 * 0.75); }
    g.globalAlpha = 1;
  }
  const k = R.contar(t, 'batida');
  $cont.textContent = k.toLocaleString('pt-BR');
  $barra.style.width = `${(100 * k) / n}%`;
  $fim.style.opacity = String(out3(clamp((t - FIM - 0.4) / 0.5)));
}

window.addEventListener('hf-seek', (ev) => quadro(ev.detail.time));
window.__hf = window.__hf || {}; window.__hf.buildReady = window.__hf.buildReady || {};
window.__hf.buildReady.tela = Promise.all(['900 40px Montserrat', '800 40px Sora'].map((f) => document.fonts.load(f)))
  .catch(() => {}).then(() => quadro(0));
quadro(0);

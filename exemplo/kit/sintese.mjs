// Sons feitos em código: ruído + filtros + envelopes. Sem banco de efeitos, sem download.
// Cada som é uma função (sorteio) => Float32Array. Chame com sorteios diferentes para ter variações.
// Regra INEMA: nada de "whoosh" de movimento de tela; só som de coisa que acontece na cena.
import { writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

export const SR = 48000;

// filtro biquad (passa-baixa, passa-alta, passa-faixa)
export function filtro(tipo, f, q = 0.707) {
  const w = (2 * Math.PI * f) / SR, cs = Math.cos(w), al = Math.sin(w) / (2 * q);
  let b0, b1, b2;
  if (tipo === 'pb') { b0 = (1 - cs) / 2; b1 = 1 - cs; b2 = b0; }
  else if (tipo === 'pa') { b0 = (1 + cs) / 2; b1 = -(1 + cs); b2 = b0; }
  else { b0 = al; b1 = 0; b2 = -al; }
  const a0 = 1 + al, a1 = -2 * cs, a2 = 1 - al;
  const B0 = b0 / a0, B1 = b1 / a0, B2 = b2 / a0, A1 = a1 / a0, A2 = a2 / a0;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  return (x) => { const y = B0 * x + B1 * x1 + B2 * x2 - A1 * y1 - A2 * y2; x2 = x1; x1 = x; y2 = y1; y1 = y; return y; };
}
// envelope: sobe em `ataque` segundos e cai com constante `queda`
export const env = (t, ataque, queda) => (t < 0 ? 0 : t < ataque ? t / ataque : Math.exp(-(t - ataque) / queda));
const ruido = (s) => s() * 2 - 1;
function buffer(seg, fn) { const n = Math.ceil(seg * SR), b = new Float32Array(n); fn(b, n); return b; }

// lâmina batendo na tábua: duas ressonâncias de madeira + um clique curto
export function batida(s, f = 520, seg = 0.1) {
  const r1 = filtro('pf', f * (0.92 + 0.16 * s()), 8), r2 = filtro('pf', f * 2.4, 10), cl = filtro('pa', 3000);
  return buffer(seg, (b, n) => { for (let i = 0; i < n; i++) {
    const t = i / SR, x = ruido(s) * env(t, 0.0004, 0.004);
    b[i] = 2.4 * r1(x) * env(t, 0.001, 0.028) + 1.1 * r2(x) * env(t, 0.001, 0.012) + 0.45 * cl(ruido(s)) * env(t, 0.0002, 0.002);
  } });
}
// a lâmina passando pela polpa: ruído agudo que abre e fecha rápido
export function fatia(s, seg = 0.07, brilho = 4200) {
  const pa = filtro('pa', brilho * (0.85 + 0.3 * s())), pb = filtro('pb', 9000);
  return buffer(seg, (b, n) => { for (let i = 0; i < n; i++) {
    const t = i / SR, k = t / seg;
    b[i] = 0.55 * pb(pa(ruido(s))) * Math.sin(Math.PI * k) ** 1.5;
  } });
}
// estalos miúdos (casca, sementes): vários cliques espalhados em poucos milissegundos
export function estalo(s, quantos = 6, seg = 0.05) {
  const pf = filtro('pf', 2600 + 1800 * s(), 3);
  const quando = Array.from({ length: quantos }, () => s() * seg * 0.8);
  return buffer(seg, (b, n) => { for (let i = 0; i < n; i++) {
    const t = i / SR; let x = 0;
    for (const q of quando) x += ruido(s) * env(t - q, 0.0002, 0.0015);
    b[i] = 0.9 * pf(x);
  } });
}
// algo pesado pousando: seno que desce de tom + ruído grave
export function baque(s, f0 = 110, seg = 0.35) {
  const pb = filtro('pb', 400);
  return buffer(seg, (b, n) => { let fase = 0; for (let i = 0; i < n; i++) {
    const t = i / SR, f = f0 * (1 + 1.4 * Math.exp(-t / 0.03));
    fase += (2 * Math.PI * f) / SR;
    b[i] = (0.9 * Math.sin(fase) + 0.5 * pb(ruido(s))) * env(t, 0.002, 0.09);
  } });
}
// pedacinho caindo no pote: um "tic" de vidro curto e agudo
export function grao(s, seg = 0.06) {
  const f = 2800 + 2400 * s(), r = filtro('pf', f, 18);
  return buffer(seg, (b, n) => { for (let i = 0; i < n; i++) {
    const t = i / SR; b[i] = 1.6 * r(ruido(s) * env(t, 0.0003, 0.002)) * env(t, 0.0005, 0.02);
  } });
}
// massa molhada: ruído grave com tremor de amplitude
export function molhado(s, seg = 0.12) {
  const pb = filtro('pb', 900 + 500 * s(), 1.2), trem = 28 + 20 * s();
  return buffer(seg, (b, n) => { for (let i = 0; i < n; i++) {
    const t = i / SR;
    b[i] = 0.8 * pb(ruido(s)) * (0.55 + 0.45 * Math.sin(2 * Math.PI * trem * t)) * env(t, 0.006, seg / 3);
  } });
}
// "plop": seno curto que sobe de tom (gota, tampa, colher)
export function plop(s, f0 = 260, seg = 0.18) {
  return buffer(seg, (b, n) => { let fase = 0; for (let i = 0; i < n; i++) {
    const t = i / SR, f = f0 * (1 + 2.2 * (1 - Math.exp(-t / 0.025)));
    fase += (2 * Math.PI * f) / SR;
    b[i] = 0.8 * Math.sin(fase) * env(t, 0.001, 0.045);
  } });
}

// banco de variações: n versões do mesmo som, para não repetir o idêntico
export function banco(fn, n, sorteio, ...args) { return Array.from({ length: n }, () => fn(sorteio, ...args)); }

// a mixagem: dois canais do tamanho do vídeo
export function mixagem(duracao) {
  const N = Math.ceil(duracao * SR), L = new Float32Array(N), R = new Float32Array(N);
  return {
    L, R,
    // coloca um som no tempo t (s), com ganho em dB e pan de -1 (esq.) a 1 (dir.)
    poe(som, t, db = 0, pan = 0) {
      const g = Math.pow(10, db / 20), gl = g * Math.cos((pan + 1) * Math.PI / 4), gr = g * Math.sin((pan + 1) * Math.PI / 4);
      const i0 = Math.round(t * SR);
      for (let i = 0; i < som.length; i++) { const k = i0 + i; if (k < 0 || k >= N) continue; L[k] += som[i] * gl; R[k] += som[i] * gr; }
    },
  };
}

// grava WAV 16 bits estéreo
export function gravarWav(caminho, L, R) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  let pico = 1e-9; for (let i = 0; i < n; i++) pico = Math.max(pico, Math.abs(L[i]), Math.abs(R[i]));
  const g = pico > 0.98 ? 0.98 / pico : 1;
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * g)) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * g)) * 32767), 46 + i * 4);
  }
  writeFileSync(caminho, buf);
}

// volume de rede social (-15 LUFS) com o ffmpeg; devolve true se deu certo
export function normalizar(entrada, saida, lufs = -15) {
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-i', entrada, '-af', `loudnorm=I=${lufs}:TP=-1.5:LRA=11`, '-ar', String(SR), saida], { stdio: 'inherit' });
  return r.status === 0;
}

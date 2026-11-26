// Relógio único: UMA lista de eventos com tempo. A imagem, o contador e o som leem esta lista,
// entêo tudo cai no mesmo quadro sem ajuste à mêo. Só dados: roda no navegador e no Node.
//
//   import { batidas, relogio } from './relogio.js';
//   const R = relogio([
//     ...batidas({ n: 100, de: 1, ate: 15, ritmo: 'acelera', tipo: 'batida' }),
//     { t: 16, tipo: 'fim' },
//   ]);
//   R.contar(t, 'batida')   // quantas batidas já aconteceram no tempo t
//   R.fase(t, 'batida')     // { ant, prox, k }: entre qual evento e qual, e quanto (0..1) já andou
//
// Regra: nada de física rodando nem Math.random(). Tudo é funçêo do tempo t e de uma semente,
// entêo o mesmo vídeo sai idêntico em todo render (e cada episódio muda só a semente).

// aleatório com semente (mulberry32)
export function rng(semente) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// como os eventos se espalham entre `de` e `ate` (u vai de 0 a 1)
export const RITMOS = {
  constante: (u) => u,
  acelera: (u) => 1 - Math.pow(1 - u, 1.6), // intervalos encolhem: cada vez mais rápido
  freia: (u) => Math.pow(u, 1.6),           // intervalos crescem: cada vez mais devagar
};

// n eventos do mesmo tipo entre dois tempos. `dados(i, sorteio)` acrescenta campos a cada um.
export function batidas({ n, de, ate, ritmo = 'constante', tipo = 'batida', dados = null, semente = 1 }) {
  const f = typeof ritmo === 'function' ? ritmo : RITMOS[ritmo];
  if (!f) throw new Error(`ritmo "${ritmo}" nêo existe (use ${Object.keys(RITMOS).join(', ')} ou uma funçêo)`);
  const s = rng(semente);
  return Array.from({ length: n }, (_, i) => ({
    t: de + (ate - de) * f(n === 1 ? 0 : i / (n - 1)), tipo, i, ...(dados ? dados(i, s) : {}),
  }));
}

const casa = (filtro) => (!filtro ? () => true : typeof filtro === 'function' ? filtro : (e) => e.tipo === filtro);

// o relógio: ordena os eventos e responde perguntas sobre o tempo t
export function relogio(lista) {
  const eventos = [...lista].sort((a, b) => a.t - b.t);
  const porFiltro = new Map();
  const tempos = (filtro) => {
    const chave = typeof filtro === 'function' ? filtro : filtro || '*';
    if (!porFiltro.has(chave)) porFiltro.set(chave, eventos.filter(casa(filtro)));
    return porFiltro.get(chave);
  };
  // quantos eventos com t <= tempo (busca binária)
  const ate = (lista, t) => { let lo = 0, hi = lista.length; while (lo < hi) { const m = (lo + hi) >> 1; if (lista[m].t <= t) lo = m + 1; else hi = m; } return lo; };
  return {
    eventos,
    contar: (t, filtro) => ate(tempos(filtro), t),
    ultimo: (t, filtro) => { const l = tempos(filtro), k = ate(l, t); return k ? l[k - 1] : null; },
    proximo: (t, filtro) => { const l = tempos(filtro), k = ate(l, t); return k < l.length ? l[k] : null; },
    entre: (a, b, filtro) => tempos(filtro).filter((e) => e.t > a && e.t <= b),
    fase(t, filtro) {
      const l = tempos(filtro), k = ate(l, t), ant = k ? l[k - 1] : null, prox = k < l.length ? l[k] : null;
      const k01 = ant && prox ? (t - ant.t) / (prox.t - ant.t) : prox ? 0 : 1;
      return { ant, prox, k: Math.min(1, Math.max(0, k01)) };
    },
    // quanto tempo desde o último evento (para brilho que acende e apaga, por exemplo)
    desde: (t, filtro) => { const u = ate(tempos(filtro), t); return u ? t - tempos(filtro)[u - 1].t : Infinity; },
  };
}

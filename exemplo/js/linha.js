// A linha do tempo da demo: a única fonte de tempo. tela.js desenha a partir dela e
// ferramentas/som.mjs põe um som em cada evento dela. Mude aqui e os dois mudam juntos.
import { batidas, relogio, rng } from '../kit/relogio.js';
import { EPISODIO } from '../episodio.js';

export const DURACAO = 20;
export const FIM = 16.2;
const n = EPISODIO.n;
const s = rng(EPISODIO.semente);
// cada batida acende uma casa da grade, numa ordem sorteada pela semente
const ordem = Array.from({ length: n }, (_, i) => i);
for (let i = n - 1; i > 0; i--) { const j = Math.floor(s() * (i + 1)); [ordem[i], ordem[j]] = [ordem[j], ordem[i]]; }

export const R = relogio([
  ...batidas({ n, de: 1.2, ate: 15.6, ritmo: 'acelera', tipo: 'batida', semente: EPISODIO.semente,
    dados: (i, sorte) => ({ casa: ordem[i], forca: 0.7 + 0.3 * sorte() }) }),
  { t: FIM, tipo: 'fim' },
]);

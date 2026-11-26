# CLAUDE.md — sincronia-em-codigo

Kit Relógio único: `relogio/relogio.js` (lista de eventos), `som/sintese.mjs` (som em código), `serie/serie.mjs` (episódio por linha) e a demo `exemplo/` em HyperFrames.

- Autor dos commits: `linnoff88-dev <linnoff88-dev@gmail.com>`. Push do `.github/workflows/` vai por SSH.
- `exemplo/kit/` é cópia de `relogio/` e `som/`: mudou a biblioteca, rodar `node copiar-kit.mjs exemplo` no mesmo commit.
- Som só de coisa que acontece na cena; nada de "whoosh" de transiçêo.
- Nada de `Math.random()` nem física rodando: tudo é funçêo de `t` e da semente.
- Processo do início ao fim: README, seçêo "O processo, do início ao fim" (atualizar no mesmo commit quando o fluxo mudar).

## Self-learning

Quando o usuário corrigir algo, ou quando você pegar um erro seu: antes de continuar, acrescente a liçêo como uma regra de uma linha no TOPO da seçêo Lessons abaixo.

## Lessons

- Coluna do CSV com nome igual a campo interno (`n`) sobrescreve o campo: usar prefixo `_` nos campos internos. (2026-11-14)
- Filtro de cópia por nome de pasta tem de olhar o caminho RELATIVO ao molde, senêo uma pasta acima com o mesmo nome bloqueia tudo. (2026-11-14)

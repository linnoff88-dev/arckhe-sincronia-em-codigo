# sincronia-em-codigo â€” RelÃ³gio Ãºnico

<div align="center">
  <img src="capa/logo.svg" alt="Arckhé AI" height="48" />
  <p><strong>Arckhé AI</strong></p>
</div>


[![RelÃ³gio Ãºnico](guia/assets/banner.jpg)](https://inematds.github.io/sincronia-em-codigo/guia/)

**ðŸ‡§ðŸ‡· [PortuguÃªs](README.md) Â· ðŸ‡ºðŸ‡¸ [English](README.en.md) Â· ðŸ‡ªðŸ‡¸ [EspaÃ±ol](README.es.md)**

## O que Ã©

Em vÃ­deo feito com cÃ³digo, o problema mais comum Ã© o descompasso: o som chega um pouco antes, o nÃºmero na tela nÃ£o bate com a animaÃ§Ã£o, e cada episÃ³dio novo exige mexer em tudo de novo. Este kit junta trÃªs ideias que resolvem isso: **um relÃ³gio Ãºnico** (uma lista de eventos com tempo, que a imagem, o contador e o som leem), **som feito em cÃ³digo** (batidas, estalos e pancadas gerados na hora, sem banco de efeitos) e **sÃ©rie trocando uma linha** (cada episÃ³dio Ã© uma cÃ³pia do molde em que sÃ³ um arquivo muda). Vem com uma demo pronta em HyperFrames. Para usar: Node.js e ffmpeg.

## ðŸ“– Guia de uso

Guia completo (landing + passo a passo): **https://inematds.github.io/sincronia-em-codigo/guia/**

## ComeÃ§ar

```bash
git clone https://github.com/inematds/sincronia-em-codigo.git
cd sincronia-em-codigo/exemplo
node ferramentas/som.mjs
npx --yes hyperframes@0.9.37 check
npx --yes hyperframes@0.9.37 render . -o renders/exemplo.mp4 --fps 30
```

## O processo, do inÃ­cio ao fim

| # | Passo | Comando | Quem |
|---|---|---|---|
| 1 | Escrever a lista de eventos do vÃ­deo | `js/linha.js` com `batidas()` e `relogio()` | ðŸ§  vocÃª ou ðŸ¤– agente |
| 2 | Desenhar a partir do tempo | `R.contar(t)`, `R.fase(t)`, `R.desde(t)` no seu `tela.js` | ðŸ§  / ðŸ¤– |
| 3 | Gerar o som da mesma lista | `node ferramentas/som.mjs` | âš™ï¸ script |
| 4 | PÃ´r episÃ³dios na planilha | `serie/episodios.csv` | ðŸ§  vocÃª |
| 5 | Criar o episÃ³dio | `node serie/serie.mjs novo` | âš™ï¸ script |
| 6 | Render | `npx --yes hyperframes@0.9.37 render . -o renders/ep.mp4` | âš™ï¸ script |
| 7 | Aprovar e publicar | `node serie/serie.mjs status <slug> aprovado` | ðŸ§  vocÃª |

Levar para outro projeto: `node copiar-kit.mjs <pasta do projeto>`.

## O que tem aqui

| PeÃ§a | O que faz |
|---|---|
| `relogio/relogio.js` | A lista de eventos e as perguntas sobre o tempo (`contar`, `fase`, `ultimo`, `proximo`, `desde`, `entre`) |
| `som/sintese.mjs` | Sons em cÃ³digo (batida, fatia, estalo, baque, grÃ£o, molhado, plop), mixagem, WAV, âˆ’15 LUFS |
| `serie/serie.mjs` | EpisÃ³dio por linha do CSV, com status |
| `exemplo/` | Demo "100 batidas" em HyperFrames |
| `copiar-kit.mjs` | Copia relÃ³gio e som para `<projeto>/kit/` |

Exemplo aplicado das trÃªs ideias: [reel-asmr-cortes](https://github.com/inematds/reel-asmr-cortes).

LicenÃ§a MIT. Fontes (OFL) com a licenÃ§a em `exemplo/fontes/`.

---

<div align="center">
  <img src="capa/logo.svg" alt="Arckhé AI" height="32" />
  <p><strong>Arckhé AI</strong></p>
</div>
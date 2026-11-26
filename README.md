ï»¿# sincronia-em-codigo ê¢â¬â RelêÂ³gio êÂºnico

<div align="center">
  <img src="capa/logo.svg" alt="Arckhé AI" height="48" />
  <p><strong>Arckhé AI</strong></p>
</div>


[![RelêÂ³gio êÂºnico](guia/assets/banner.jpg)](https://linnoff88-dev.github.io/arckhe-/guia/)

**ê°Å¸â¡Â§ê°Å¸â¡Â· [PortuguêÂªs](README.md) êÂ· ê°Å¸â¡Âºê°Å¸â¡Â¸ [English](README.en.md) êÂ· ê°Å¸â¡Âªê°Å¸â¡Â¸ [EspaêÂ±ol](README.es.md)**

## O que êÂ©

Em vêÂ­deo feito com cêÂ³digo, o problema mais comum êÂ© o descompasso: o som chega um pouco antes, o nêÂºmero na tela nêÂ£o bate com a animaêÂ§êÂ£o, e cada episêÂ³dio novo exige mexer em tudo de novo. Este kit junta trêÂªs ideias que resolvem isso: **um relêÂ³gio êÂºnico** (uma lista de eventos com tempo, que a imagem, o contador e o som leem), **som feito em cêÂ³digo** (batidas, estalos e pancadas gerados na hora, sem banco de efeitos) e **sêÂ©rie trocando uma linha** (cada episêÂ³dio êÂ© uma cêÂ³pia do molde em que sêÂ³ um arquivo muda). Vem com uma demo pronta em HyperFrames. Para usar: Node.js e ffmpeg.

## ê°Å¸ââ Guia de uso

Guia completo (landing + passo a passo): **https://linnoff88-dev.github.io/arckhe-/guia/**

## ComeêÂ§ar

```bash
git clone https://github.com/linnoff88-dev/sincronia-em-codigo.git
cd sincronia-em-codigo/exemplo
node ferramentas/som.mjs
npx --yes hyperframes@0.9.37 check
npx --yes hyperframes@0.9.37 render . -o renders/exemplo.mp4 --fps 30
```

## O processo, do inêÂ­cio ao fim

| # | Passo | Comando | Quem |
|---|---|---|---|
| 1 | Escrever a lista de eventos do vêÂ­deo | `js/linha.js` com `batidas()` e `relogio()` | ê°Å¸Â§Â  vocêÂª ou ê°Å¸Â¤â agente |
| 2 | Desenhar a partir do tempo | `R.contar(t)`, `R.fase(t)`, `R.desde(t)` no seu `tela.js` | ê°Å¸Â§Â  / ê°Å¸Â¤â |
| 3 | Gerar o som da mesma lista | `node ferramentas/som.mjs` | ê¢Å¡â¢ê¯Â¸Â script |
| 4 | PêÂ´r episêÂ³dios na planilha | `serie/episodios.csv` | ê°Å¸Â§Â  vocêÂª |
| 5 | Criar o episêÂ³dio | `node serie/serie.mjs novo` | ê¢Å¡â¢ê¯Â¸Â script |
| 6 | Render | `npx --yes hyperframes@0.9.37 render . -o renders/ep.mp4` | ê¢Å¡â¢ê¯Â¸Â script |
| 7 | Aprovar e publicar | `node serie/serie.mjs status <slug> aprovado` | ê°Å¸Â§Â  vocêÂª |

Levar para outro projeto: `node copiar-kit.mjs <pasta do projeto>`.

## O que tem aqui

| PeêÂ§a | O que faz |
|---|---|
| `relogio/relogio.js` | A lista de eventos e as perguntas sobre o tempo (`contar`, `fase`, `ultimo`, `proximo`, `desde`, `entre`) |
| `som/sintese.mjs` | Sons em cêÂ³digo (batida, fatia, estalo, baque, grêÂ£o, molhado, plop), mixagem, WAV, ê¢Ëâ15 LUFS |
| `serie/serie.mjs` | EpisêÂ³dio por linha do CSV, com status |
| `exemplo/` | Demo "100 batidas" em HyperFrames |
| `copiar-kit.mjs` | Copia relêÂ³gio e som para `<projeto>/kit/` |

Exemplo aplicado das trêÂªs ideias: [reel-asmr-cortes](https://github.com/linnoff88-dev/reel-asmr-cortes).

LicenêÂ§a MIT. Fontes (OFL) com a licenêÂ§a em `exemplo/fontes/`.

---

<div align="center">
  <img src="capa/logo.svg" alt="Arckhé AI" height="32" />
  <p><strong>Arckhé AI</strong></p>
</div>
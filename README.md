# Duetto Estúdio Fotográfico — site

Site em Astro 7 + GSAP (ScrollTrigger). Coreografia completa de scroll, imagens responsivas e links internos suaves; respeita `prefers-reduced-motion`.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # gera /dist (site estático)
```

## Estrutura

| Caminho | O que é |
| --- | --- |
| `src/data/site.ts` | Nome, slogan, cidade e **contatos** |
| `src/data/projects.ts` | **Portfólio**: categorias, projetos, fotos e composição de cada página |
| `src/components/home/` | Cenas da página inicial (abertura/visão, trabalhos, lado humano) |
| `src/components/Archive.astro` | Acervo filtrável (home e `/trabalhos/`) |
| `src/pages/trabalhos/[slug].astro` | Página de cada projeto + galeria ampliada |
| `src/scripts/reveals.ts` | Entradas leves com IntersectionObserver, uma vez por elemento |
| `src/scripts/motion.ts` | Abertura, máscaras, parallax, travelling horizontal, diafragma e linha de experiência |
| `src/styles/global.css` | Tokens da marca (cores, tipografia, espaçamento) |

## Base de marca (Manual Duetto — Zenith Company, out/2026)

- Cores: Café profundo `#2A211C` (principal), Champagne `#D6B47A` (destaque), Off-white `#F7F3ED` (fundo), Preto `#000000` (contraste). O laranja `#F7A127` aparece somente na logo original.
- Tipografia: Quiche (títulos) e Readex Pro (textos).
- Logo: versões original, positiva e negativa, vetorizadas a partir do arquivo do manual (`src/components/Logo.astro`).
- Tom de voz: profissional, acolhedor, claro, elegante, humano e natural.

## Pendências — o que o estúdio precisa enviar

1. **Fotografias reais do acervo.** Hoje, todos os projetos usam imagens provisórias do Unsplash, sinalizadas no site como “Imagem provisória”. A única foto real é a das sócias (manual). Para cada projeto: fotos em boa resolução, título, categoria, ano, cliente (se puder ser citado) e créditos.
2. **Fotos do espaço e de bastidores** para a cena “O lado humano / O estúdio”.
3. **Contatos:** WhatsApp, e-mail e endereço (`src/data/site.ts`). Enquanto vazios, o botão “Fale com o estúdio” leva ao Instagram `@duettoestudiofotografico`.
4. **Nomes das sócias** (`founders` em `src/data/site.ts`).
5. **Fonte Quiche Display** licenciada para web (`.woff2`) — colocar em `public/fonts/` e descomentar o bloco `@font-face` em `global.css`. Até lá, usa-se Fraunces como alternativa.
6. **Logo em vetor oficial** (SVG/PDF), para substituir a vetorização feita a partir do PNG.
7. **Domínio definitivo** (`site` em `astro.config.mjs` e `public/robots.txt`).
8. Vídeos reais, se houver, para o projeto de audiovisual.

## Como trocar uma foto provisória por uma real

Em `src/data/projects.ts`, troque `src` pelo caminho do arquivo em `/public` (ex.: `'/acervo/presenca/01.jpg'`), ajuste `ratio` (largura ÷ altura) e defina `provisional: false` no projeto. Arquivos locais não exibem a etiqueta “Imagem provisória”.

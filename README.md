# Duetto Estúdio Fotográfico · site

Site de uma página, em HTML, CSS e JavaScript puros. Não tem build nem dependências: basta publicar a pasta.

## Rodar localmente

```bash
python -m http.server 4321
```

Depois, abra http://localhost:4321.

## Publicar no Netlify

Arraste a pasta inteira para o Netlify Drop, ou conecte o repositório. O `netlify.toml` já publica a raiz (`publish = "."`).

## Estrutura

| Arquivo | O que é |
| --- | --- |
| `index.html` | Todo o conteúdo: textos, pacotes, preços, contatos, perguntas frequentes |
| `assets/css/style.css` | Visual: cores da marca, tipografia, espaçamentos, versão celular |
| `assets/js/main.js` | Menu no celular, filtro do portfólio, foto ampliada, barra fixa de agendamento |
| `assets/img/` | Fotos do estúdio e `logo.svg` (logo vetorizada a partir do manual) |

## Ordem da página

Abertura → Trabalhos → Ensaios → Pacotes → Como reservar → O estúdio → Avaliações → Vídeos institucionais → Dúvidas → Contato.

Todos os botões levam ao WhatsApp **(62) 99123-0095** com uma mensagem pronta (por pacote ou por tipo de ensaio), para o estúdio saber de onde veio o contato. No celular, uma barra "Agendar pelo WhatsApp" aparece depois da abertura e some na seção de contato.

## Como editar

- **Preços e pacotes:** procure por `class="plan"` no `index.html`.
- **Fotos do portfólio:** cada foto é um `<li data-cat="...">` dentro de `class="gallery"`. A categoria (`corporativo`, `feminino`, `masculino`, `especial`) controla o filtro. Coloque o arquivo em `assets/img/` e informe `width` e `height` reais da imagem.
- **WhatsApp:** o número aparece nos links `https://wa.me/5562991230095`. Para trocar, substitua em todo o arquivo.

## Pendências

1. **Domínio definitivo.** Hoje o site aponta para `duettoestudio.netlify.app` (canonical, og:image, `robots.txt`, `sitemap.xml`).
2. **Link direto das avaliações no Google.** O botão "Ver no Google" faz uma busca no Maps; trocar pelo link do perfil da empresa.
3. **Mais avaliações.** Só duas estão no site. Vale incluir outras reais do Google.
4. **Fotos em maior resolução.** Algumas fotos do portfólio têm menos de 500 px de largura (`masculino-jovem`, `masculino-poltrona`, `masculino-terno`, `corporativo-terno-azul`). Para telas de alta densidade, o ideal é ter cerca de 1200 px no lado maior, em WebP.
5. **Fonte de títulos.** O manual pede Quiche nos títulos. O site usa só Readex Pro, a fonte de texto do manual. Se o estúdio tiver a licença web da Quiche, ela pode entrar nos `h1`, `h2` e `h3`.

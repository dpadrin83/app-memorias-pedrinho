# Direção Criativa — Portal de Memórias

> Documento de referência visual. Baseado no `CONTEXTO.md` (briefing) e validado em prototipagem visual iterativa.
>
> **Versão 2 — refundação visual.** A versão 1 propunha vestimenta editorial warm (paleta linho/terracota, Fraunces + Manrope). Após prototipagem em código, a direção foi rejeitada por soar "marrom apagado". Esta versão a substitui integralmente. A fonte da verdade visual em código é o arquivo `design-system-v0.2.html`.

---

## 1. Conceito central

**Um lugar moderno e colorido para guardar memórias da família.** Estrutura clara e rica — sidebar com categorias coloridas, abas de modo de visualização, cabeçalhos por categoria — vestida em paleta viva inspirada em Google Material 3. Tem o ritmo de uma ferramenta familiar e a confiança visual de um produto Google.

---

## 2. Princípios de design

1. **A foto manda. A UI ajuda.** A interface é colorida e presente, mas a cor da UI nunca compete com a cor da foto. Onde a foto fala, a UI escuta — fundos neutros nas áreas onde fotos aparecem, cores fortes só nas áreas de navegação e ação.
2. **Cor distribuída por categoria, não pontual.** Cada categoria principal (Fotos, Álbuns, Pessoas, Tags, Favoritos) tem sua cor própria que aparece no item da sidebar, no cabeçalho da tela e nos chips de filtro relacionados. Multi-acento intencional, não decoração.
3. **Hierarquia por tom, não por sombra.** O fundo principal é cinza-creme tonal (`#F8F9FA`), **nunca branco puro**. Cards e modais brancos se destacam contra esse fundo. Sombras existem mas são sutis.
4. **Cantos generosos.** Material 3 — chips e botões pill, FAB com curva grande, cards com 12px. Sem cantos retos seco.
5. **Densidade Material.** Padding interno de cards: 16–24px. Gap no grid de fotos: 8px. Espaço respeitável mas não editorial-amplo.

---

## 3. Referências

- **Google Photos / Google One** — multi-acento Google, distribuição de cor por categoria, FAB azul cheio, cabeçalhos de seção
- **Material 3 (Material You)** — tokens, surfaces tonalizadas, cantos pill, padrões de elevação
- **Notion atual** — sidebar com ícones coloridos por categoria, navegação por seções
- **Pinterest** — grid de fotos sem moldura, fotos como protagonistas
- **Google Calendar / Apple Calendar** — visão mensal com indicadores por categoria

---

## 4. Paleta definitiva

> Fonte da verdade: bloco `:root` de `design-system-v0.2.html`. Estes hex devem ser usados literalmente — não inventar variações.

### 4.1 Acentos cheios (5 cores Google + roxo)

| Token | Hex | Categoria / uso |
|---|---|---|
| `--blue` | `#1A73E8` | **Fotos**. Acento principal. Botão primário, item ativo, foco, links. |
| `--red` | `#EA4335` | **Tags**. Ação destrutiva. Indicador de erro. |
| `--yellow` | `#F9AB00` | **Álbuns**. Indicador de favorito. Aviso suave. |
| `--green` | `#34A853` | **Pessoas**. Confirmação. Indicador de localização. |
| `--purple` | `#9334E6` | **Favoritos**. Chip de busca por IA. |

Cada cor tem uma variante `-strong` (hover/pressed) e uma `-soft` (background de área).

### 4.2 Suaves (fundo de áreas)

| Token | Hex | Uso |
|---|---|---|
| `--blue-soft` | `#E8F0FE` | Cabeçalho de "Fotos", item ativo da sidebar, chip ativo de filtro. |
| `--red-soft` | `#FCE8E6` | Cabeçalho de "Tags". Estado de erro suave. |
| `--yellow-soft` | `#FEF7E0` | Cabeçalho de "Álbuns". Chip de favorito. |
| `--green-soft` | `#E6F4EA` | Cabeçalho de "Pessoas". Confirmação suave. |
| `--purple-soft` | `#F3E8FD` | Cabeçalho de "Favoritos". Chip "IA" no campo de busca. |

### 4.3 Superfícies tonalizadas (hierarquia por tom)

| Token | Hex | Uso |
|---|---|---|
| `--bg` | `#F8F9FA` | **Fundo principal de toda tela.** Cinza-creme tonal — nunca branco puro. |
| `--surface` | `#FFFFFF` | Cards, sidebar, modais. Branco como destaque sobre o fundo. |
| `--surface-low` | `#F1F3F4` | Hover, áreas secundárias, fundo de busca. |
| `--surface-high` | `#E8EAED` | Destaque, divisores fortes. |
| `--surface-highest` | `#DADCE0` | Linha mais marcada antes de virar borda estrutural. |

### 4.4 Textos

| Token | Hex | Uso |
|---|---|---|
| `--text-primary` | `#202124` | Texto principal, títulos. |
| `--text-secondary` | `#5F6368` | Metadados, descrições, labels. |
| `--text-tertiary` | `#80868B` | Placeholder, hints, contagens. |
| `--text-disabled` | `#BDC1C6` | Botão desabilitado, item inativo. |

### 4.5 Bordas

| Token | Hex | Uso |
|---|---|---|
| `--border` | `#DADCE0` | Bordas padrão de cards, inputs. |
| `--border-strong` | `#BDC1C6` | Divisores estruturais (ex: grade do calendário). |

---

## 5. Tipografia

**Roboto Flex** (Google Fonts) — fonte variável, sem-serifa Google. Família única para todo o app — não há serif editorial.

**Pesos usados:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold).

### Escala

| Token | Tamanho | Peso | Line | Uso |
|---|---|---|---|---|
| `--text-display` | 48px / 3rem | 500 | 1.05 | Hero / capa |
| `--text-h1` | 36px / 2.25rem | 500 | 1.15 | Título de seção principal |
| `--text-h2` | 28px / 1.75rem | 500 | 1.2 | Cabeçalho de categoria |
| `--text-h3` | 22px / 1.375rem | 500 | 1.3 | Subtítulo, mês na linha do tempo |
| `--text-h4` | 18px / 1.125rem | 500 | 1.4 | Título de card |
| `--text-body-lg` | 17px / 1.0625rem | 400 | 1.6 | História da foto |
| `--text-body` | 15px / 0.9375rem | 400 | 1.6 | Corpo padrão de UI |
| `--text-small` | 13px / 0.8125rem | 400 | 1.5 | Metadados, labels |
| `--text-caption` | 11px / 0.6875rem | 600 | 1.4 | Eyebrow, tag pequena (uppercase) |

---

## 6. Tom visual

**É:** moderno, colorido, organizado, confiante, familiar (no sentido de "reconhecível pelo padrão Google"), claro, com peso visual.

**Não é:** editorial-revista, warm/terroso, calmo-sóbrio, branco-vazio-SaaS, frio-corporativo, dark, gradiente neon, glassmorphism exagerado, gamificado.

---

## 7. Princípios de UI

- **Cantos:** Material 3 — `--radius-sm` 8px (chip, input), `--radius-md` 12px (card, botão outline, FAB extended), `--radius-lg` 20px (modal), `--radius-full` 9999px (pill button, chip filter, avatar, item ativo da sidebar).
- **Sombras:** sutis. `--shadow-1` em hover de card, `--shadow-2` em dropdown, `--shadow-3` em modal e toast, `--shadow-fab` (azul difusa) só no FAB.
- **Densidade:** Material — padding interno de cards 16–24px, gap em grids de fotos 8px, padding de tela 24–32px.
- **Tratamento de imagem:** sem moldura. Cantos `--radius-md` (12px). Indicadores no canto inferior direito (favorito amarelo, geo verde, pessoa marcada azul) em bolinhas brancas com blur. Overlay sutil no hover com gradiente vertical do topo (escurece 30% só os primeiros 35% da foto, pra mostrar ação de seleção).
- **Cabeçalho de categoria:** cada tela principal tem um header com fundo na cor `-soft` da categoria + ícone colorido cheio + título na cor `-strong` da categoria. Isso garante orientação visual imediata.

---

## 8. Movimento e micro-interações

- **Duração padrão:** 200ms. Hover/foco: 150ms. Modal abrindo / mudança grande: 300ms.
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` — suave, sem bounce.
- **Sem:** parallax, scroll-jacking, animação de "wow", confete.
- **Loading:** skeleton em `--surface-low`, pulse lento (1.2s).

---

## 9. Estrutura de navegação — Sidebar e modos de visualização

**Decisão estrutural mantida.** O Portal **não rola em timeline infinita por padrão**. Tem **sidebar fixa à esquerda** (280px no desktop) + área de conteúdo principal com **abas de modo de visualização** no topo, antecedida por um **cabeçalho colorido por categoria**.

### Sidebar (280px desktop, drawer recolhível no mobile)

1. **Marca** — mark quadrada com gradiente azul→roxo + texto "Memórias" em Roboto Flex 500
2. **Fotos** (raiz, todas as fotos) — ícone neutro, item ativo em `--blue-soft` + texto azul
3. **Álbuns** — ícone amarelo (`--yellow`), contagem do lado direito
4. **Pessoas** — ícone verde (`--green`)
5. **Tags** — ícone vermelho (`--red`)
6. **Favoritos** — ícone roxo (`--purple`)
7. **Section "Álbuns recentes"** — sub-itens menores com bolinha colorida do álbum + nome
8. **Divisor sutil**
9. **Lixeira** + **Configurações** — ícones neutros
10. **Usuário logado** (rodapé) — avatar circular azul + nome + email + botão sair

### Topbar

- **Cabeçalho colorido por categoria** (`.cat-header`) — ícone cheio + título grande + subtítulo + ações da página (Ordenar, Criar, Enviar)
- **Search bar pill** quando relevante — `--surface-low` no fundo, chip "IA" roxo dentro
- **Abas de modo** (Grid / Linha do tempo / Calendário / Mapa / Lista) — sublinhado azul de 3px na ativa

### Modos de visualização

Aplicáveis dentro de "Fotos" e dentro de cada álbum:

1. **Grid** — galeria padrão em 4–5 colunas, gap 8px, agrupada por mês
2. **Linha do tempo** — scroll vertical com agrupamento por mês/ano, cabeçalho sticky
3. **Calendário** — visão mensal com bolinhas coloridas por categoria em cada dia + painel lateral do dia selecionado
4. **Mapa** — fotos georreferenciadas (a definir na implementação)
5. **Lista** — densa, com thumbnail + metadados em linha

---

## 10. Componentes-chave

Catalogados em `design-system-v0.2.html` parte 2. Ordem da v0.2 (entregue):

1. Botão (primary / secondary / outline / ghost / danger × sm/md/lg × com ícone × disabled)
2. FAB extended (azul padrão, amarelo em Álbuns, ícone-only)
3. Chip (filter, removível com X, dropdown, dashed "adicionar")
4. Search bar (pill com chip "IA" roxo)
5. Campo de formulário (input, textarea, com label, hint, erro)
6. Tabs (modo de visualização)
7. Toast / snackbar (preto com check verde, com ação "Desfazer")
8. Avatar (com foto, com iniciais coloridas, vazio, sm/md/lg)
9. Cartão de foto (default, com indicadores no canto, hover overlay, selected)
10. Cartão de álbum (capa + count badge + título com bolinha de cor + meta)
11. Cartão de pessoa (avatar grande + nome + meta)
12. Tag pill (5 cores, com contagem)
13. Empty state (illu circular azul-soft + título + texto + CTA)

**Pendentes pra v0.3:** Login, Mapa, Lista, Lixeira, modal de upload em lote, dialog de confirmação, dropdown menu, loading skeleton, date picker, combobox autocomplete.

---

## 11. Matriz de categorias e cores

| Categoria | Cor cheia | Cor suave (background) | Verbo da ação principal |
|---|---|---|---|
| Fotos | `--blue` #1A73E8 | `--blue-soft` #E8F0FE | Enviar fotos |
| Álbuns | `--yellow` #F9AB00 | `--yellow-soft` #FEF7E0 | Criar álbum |
| Pessoas | `--green` #34A853 | `--green-soft` #E6F4EA | Adicionar pessoa |
| Tags | `--red` #EA4335 | `--red-soft` #FCE8E6 | Criar tag |
| Favoritos | `--purple` #9334E6 | `--purple-soft` #F3E8FD | Favoritar (estrela) |

Toda tela de categoria deve usar essa matriz: header com fundo `*-soft` + ícone na cor cheia + título na cor `*-strong`.

---

## 12. Vocabulário visual

### Tratamento de data (PT-BR sempre)

| Onde | Formato | Exemplo |
|---|---|---|
| Cabeçalho de mês | Mês de Ano | Março de 2026 |
| Data de foto | Dia de mês | 14 de março |
| Quando o ano importa | Dia de mês de ano | 14 de março de 2026 |
| Relativa (uso raro) | "há X" | há 2 dias |
| Técnica (tooltip) | YYYY-MM-DD HH:MM | 2026-03-14 18:32 |

Nunca usar `03/14/2026`, `Mar 14, 2026` ou `2026-03-14` em UI principal.

### Ícones

- Estilo: line, peso 1.5px (interface geral) ou 1.75–2px (em botão primário sobre fundo colorido).
- Tamanho: 16px (chip / inline), 18px (item de menu), 20px (icon-button), 22px (FAB).
- Família de referência: Lucide (line) — desenhar à mão em SVG inline. Não importar lib externa.

---

## 13. Vetar explicitamente

- Paleta editorial warm (linho, terracota, tinta) — direção rejeitada
- Tipografia serif editorial (Fraunces, Playfair, Garamond) — saiu junto com a direção warm
- Branco puro (`#FFFFFF`) como fundo de tela
- Bordas quase invisíveis (`#E8EAED` ou mais claras) em divisores estruturais
- Dark mode no MVP
- Gradientes saturados grandes (gradiente sutil só na mark da sidebar)
- Glassmorphism exagerado (só `backdrop-filter` sutil em toc sticky e blur de 8px em indicadores sobre foto)
- Emoji em UI
- Cor isolada em ponto único (cor deve ser distribuída por categoria)

---

## Próximo passo

A v0.2 do Design System (`design-system-v0.2.html`) é a fonte da verdade visual atual. Próxima etapa é a v0.3 com as telas pendentes (Login, Mapa, Lista, Lixeira, modal, etc), depois implementação no Next.js + Tailwind + shadcn/ui.

# PROMPTS_CURSOR.md — Portal de Memórias

> Sequência de prompts pra usar no Cursor/Claude Code durante o desenvolvimento. Cole um por vez, na ordem. Aguarde o agente terminar antes de seguir.
>
> **Pré-requisitos:** antes de começar essa sequência, rode a Etapa 3 (`PROMPT_DESIGN_SYSTEM.md`) e copie os 3 arquivos pra dentro de `/docs/` do projeto Next.js:
> - `/docs/pesquisa-mercado.md`
> - `/docs/direcao-criativa.md`
> - `/docs/design-system.html`

---

## Prompt 0 — Sempre no início de qualquer sessão

```
Leia, nesta ordem, antes de qualquer ação:
1. CONTEXTO.md (raiz)
2. /docs/direcao-criativa.md
3. /docs/design-system.html (especialmente os tokens em :root e os nomes oficiais dos componentes)

Esses três arquivos são a referência única deste projeto. Não misture decisões, código ou identidade visual com outros projetos.

Quando terminar de ler, me diga em uma linha qual o próximo passo do roadmap que vamos atacar.
```

---

## Prompt 1 — Setup inicial + DS configurado

```
Vamos iniciar o projeto Portal de Memórias seguindo o CONTEXTO.md.

Crie a estrutura inicial:
1. Next.js 15 com App Router, TypeScript, Tailwind
2. Instale e configure shadcn/ui
3. Configure as CSS variables do design-system.html no globals.css e no tailwind.config (puxe os tokens — cores, fontes, espaçamento, radius, shadow, motion)
4. Configure a fonte Roboto Flex via next/font conforme direcao-criativa.md (família única, pesos 400/500/600/700)
5. Instale e configure cliente Supabase (server + browser)
6. Crie estrutura de pastas: app/, components/, lib/, supabase/migrations/, docs/
7. Mova os 3 arquivos de referência pra /docs/ se ainda não estiverem lá
8. Crie .env.example com as variáveis necessárias
9. Configure ESLint e Prettier básicos
10. Crie um README curto

Não implemente nenhuma feature ainda. Só a base + DS configurado. Quando terminar, me mostre a árvore de arquivos e confirme que os tokens estão funcionando (pode criar uma página /style-check temporária pra eu ver).
```

---

## Prompt 2 — Layout base (sidebar + topbar)

```
Implemente o layout base do app seguindo o CONTEXTO.md (seção 5 — Estrutura de navegação) e usando os componentes Sidebar e Topbar do design-system.html.

1. Crie um layout raiz em app/(app)/layout.tsx que renderiza:
   - Sidebar fixa à esquerda (280px) com os itens definidos no CONTEXTO.md:
     - Marca (topo) — mark quadrada com gradiente azul→roxo + "Memórias" em Roboto Flex 500
     - Fotos, Álbuns, Pessoas, Tags, Favoritos
     - Section "Álbuns recentes" com sub-itens (bolinha colorida do álbum + nome)
     - Buscar, Lixeira
     - Rodapé: Configurações + avatar do usuário com logout
     - Cada item de categoria principal usa ícone na cor da categoria (Álbuns amarelo, Pessoas verde, Tags vermelho, Favoritos roxo); item ativo em background da cor `-soft` da categoria + texto na cor cheia
   - Topbar no topo da área de conteúdo: **cabeçalho colorido por categoria** (`.cat-header` do DS — fundo na cor `-soft` + ícone + título grande na cor `-strong`) + abas de modo de visualização + ações da página
   - Área de conteúdo principal (children)

2. Use exatamente os componentes/estilos do design-system.html. Não invente.

3. Responsividade: no mobile (<768px), a sidebar vira drawer recolhível com botão hamburger no topo.

4. Crie as rotas vazias (com placeholders) pra cada item da sidebar:
   - / (Fotos)
   - /albums
   - /people
   - /tags
   - /favorites
   - /search
   - /trash
   - /settings

5. Indicador visual de item ativo na sidebar (rota atual).

Antes de codar, me mostre o wireframe textual do layout e como vai aplicar os componentes do DS. Aguarde aprovação.
```

---

## Prompt 3 — Modelo de dados e migrations

```
Crie as migrations Supabase em /supabase/migrations seguindo o modelo de dados do CONTEXTO.md (seção 4).

Inclua:
- Todas as tabelas (users gerenciada pelo Auth, photos, people, photo_people, tags, photo_tags, albums, album_photos, allowed_emails)
- Extensão pgvector habilitada
- Coluna embedding em photos (vector(1536))
- Soft delete em photos e albums (deleted_at)
- Índices nos campos de busca (event_date, deleted_at, FKs)
- RLS policies em todas as tabelas: acesso só para emails na tabela allowed_emails

Me mostre cada arquivo de migration antes de criar.
```

---

## Prompt 4 — Autenticação

```
Implemente o sistema de autenticação seguindo o CONTEXTO.md (seção 6.1) e usando os componentes do design-system.html.

1. Página /login com formulário email + senha
2. Use o estilo de Input, Button e Card do design system (não invente novos). A tela de login tem layout próprio — sem sidebar, centralizada.
3. Middleware que protege todas as rotas exceto /login
4. Verificação: email do usuário precisa estar em allowed_emails
5. Logout funcional (a partir do avatar no rodapé da sidebar)
6. Helper getCurrentUser() server-side

Use Server Components onde possível. Antes de codar, mostre como vai aplicar os componentes do DS na tela de login.
```

---

## Prompt 5 — Upload de fotos

```
Implemente o upload de fotos seguindo o CONTEXTO.md (seção 6.2):

1. Botão "Upload" na topbar (acima da área de conteúdo) abre um Modal/Drawer do DS com dropzone (react-dropzone)
2. Aceita JPG, PNG, HEIC, WebP — single e múltiplas
3. Use os componentes Modal/Drawer, Button e Empty State do design-system.html
4. Barra de progresso por foto (estilo coerente com DS)
5. Para cada foto:
   - Extrair EXIF (data, lat/lng) com exifr
   - Upload pro Supabase Storage (bucket privado "photos")
   - Gerar thumbnail via Supabase Storage transformations
   - Criar registro em photos com dados extraídos
6. Server Action pra processar o upload
7. Após upload, fecha o modal e atualiza a galeria (rota /)

Não implemente embeddings ainda — fica pra etapa de busca semântica.
```

---

## Prompt 6 — Tela da foto e edição

```
Implemente a tela individual da foto seguindo CONTEXTO.md (seção 6.3) e design-system.html.

1. Rota /photo/[id]
2. Layout: foto grande à esquerda + painel de metadados à direita (desktop) / foto em cima + metadados embaixo (mobile)
3. Aplique a hierarquia visual definida na direção criativa: foto > história > metadados
4. Use os componentes do DS:
   - Input pra título
   - Textarea grande pra descrição (peso visual de "história", `--text-body-lg` conforme direção)
   - Date picker pra data
   - Combobox pra pessoas (cria nova se não existe)
   - Chips de tags com criação inline
5. Auto-save com debounce de 800ms (mostrar indicador "salvando..." / "salvo" no estilo do DS)
6. Botão "Mover pra lixeira" (variante destrutiva do DS)
7. Server Actions pra updates
8. A sidebar continua presente; a topbar mostra "Foto" + botão de voltar

Use React Hook Form + Zod pra validação. Antes de codar, me mostre o layout em wireframe textual.
```

---

## Prompt 7 — Modo Grid + modo Linha do tempo

```
Implemente os dois primeiros modos de visualização da rota / (Fotos) seguindo CONTEXTO.md (seção 6.4) e design-system.html.

A topbar da rota / tem abas: [Grid] [Linha do tempo] [Mapa] [Lista]. Implemente os dois primeiros agora.

1. Modo Grid (default):
   - Grid responsivo (2 col mobile, 3-5 col desktop conforme largura)
   - Lazy loading com next/image
   - Cartão de foto do DS
   - Click leva pra /photo/[id]

2. Modo Linha do tempo:
   - Fotos agrupadas por mês/ano usando o "Grupo de linha do tempo" do DS
   - Header sticky com a data do grupo no formato PT-BR por extenso ("Março de 2026")
   - Scroll infinito ou paginação por mês

3. A escolha de modo persiste em URL params (?view=grid ou ?view=timeline) pra ser compartilhável.

4. Estado vazio (Empty State do DS) quando ainda não há fotos.

Foco em performance no mobile. Antes de codar, mostre como vai organizar os componentes.
```

---

## Prompt 8 — Busca textual e filtros

```
Implemente busca textual e filtros seguindo CONTEXTO.md (seção 6.5):

1. Item "Busca" da sidebar leva pra rota /search
2. Página /search com:
   - Search Input do DS no topo (com toggle de "busca por IA" desabilitado por enquanto — implementação semântica vem depois)
   - Resultado da busca textual (procura em title, description, location, tags.name, people.name)
   - Filtros laterais (desktop) ou drawer no mobile:
     - Período (de/até)
     - Pessoas (multi-select usando combobox do DS)
     - Tags (multi-select com chips do DS)
3. Use full-text search do Postgres (não LIKE)
4. URL params refletem filtros (?q=...&from=...&to=...&people=...&tags=...)
5. Resultados aparecem em modo Grid por padrão, com opção de trocar pra Linha do tempo via abas

Ainda sem busca semântica — próximo prompt.
```

---

## Prompt 9 — Álbuns

```
Implemente álbuns seguindo CONTEXTO.md (seção 6.6):

1. Rota /albums = lista de álbuns (Cartão de álbum do DS, em grid)
2. Rota /albums/[id] = álbum aberto com as mesmas abas de modo de visualização (Grid / Linha do tempo)
3. Criar álbum: Modal/Drawer do DS com título, descrição, capa
4. Adicionar fotos: botão "+ adicionar fotos" abre seletor
5. Remover foto do álbum
6. Reordenar (drag and drop com dnd-kit, só no modo Grid)
7. Editar álbum
8. Deletar álbum (soft delete)

Server Actions pra todas as mutações.
```

---

## Prompt 10 — Pessoas e Tags (telas dedicadas)

```
Implemente as rotas /people e /tags da sidebar seguindo CONTEXTO.md.

1. Rota /people:
   - Lista de pessoas em grid (Card de pessoa do DS: avatar + nome + contagem de fotos)
   - Click em uma pessoa leva pra /people/[id] que mostra todas as fotos dela (mesmo layout de modos de visualização)
   - Botão pra editar nome e relationship
   - Botão pra deletar pessoa (remove de todas as fotos, mas não deleta fotos)

2. Rota /tags:
   - Lista de tags como Chips grandes (componente do DS)
   - Click em uma tag leva pra /tags/[id] (mesmo layout de modos de visualização)
   - Botão pra renomear
   - Botão pra deletar tag (remove de todas as fotos)

Mantém consistência visual com o resto do app.
```

---

## Prompt 11 — Modo Mapa + modo Lista

```
Implemente os dois modos de visualização restantes nas rotas / (Fotos), /albums/[id], /people/[id] e /tags/[id]:

1. Modo Mapa:
   - Bibliotecas: MapLibre GL JS (preferência) ou Leaflet
   - Mostra fotos com lat/lng como marcadores no mapa
   - Click no marcador abre preview da foto
   - Filtra automaticamente fotos sem geolocalização (com aviso discreto)
   - Estilo de mapa coerente com a paleta Material do DS: fundo claro tonalizado (cinza-creme), marcadores em `--blue` cheio, sem cores saturadas competindo com as fotos

2. Modo Lista:
   - Visualização densa: thumbnail pequeno + título + data + local + pessoas + tags numa linha
   - Útil pra edição em lote (selecionar várias e atribuir tag/pessoa, mover pra álbum)
   - Checkbox em cada linha; barra de ações flutuante no rodapé quando há seleção

Use os componentes do DS sempre que possível. Se faltar algo, atualize o design-system.html primeiro e me avise.
```

---

## Prompt 12 — Busca semântica com IA

```
Implemente busca semântica seguindo CONTEXTO.md (seção 6.5):

1. Setup OpenAI client (text-embedding-3-small, 1536 dimensões)
2. Server Action / Edge Function gerar_embedding(photo_id):
   - Concatena title + description + location + nomes das pessoas + tags
   - Gera embedding
   - Salva em photos.embedding
3. Trigger automático após upload e após edição de descrição
4. Comando manual em /settings pra regenerar todos
5. Na busca (rota /search):
   - Toggle "busca por IA" no Search Input do DS (já existe da etapa anterior, agora ativa)
   - Quando ativo: gera embedding da query, busca por similaridade com pgvector (operador <=>)
   - Top 30 resultados
   - Quando inativo: usa busca textual da etapa anterior

Comece mostrando o plano de implementação antes de codar.
```

---

## Prompt 13 — Lixeira e soft delete

```
Implemente lixeira seguindo CONTEXTO.md (seção 6.7):

1. Rota /trash = lista de fotos com deleted_at não nulo (use Empty State do DS quando vazia)
2. Mesmos modos de visualização (Grid / Linha do tempo / Lista)
3. Botão "restaurar" (zera deleted_at) em cada foto
4. Botão "apagar definitivamente" (DELETE no banco + DELETE no storage) com confirmação (Modal do DS) em cada foto
5. Botão "esvaziar lixeira" no topo
6. Edge Function agendada que apaga definitivamente fotos com deleted_at > 30 dias
7. Mesma lógica pra álbuns (uma seção separada em /trash ou aba)

Documente o cron no README.
```

---

## Prompt 14 — Auditoria visual e refinamento

```
Auditoria visual completa. Compare cada tela construída com o design-system.html e a direcao-criativa.md.

Pra cada tela do app, me devolva:
1. O que está aderente ao DS
2. O que escapou (cores fora dos tokens, fontes erradas, espaçamento improvisado, componentes não-oficiais)
3. Sugestão de correção

Depois de eu aprovar as correções, aplique. Não invente nada novo — só aproxime do que já está definido nos arquivos de referência.

Telas pra auditar:
- /login
- / (com cada modo de visualização)
- /photo/[id]
- /albums e /albums/[id]
- /people e /people/[id]
- /tags e /tags/[id]
- /search
- /trash
- /settings
- Modal de upload
- Sidebar (estados ativo/hover)
- Topbar (todas as variações)
```

---

## Prompt 15 — Mobile, PWA e deploy

```
Última etapa antes de entregar:

1. Auditoria mobile: revise todas as telas no viewport 375px. Ajuste o que estiver quebrado ou apertado. A sidebar deve estar funcionando como drawer.
2. PWA básico: manifest.json, ícone (use a paleta do DS), instalável no celular.
3. Performance: rode Lighthouse, ajuste imagens, lazy loading, code splitting onde fizer sentido.
4. Deploy Vercel + configuração do domínio (vou passar quando estiver pronto).
5. Documente no README como rodar localmente e como fazer deploy.
6. Crie usuário de teste no Supabase e adicione meu email em allowed_emails.

Quando terminar, gere o relatório de encerramento conforme seção 13 do CONTEXTO.md.
```

---

## Prompts de manutenção (depois do MVP)

### Quando algo quebrar
```
Antes de mexer, leia CONTEXTO.md + direcao-criativa.md + design-system.html. Depois investigue o problema: [descreva o bug]. Mostre o diagnóstico antes de propor correção.
```

### Quando quiser adicionar feature
```
Antes de mexer, leia os 3 arquivos de referência. Quero adicionar: [feature]. Isso está no escopo MVP ou é v2? Se for v2, atualize o CONTEXTO.md antes de implementar. Se a feature precisar de componente novo, atualize antes o design-system.html.
```

### Quando precisar de revisão geral
```
Leia os 3 arquivos de referência e faça auditoria do código atual. Aponte:
1. O que está fora do padrão definido (técnico ou visual)
2. Dívida técnica acumulada
3. Componentes do DS que ficaram sem uso ou que faltam
4. Sugestões de melhoria sem expandir escopo
```

# CONTEXTO.md — Portal de Memórias

> **Atenção, agente:** este é o documento de referência único deste projeto. Sempre que iniciar uma sessão, leia este arquivo antes de qualquer ação. Não misture identidade visual, código ou decisões com outros projetos do Estúdio 33.

---

## 1. Visão geral

**Nome provisório:** Portal de Memórias (a definir)

**O que é:** Web app responsivo, privado, que funciona como um portal de memórias visuais do meu filho. Cada foto vira um registro com história, data, local, pessoas marcadas e tags. O app é navegável por **galeria estática com modos de visualização** (grid, linha do tempo, mapa, lista), busca textual, busca por IA e álbuns criados manualmente. Navegação via **sidebar fixa**.

**Para quem:** Eu (Danilo) e minha esposa/familiares próximos. Acesso restrito por login. Não há perfil público nem compartilhamento externo.

**Por que existe:** Centralizar memórias do meu filho em um lugar próprio, com história contada por trás de cada foto — não como rede social, mas como diário visual de família.

---

## 2. Princípios de produto

- **Foco na memória, não no engajamento.** Sem likes, sem comentários, sem notificações de rede social.
- **Aconchego antes de performance visual.** Visual calmo, tipografia respirada, paleta sóbria.
- **História importa tanto quanto a foto.** O campo de descrição é central, não acessório.
- **Privacidade por padrão.** Tudo é privado, login obrigatório, storage controlado.
- **Mobile-responsivo, mas pensado desktop-first na estrutura.** A sidebar fixa pede tela maior; no mobile vira drawer recolhível.

---

## 3. Usuários e permissões

- Acesso por login (Supabase Auth — email + senha ou magic link)
- Lista pequena de usuários autorizados (eu cadastro manualmente quem entra)
- Todos os usuários autorizados têm permissão total: ver, subir, editar, deletar
- Sem hierarquia de permissões no MVP

---

## 4. Modelo de dados

### `users` (gerenciado pelo Supabase Auth)
- `id`, `email`, `name`, `created_at`

### `photos`
- `id` (uuid)
- `storage_path` (string — caminho no Supabase Storage)
- `thumbnail_path` (string)
- `title` (string, opcional)
- `description` (text — campo livre pra contar a história)
- `event_date` (timestamp — data do evento, extraída de EXIF ou editada)
- `location` (string — cidade/endereço livre)
- `lat`, `lng` (opcional, do EXIF)
- `uploaded_by` (fk users)
- `uploaded_at` (timestamp)
- `updated_at` (timestamp)
- `deleted_at` (timestamp, soft delete)
- `embedding` (vector — pgvector, para busca semântica)

### `people`
- `id` (uuid)
- `name` (string)
- `relationship` (string, opcional — ex: "tio", "avó")
- `created_at`

### `photo_people` (relação N:N)
- `photo_id`, `person_id`

### `tags`
- `id`, `name` (string única), `created_at`

### `photo_tags` (relação N:N)
- `photo_id`, `tag_id`

### `albums`
- `id`, `title`, `description`, `cover_photo_id`, `created_by`, `created_at`

### `album_photos` (relação N:N)
- `album_id`, `photo_id`, `position`

---

## 5. Estrutura de navegação

> **Decisão estrutural:** o Portal não rola em timeline infinita por padrão. A navegação principal é via **sidebar fixa à esquerda** + área de conteúdo principal com **abas de modo de visualização** no topo.

### Sidebar (largura ~240px no desktop, drawer recolhível no mobile)

1. Marca (logo/nome, discreto)
2. **Fotos** — raiz, todas as fotos
3. **Álbuns**
4. **Pessoas**
5. **Tags**
6. **Busca** — input dedicado, com toggle de busca por IA (semântica)
7. **Lixeira**
8. **Configurações** (rodapé)
9. **Usuário logado** — avatar + nome + logout (rodapé)

### Modos de visualização (abas no topo da área principal)

Aplicáveis dentro de "Fotos" e dentro de cada álbum:

1. **Grid** — galeria padrão em grade quadrada (3–5 colunas conforme largura)
2. **Linha do tempo** — agrupado por mês/ano, com cabeçalho sticky
3. **Mapa** — fotos georreferenciadas em mapa (quando há lat/lng)
4. **Lista** — densa, com thumbnail + metadados em linha (útil pra edição em lote)

---

## 6. Funcionalidades — MVP

### 6.1. Autenticação
- Login com email/senha (Supabase Auth)
- Tela de login simples
- Logout
- Lista fixa de emails autorizados (configurada via env ou tabela `allowed_emails`)

### 6.2. Upload
- Upload manual (uma foto)
- Upload em lote (múltiplas de uma vez, com barra de progresso)
- Extração automática de EXIF: data, lat/lng quando disponível
- Geração de thumbnail (Supabase Storage transformations)
- Validação: aceita JPG, PNG, HEIC, WebP

### 6.3. Edição de metadados da foto
- Tela individual da foto com formulário lateral (desktop) / inferior (mobile)
- Campos editáveis:
  - Título
  - Data do evento
  - Local (input texto livre)
  - Descrição (textarea grande)
  - Pessoas marcadas (autocomplete que cria pessoa nova se não existe)
  - Tags (input que cria tag nova se não existe)
- Salvar automático com debounce (preferência)

### 6.4. Visualizações
- **Grid:** galeria principal, lazy loading
- **Linha do tempo:** scroll vertical com agrupamento por mês/ano
- **Mapa:** fotos com geolocalização em mapa interativo
- **Lista:** visualização densa para edição em lote
- **Foto individual:** imagem grande + painel lateral de metadados (desktop) ou abaixo (mobile)
- **Álbuns:** lista de álbuns + visualização interna (com mesmos modos de visualização)

### 6.5. Busca
- **Busca textual:** caixa de busca global que procura em título, descrição, local, pessoas, tags
- **Filtro por data:** seletor de período (de/até)
- **Filtro por pessoa:** seleção de uma ou mais pessoas marcadas
- **Filtro por tag:** seleção de tags
- **Busca semântica (IA):** input em linguagem natural ("fotos na praia", "natal do ano passado"). Implementação: embeddings das descrições + tags + pessoas, busca por similaridade com pgvector.

### 6.6. Álbuns
- Criar álbum (título, descrição, capa)
- Adicionar fotos a um álbum (a partir do grid ou da foto individual)
- Remover foto de um álbum
- Reordenar fotos no álbum
- Deletar álbum (soft delete)

### 6.7. Soft delete
- Foto deletada vai pra lixeira (não é apagada do storage imediatamente)
- Tela de lixeira pra restaurar ou apagar definitivamente
- Limpeza automática após 30 dias (cron/edge function)

---

## 7. Fora do escopo (MVP)

- Compartilhamento público de fotos ou álbuns
- Comentários, likes, reações
- Edição de imagem (crop, filtros) dentro do app
- App nativo iOS/Android
- Áudio narrado da história (v2)
- Reconhecimento facial automático (v2 — pessoas marcadas são manuais)
- Import direto de Google Photos / iCloud (v2)
- Notificações push

---

## 8. Stack técnica

- **Framework:** Next.js 15+ (App Router) + React + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Banco + Auth + Storage:** Supabase
- **Vector search:** pgvector no Supabase
- **Embeddings:** OpenAI text-embedding-3-small (ou alternativa via Supabase AI)
- **Deploy:** Vercel
- **Otimização de imagens:** next/image + Supabase Storage transformations
- **Form/validation:** React Hook Form + Zod
- **Upload:** react-dropzone ou similar
- **Mapa:** MapLibre GL ou Leaflet (a decidir na implementação)

---

## 9. Arquitetura — pontos importantes

- **Server Components** por padrão; Client Components só quando precisar de interação
- **Server Actions** para mutações (upload, edit, delete)
- **RLS (Row Level Security)** no Supabase: todas as tabelas com policy que verifica se o usuário está na lista autorizada
- **Soft delete** em `photos` e `albums` via coluna `deleted_at`
- **Embeddings** gerados em background após upload e após edição de descrição (edge function ou trigger)
- **Storage:** bucket privado, acesso apenas via signed URLs

---

## 10. Identidade visual

> **A identidade visual e o Design System estão definidos em arquivos separados:**
> - `direcao-criativa.md` — conceito, paleta, tipografia, princípios, tom, componentes (v2 — atual)
> - `design-system-v0.2.html` — DS completo em código, com tokens (CSS variables), componentes, estados, motion, e recortes das telas. **Fonte da verdade visual.**
>
> **Toda decisão visual durante o desenvolvimento deve consultar esses arquivos.** Não inventar componentes, cores, fontes ou espaçamento fora do que estiver definido lá. Se faltar algo, atualizar o `design-system-v0.2.html` (ou bump pra v0.3) antes de usar no app.

### Direção visual confirmada (resumo da `direcao-criativa.md` v2)

- **Conceito:** "Um lugar moderno e colorido para guardar memórias da família." (A direção v1 — editorial warm com paleta linho/terracota — foi rejeitada na prototipagem; substituída integralmente.)
- **Estrutura:** sidebar fixa (280px) + galeria estática com abas de modo de visualização (Grid, Linha do tempo, Calendário, Mapa, Lista). Estrutura funcional, **não** scroll infinito. Cada tela de categoria principal tem um cabeçalho colorido (`.cat-header`) na cor da categoria.
- **Vestimenta:** Material 3 colorido — paleta acentos Google (azul #1A73E8 + vermelho #EA4335 + amarelo #F9AB00 + verde #34A853 + roxo #9334E6) + surfaces tonalizadas (fundo `--bg` #F8F9FA, nunca branco puro). Tipografia Roboto Flex única, sem serif editorial. Cantos generosos Material (chip pill, FAB 12px, botões pill). Sombras sutis.
- **Cor por categoria:** Fotos=azul, Álbuns=amarelo, Pessoas=verde, Tags=vermelho, Favoritos=roxo. Cor distribuída em header + ícone + chip ativo de cada categoria.
- **Vetar:** paleta editorial warm/terrosa, serif (Fraunces e similares), branco puro como fundo, bordas quase invisíveis, dark mode no MVP, gradientes saturados grandes, emoji em UI, glassmorphism exagerado.

---

## 11. Roadmap MVP

1. Setup Next.js + Supabase + Tailwind + shadcn
2. Auth (login + lista autorizada + RLS)
3. Modelo de dados + migrations
4. Layout base: sidebar + topbar + área de conteúdo
5. Upload (single + lote) + extração EXIF + thumbnail
6. Tela de foto individual + edição de metadados
7. Modo Grid + modo Linha do tempo
8. Pessoas e tags (CRUD inline no formulário da foto)
9. Busca textual + filtros
10. Álbuns
11. Modo Mapa + modo Lista
12. Busca semântica (embeddings + pgvector)
13. Soft delete + lixeira
14. Refinamento visual + responsividade mobile (sidebar vira drawer)
15. Deploy + domínio + testes com a família

---

## 12. Regras operacionais para o agente

- **Primeira ação de toda sessão:** ler este `CONTEXTO.md` inteiro antes de qualquer código.
- **Antes de criar arquivos novos:** verificar se já existe estrutura no projeto.
- **Migrations Supabase:** sempre versionadas em `/supabase/migrations`, nunca alterações diretas via dashboard.
- **Variáveis sensíveis:** `.env.local` (nunca commitar). Documentar em `.env.example`.
- **Commits:** mensagens curtas em PT-BR, no padrão `feat:`, `fix:`, `chore:`, `refactor:`.
- **Não inventar features fora do escopo MVP.** Se surgir dúvida, perguntar antes de implementar.
- **Não inventar visual.** Consultar `direcao-criativa.md` e `design-system.html` antes de criar qualquer componente novo.

---

## 13. Relatório de encerramento

Ao concluir o MVP, gere o seguinte bloco curto:

```
**Valor de mercado:** R$ X (estimativa equipe freelancer/PJ Brasil)
**Pessoas envolvidas:** X profissionais

**Feito em:** [tempo real]
**Envolvidos:** 1 pessoa (Danilo + IA)
```

Analise o repositório pra estimar. Não escreva nada além desse bloco.

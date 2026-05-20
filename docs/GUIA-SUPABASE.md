# Guia rápido — Quais chaves do Supabase copiar

> Documento de referência pra não confundir nunca mais. O Supabase está em transição entre dois sistemas de chaves — o novo (`sb_publishable_...` / `sb_secret_...`) e o legacy JWT (`anon` / `service_role` que começam com `eyJhbG...`). **Use sempre o sistema novo.**

---

## TL;DR — As 3 variáveis do `.env.local`

| Variável (no `.env.local`) | O que copiar do Supabase | Aparência |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Publishable key** (a "default") | começa com `sb_publishable_` |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret key** (a "default") | começa com `sb_secret_` |

São essas 3 chaves. Mais nada.

---

## Onde achar no Supabase

1. Entra no projeto
2. Menu lateral esquerdo → **Project Settings** (ícone de engrenagem ⚙️)
3. Clica em **API** no submenu
4. Você vai ver:
   - **Project URL** — no topo
   - **Publishable key** — seção do meio (copia o valor `sb_publishable_...`)
   - **Secret keys** — seção de baixo (clica em "Reveal" e copia o `sb_secret_...`)

Vai aparecer também uma seção antiga com `anon public` e `service_role secret` (JWT format, começando com `eyJhbG...`). **Ignora.** Use só as novas.

---

## Regra de ouro de segurança

| Chave | Onde pode aparecer | Risco se vazar |
|---|---|---|
| **Project URL** | Qualquer lugar (browser, código, screenshot, repo público) | Nenhum |
| **Publishable key** (`sb_publishable_`) | Browser, código que vai pro client, screenshot | Nenhum — desde que tenha RLS ativo |
| **Secret key** (`sb_secret_`) | APENAS no servidor (Server Actions, Edge Functions, `.env.local`) | **ALTÍSSIMO** — bypassa toda segurança do RLS |

**Nunca cole a `sb_secret_` em screenshot, chat público, repo, Notion compartilhado, Drive aberto.**

Se vazar: vai no Supabase → API → "+ New secret key" → cria uma nova → deleta a antiga → atualiza seu `.env.local`.

---

## Onde colar no projeto Next.js

Quando o Cursor terminar o Prompt 1, ele vai te pedir pra criar um arquivo chamado `.env.local` na raiz de `portal-memorias/`. Esse arquivo **NÃO vai pro git** (já está no `.gitignore`).

Conteúdo do `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ereitlblriqhsvtkgijq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_bFgIBUsIsu1lzEFScSHUCw_J1Kep...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_jxI_7...
```

Substitui os valores acima pelas chaves do **seu** projeto Supabase.

---

## Check de segurança do seu print

No screenshot que você me mandou agora:
- ✅ **Project URL** — apareceu, não tem problema (é pública)
- ✅ **Publishable key** (`sb_publishable_bFgIBUsIsu1lzEFScSHUCw_J1Kep...`) — apareceu, não tem problema (é pública por design)
- ✅ **Secret key** (`sb_secret_jxI_7•••••`) — estava censurada, não vazou
- ✅ **anon public** (`eyJhbG...`) — apareceu, mas é só a versão JWT antiga da publishable, também segura
- ✅ **service_role secret** — estava com botão "Reveal", não vazou

Tudo ok. Não precisa rotacionar nenhuma chave.

---

## E se eu vir tutorial antigo usando `anon` e `service_role`?

Vai funcionar igual. O cliente `@supabase/supabase-js` aceita os dois formatos. Mas pra projeto novo, prefere as novas (`sb_publishable_` / `sb_secret_`) porque:

1. São mais legíveis (você vê o tipo no nome da chave)
2. Podem ser rotacionadas individualmente (criar nova, deletar antiga, sem invalidar tudo)
3. Supabase tá empurrando esse padrão pra frente — as JWT vão eventualmente sair

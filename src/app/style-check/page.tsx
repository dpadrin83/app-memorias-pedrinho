/**
 * /style-check — Página temporária para validar tokens do Design System.
 * Apagar antes do deploy.
 */

const accents = [
  { name: "Azul", bg: "bg-blue", soft: "bg-blue-soft", text: "text-blue-strong", hex: "#1A73E8" },
  { name: "Vermelho", bg: "bg-red", soft: "bg-red-soft", text: "text-red-strong", hex: "#EA4335" },
  { name: "Amarelo", bg: "bg-yellow", soft: "bg-yellow-soft", text: "text-yellow-strong", hex: "#F9AB00" },
  { name: "Verde", bg: "bg-green", soft: "bg-green-soft", text: "text-green-strong", hex: "#34A853" },
  { name: "Roxo", bg: "bg-purple", soft: "bg-purple-soft", text: "text-purple-strong", hex: "#9334E6" },
] as const;

const surfaces = [
  { name: "bg", className: "bg-bg", hex: "#F8F9FA" },
  { name: "surface", className: "bg-surface", hex: "#FFFFFF" },
  { name: "surface-low", className: "bg-surface-low", hex: "#F1F3F4" },
  { name: "surface-high", className: "bg-surface-high", hex: "#E8EAED" },
  { name: "surface-highest", className: "bg-surface-highest", hex: "#DADCE0" },
] as const;

const shadows = [
  { name: "shadow-1", className: "shadow-1", hint: "hover de card" },
  { name: "shadow-2", className: "shadow-2", hint: "dropdown" },
  { name: "shadow-3", className: "shadow-3", hint: "modal, toast" },
  { name: "shadow-fab", className: "shadow-fab", hint: "FAB (sombra azul)" },
] as const;

const typography = [
  { token: "text-display", className: "text-display", sample: "Memórias — Display 48" },
  { token: "text-h1", className: "text-h1", sample: "H1 — Portal de Memórias" },
  { token: "text-h2", className: "text-h2", sample: "H2 — Cabeçalho de categoria" },
  { token: "text-h3", className: "text-h3", sample: "H3 — Subtítulo, mês" },
  { token: "text-h4", className: "text-h4", sample: "H4 — Título de card" },
  { token: "text-body-lg", className: "text-body-lg", sample: "Body large — história da foto" },
  { token: "text-body", className: "text-body", sample: "Body — corpo padrão de UI" },
  { token: "text-small", className: "text-small", sample: "Small — metadados, labels" },
  { token: "text-caption", className: "text-caption uppercase tracking-wider", sample: "Caption — eyebrow" },
] as const;

export default function StyleCheckPage() {
  return (
    <main className="min-h-screen bg-bg px-6 py-10 text-text-primary sm:px-10">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-2">
          <p className="text-caption uppercase tracking-wider text-text-tertiary">
            Temporário · descartar antes do deploy
          </p>
          <h1 className="text-h1">Style check — Design System</h1>
          <p className="text-body text-text-secondary">
            Validação dos tokens (paleta acentos Google + variantes -strong / -soft, surfaces
            tonalizadas, tipografia Roboto Flex, sombras). Fonte da verdade:{" "}
            <code className="rounded bg-surface-low px-1.5 py-0.5 text-small">
              /docs/design-system.html
            </code>
            .
          </p>
        </header>

        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <h2 className="text-h3">1. Acentos — cheio + soft + strong</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {accents.map((a) => (
              <div
                key={a.name}
                className="overflow-hidden rounded-md border border-border bg-surface"
              >
                <div className={`flex h-16 items-end justify-between p-3 text-text-inverse ${a.bg}`}>
                  <span className="text-small font-medium">{a.name}</span>
                  <span className="text-caption uppercase tracking-wider opacity-90">
                    {a.hex}
                  </span>
                </div>
                <div className={`px-4 py-3 ${a.soft}`}>
                  <p className={`text-h4 ${a.text}`}>{a.name}</p>
                  <p className={`text-small ${a.text}`}>soft + strong</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <h2 className="text-h3">2. Surfaces tonalizadas</h2>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {surfaces.map((s) => (
              <div
                key={s.name}
                className={`rounded-md border border-border p-5 ${s.className}`}
              >
                <p className="text-small font-medium text-text-primary">{s.name}</p>
                <p className="text-caption uppercase tracking-wider text-text-tertiary">
                  {s.hex}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <h2 className="text-h3">3. Tipografia — Roboto Flex</h2>
          <div className="space-y-3 rounded-md border border-border bg-surface p-6">
            {typography.map((t) => (
              <div key={t.token} className="flex items-baseline gap-4">
                <code className="w-32 shrink-0 text-caption uppercase tracking-wider text-text-tertiary">
                  {t.token}
                </code>
                <p className={`${t.className} text-text-primary`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        <section className="space-y-4">
          <h2 className="text-h3">4. Sombras</h2>
          <div className="grid gap-6 rounded-md bg-bg p-8 sm:grid-cols-2 lg:grid-cols-4">
            {shadows.map((s) => (
              <div
                key={s.name}
                className={`flex flex-col items-center justify-center gap-1 rounded-md bg-surface p-6 ${s.className}`}
              >
                <p className="text-small font-medium text-text-primary">{s.name}</p>
                <p className="text-caption uppercase tracking-wider text-text-tertiary">
                  {s.hint}
                </p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-border pt-6 text-small text-text-tertiary">
          Se tudo acima estiver com cor, fonte e sombra corretas, os tokens carregaram.
        </footer>
      </div>
    </main>
  );
}

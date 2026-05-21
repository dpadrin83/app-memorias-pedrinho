import { Button } from "@/components/ui/button";

const accentSwatches = [
  { name: "Azul", bg: "bg-blue", soft: "bg-blue-soft", text: "text-blue-strong" },
  { name: "Vermelho", bg: "bg-red", soft: "bg-red-soft", text: "text-red-strong" },
  {
    name: "Amarelo",
    bg: "bg-yellow",
    soft: "bg-yellow-soft",
    text: "text-yellow-strong",
  },
  { name: "Verde", bg: "bg-green", soft: "bg-green-soft", text: "text-green-strong" },
  {
    name: "Roxo",
    bg: "bg-purple",
    soft: "bg-purple-soft",
    text: "text-purple-strong",
  },
] as const;

export default function StyleCheckPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 p-8">
      <header className="space-y-2">
        <p className="text-caption uppercase text-text-tertiary">Temporário</p>
        <h1 className="text-h1 text-text-primary">Style check — Design System</h1>
        <p className="text-body text-text-secondary">
          Validação dos tokens do Portal de Memórias. Remover esta rota antes do
          deploy.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-h3 text-text-primary">Tipografia</h2>
        <div className="space-y-3 rounded-lg border border-border bg-surface p-6">
          <p className="text-display text-text-primary">Display — Memórias</p>
          <p className="text-h1 text-text-primary">H1 — Portal de Memórias</p>
          <p className="text-h2 text-text-primary">H2 — Seção principal</p>
          <p className="text-h3 text-text-primary">H3 — Subseção</p>
          <p className="text-h4 text-text-primary">H4 — Título de card</p>
          <p className="text-body-lg text-text-secondary">
            Body large — texto de apoio com mais respiro.
          </p>
          <p className="text-body text-text-secondary">
            Body — parágrafo padrão do app.
          </p>
          <p className="text-small text-text-tertiary">Small — metadados</p>
          <p className="text-caption uppercase text-text-tertiary">
            Caption — label
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-h3 text-text-primary">Acentos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accentSwatches.map((swatch) => (
            <div
              key={swatch.name}
              className="overflow-hidden rounded-lg border border-border bg-surface"
            >
              <div className={`h-12 ${swatch.bg}`} />
              <div className={`px-4 py-3 ${swatch.soft}`}>
                <p className={`text-h4 ${swatch.text}`}>{swatch.name}</p>
                <p className={`text-small ${swatch.text}`}>soft + strong</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-h3 text-text-primary">Surfaces</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-bg p-4 text-small">
            bg
          </div>
          <div className="rounded-lg border border-border bg-surface p-4 text-small">
            surface
          </div>
          <div className="rounded-lg border border-border bg-surface-low p-4 text-small">
            surface-low
          </div>
          <div className="rounded-lg border border-border bg-surface-high p-4 text-small">
            surface-high
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-h3 text-text-primary">shadcn Button</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>
    </div>
  );
}

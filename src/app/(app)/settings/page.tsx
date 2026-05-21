import { EmbeddingsPanel } from "@/components/settings/embeddings-panel";

export default function SettingsPage() {
  const aiEnabled = Boolean(process.env.OPENAI_API_KEY?.trim());

  return (
    <div className="screen-body settings-page">
      <header className="settings-header">
        <h1 className="settings-title">Configurações</h1>
        <p className="settings-lead">
          Preferências do portal e manutenção da busca semântica.
        </p>
      </header>
      <EmbeddingsPanel enabled={aiEnabled} />
    </div>
  );
}

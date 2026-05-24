import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { isPublicSupabaseEnvConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (!isPublicSupabaseEnvConfigured()) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p className="field-hint field-error">
            Configuração incompleta na Vercel: defina{" "}
            <strong>NEXT_PUBLIC_SUPABASE_URL</strong> e{" "}
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> (chave anon/publishable
            do Supabase), salve e faça <strong>Redeploy</strong> do projeto.
          </p>
        </div>
      </div>
    );
  }

  try {
    const user = await getCurrentUser();
    if (user) {
      redirect("/");
    }
  } catch (error) {
    console.error("[login] sessão:", error);
  }

  const params = searchParams ? await searchParams : {};
  const serverError =
    params.error === "unauthorized"
      ? "Este email não está autorizado a acessar o portal."
      : undefined;

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-mark">M</span>
          <div>
            <h1 className="login-title">Memórias</h1>
            <p className="login-sub">Portal privado da família</p>
          </div>
        </div>
        <LoginForm serverError={serverError} />
      </div>
    </div>
  );
}

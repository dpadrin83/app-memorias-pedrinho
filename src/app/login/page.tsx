import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentUser } from "@/lib/auth/get-current-user";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p className="login-sub" style={{ color: "var(--destructive, #b91c1c)" }}>
            Configuração incompleta na Vercel: defina{" "}
            <strong>NEXT_PUBLIC_SUPABASE_URL</strong> e{" "}
            <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> (anon/publishable do
            Supabase) e faça redeploy.
          </p>
        </div>
      </div>
    );
  }

  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  const params = await searchParams;
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
            <p className="login-sub">Entre com sua conta da família</p>
          </div>
        </div>
        <LoginForm serverError={serverError} />
      </div>
    </div>
  );
}

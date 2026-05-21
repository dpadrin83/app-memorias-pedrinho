import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
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

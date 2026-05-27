"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Para fazer o redirecionamento
import { authLogin } from "@/services/auth"; // Serviço de autenticação

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  // Estados dos campos do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados de interface (UI)
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função disparada no envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação simples antes de disparar a requisição
    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      
      // Chamada à API enviando as credenciais
      const response = await authLogin({ email, password });
      
      // Armazena o token JWT retornado pelo backend nos cookies ou localStorage
      if (response && response.token) {
        localStorage.setItem("@AzulFinancas:token", response.token);
      }

      // Redireciona o usuário para o painel principal
      router.push("/dashboard");
      
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Falha ao realizar o login. Verifique suas credenciais."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen overflow-hidden bg-[#EEF3FB]">
      {/* LEFT SIDE - DASHBOARD ILLUSTRATION */}
      <section className="relative hidden w-1/2 overflow-hidden lg:flex bg-gradient-to-br from-[#1D3567] to-[#2C5292]">
        {/* Blur Effects */}
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 flex h-full w-full items-center justify-center p-10">
          <div className="relative h-[520px] w-[520px]">
            {/* Main Glass */}
            <div className="absolute inset-0 rounded-[40px] border border-white/10 bg-white/10 backdrop-blur-3xl shadow-2xl">
              {/* Fake Header */}
              <div className="flex items-center gap-2 border-b border-white/10 px-6 py-5">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>

              {/* Dashboard Preview */}
              <div className="p-8">
                {/* Top Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xl">
                    <div className="h-3 w-16 rounded-full bg-white/20" />
                    <div className="mt-5 h-8 w-20 rounded-lg bg-blue-300/60" />
                    <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                      <div className="h-full w-[70%] rounded-full bg-blue-300" />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xl">
                    <div className="h-3 w-14 rounded-full bg-white/20" />
                    <div className="mt-5 h-8 w-16 rounded-lg bg-cyan-300/60" />
                    <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                      <div className="h-full w-[50%] rounded-full bg-cyan-300" />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-xl">
                    <div className="h-3 w-12 rounded-full bg-white/20" />
                    <div className="mt-5 h-8 w-24 rounded-lg bg-indigo-300/60" />
                    <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                      <div className="h-full w-[85%] rounded-full bg-indigo-300" />
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="mt-8 rounded-3xl bg-white/10 p-6 backdrop-blur-xl">
                  <div className="flex items-end gap-4 h-48">
                    <div className="w-full rounded-t-2xl bg-blue-400/80 h-20" />
                    <div className="w-full rounded-t-2xl bg-cyan-300/80 h-32" />
                    <div className="w-full rounded-t-2xl bg-blue-300/80 h-28" />
                    <div className="w-full rounded-t-2xl bg-indigo-300/80 h-40" />
                    <div className="w-full rounded-t-2xl bg-blue-400/80 h-36" />
                    <div className="w-full rounded-t-2xl bg-cyan-300/80 h-44" />
                  </div>
                </div>

                {/* Bottom Cards */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-xl">
                    <div className="h-4 w-24 rounded-full bg-white/20" />
                    <div className="mt-6 flex gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-blue-300/60" />
                      <div className="flex-1">
                        <div className="h-4 w-24 rounded-full bg-white/20" />
                        <div className="mt-3 h-3 w-16 rounded-full bg-blue-300/50" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-xl">
                    <div className="h-4 w-20 rounded-full bg-white/20" />
                    <div className="mt-6 flex gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-cyan-300/60" />
                      <div className="flex-1">
                        <div className="h-4 w-28 rounded-full bg-white/20" />
                        <div className="mt-3 h-3 w-20 rounded-full bg-cyan-300/50" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="absolute -right-12 top-16 w-44 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-2xl shadow-2xl">
              <div className="h-3 w-16 rounded-full bg-white/20" />
              <div className="mt-5 h-24 rounded-2xl bg-gradient-to-br from-blue-400/70 to-cyan-300/70" />
              <div className="mt-4 h-3 w-20 rounded-full bg-white/20" />
            </div>

            <div className="absolute -left-10 bottom-10 w-40 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-2xl shadow-2xl">
              <div className="h-3 w-14 rounded-full bg-white/20" />
              <div className="mt-5 flex gap-2">
                <div className="h-16 w-4 rounded-full bg-blue-300/70" />
                <div className="h-24 w-4 rounded-full bg-cyan-300/70" />
                <div className="h-12 w-4 rounded-full bg-indigo-300/70" />
                <div className="h-20 w-4 rounded-full bg-blue-400/70" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE - ACTUAL FORM */}
      <section className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-lg rounded-[32px] bg-white p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] xl:p-10">
          {/* Mobile Logo */}
          <div className="mb-8 text-center lg:hidden">
            <h1 className="text-3xl font-bold text-[#1D3567]">AZUL FINANÇAS</h1>
          </div>

          {/* Header */}
          <div>
            <h2 className="text-4xl font-bold text-[#1D3567]">Bem-vindo</h2>
            <p className="mt-2 text-base text-slate-500">
              Faça login para acessar sua conta.
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Email Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                E-mail
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition focus-within:border-[#2C5292]">
                <Mail size={20} className="text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-transparent text-sm outline-none text-slate-800"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Senha
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-4 transition focus-within:border-[#2C5292]">
                <Lock size={20} className="text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-sm outline-none text-slate-800"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                className="font-medium text-[#2C5292] hover:underline outline-none"
              >
                Esqueceu sua senha?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#1D3567] to-[#2C5292] py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? "Autenticando..." : "Entrar"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-slate-500">
            Ainda não possui acesso?{" "}
            <span className="font-semibold text-[#2C5292] cursor-pointer hover:underline">
              Fale com o administrador
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}

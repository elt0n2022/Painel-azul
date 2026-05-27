import Image from "next/image";
import Link from "next/link"; // Importação essencial para navegação interna no Next.js
import { ArrowRight, LayoutDashboard, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-[#EEF3FB] font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between py-20 px-10 bg-white rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] sm:items-start">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-[#1D3567]" />
          <h2 className="text-xl font-bold tracking-wider text-[#1D3567]">
            AZUL FINANÇAS
          </h2>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="my-12 flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#1D3567]">
            Gestão financeira inteligente para sua plataforma SaaS.
          </h1>
          <p className="max-w-md text-base leading-relaxed text-slate-500">
            Monitore sua receita recorrente (MRR), base de usuários ativos e transações financeiras em tempo real com um painel consolidado de alta performance.
          </p>
        </div>

        {/* BOTÕES DE NAVEGAÇÃO INTERNA */}
        <div className="flex flex-col gap-4 w-full text-base font-medium sm:flex-row">
          {/* Link para a página de Login */}
          <Link
            href="/login"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1D3567] to-[#2C5292] px-6 text-white transition shadow-lg hover:opacity-95 md:w-auto"
          >
            <LogIn size={18} />
            Acessar Conta
            <ArrowRight size={16} className="ml-1" />
          </Link>

          {/* Link direto para o Dashboard (Útil para testes ou sessões salvas) */}
          <Link
            href="/dashboard"
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-solid border-slate-200 bg-slate-50 px-6 text-slate-700 transition hover:bg-slate-100 md:w-auto"
          >
            <LayoutDashboard size={18} />
            Ir para o Dashboard
          </Link>
        </div>

        {/* RODAPÉ INTEGRADO */}
        <div className="mt-16 pt-6 w-full border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2026 Azul Finanças. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer" className="hover:text-slate-600 underline">
              Documentação Next.js
            </a>
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="hover:text-slate-600 underline">
              Hospedado na Vercel
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

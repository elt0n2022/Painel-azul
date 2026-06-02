"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  Users,
  CreditCard,
  LogOut,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      name: "Usuários",
      icon: Users,
      href: "/dashboard/users",
    },
    {
      name: "Planos",
      icon: CreditCard,
      href: "/dashboard/plans",
    },
  ];

  // Função responsável por limpar a sessão e deslogar o usuário
  const handleLogout = () => {
    // 1. Remove as credenciais guardadas no navegador
    localStorage.removeItem("@AzulFinancas:userId");
    // localStorage.removeItem("@AzulFinancas:token"); // Descomente caso use token JWT

    // 2. Redireciona imediatamente para a tela de login externa
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen bg-[#EEF3FB]">
      {/* SIDEBAR */}
      <aside className="hidden w-[290px] flex-col bg-gradient-to-b from-[#1D3567] to-[#2C5292] p-6 text-white lg:flex">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="h-4 w-2 rounded bg-blue-400" />
            <div className="h-6 w-2 rounded bg-blue-500" />
            <div className="h-8 w-2 rounded bg-blue-300" />
          </div>

          <div>
            <h1 className="text-2xl font-bold">AZUL</h1>
            <span className="text-xs tracking-[0.3em] text-blue-200">
              FINANÇAS
            </span>
          </div>
        </div>

        {/* MENU */}
        <nav className="mt-14 flex flex-col gap-3">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 rounded-2xl px-4 py-4 transition ${
                  active
                    ? "bg-white/15 font-medium text-white shadow-lg backdrop-blur-xl"
                    : "text-blue-100 hover:bg-white/10"
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="mt-auto space-y-4">
          {/* INFO */}
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <p className="text-sm text-blue-100">Sistema Financeiro</p>
            <h3 className="mt-3 text-2xl font-bold">Painel Administrativo</h3>
            <p className="mt-3 text-sm text-blue-100/80">
              Gerencie usuários, planos e operações financeiras.
            </p>
          </div>

          {/* BOTÃO LOGOUT (Vinculado à função handleLogout) */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 font-medium text-white transition hover:bg-white/20"
          >
            <LogOut size={18} />
            Sair da conta
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <section className="flex-1 p-6 lg:p-8">{children}</section>
    </main>
  );
}
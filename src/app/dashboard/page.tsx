"use client";

import { useState, useEffect } from "react";
import {
  dashboardGetChartData,
  dashboardGetTransactions,
} from "../../services/dashboard";

import {
  Bell,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import { userGet, userGetAll } from "@/src/services/user-service";
import { planGet } from "@/src/services/plan-service";

interface Grafico {
  data: string;
  userId: number;
  valor: number;
}

interface Lancamento {
  idLaunch: number;
  contaId: number;
  data: Date;
  descricaoLaunch: string;
  statusLaunch: "PROCESSANDO" | "PROCESSADO";
  userId: string;
  nomeUsuario?: string;
  tipoLaunch: "ENTRADA" | "SAIDA";
  valor: number;
}

interface UserProfile {
  id: number;
  data: Date;
  email: string;
  name?: string;
  planoUser: "BASICO" | "MEDIO" | "AVANCADO" | "ADMIN";
  status: "ATIVO" | "INATIVO";
  tipo?: "USER" | "ADMIN";
}

interface Plan {
  idServ: number;
  nameServ: string;
  preco: string;
  userId: number;
  beneficios: string;
}

export default function DashboardPage() {
  // 📍 DADOS 100% ESTÁTICOS POR DIA PARA FAZER O GRÁFICO FUNCIONAR DE IMEDIATO
  const [chartData, setChartData] = useState<Grafico[]>([
    { data: "2026-06-01", userId: 120, valor: 450 },
    { data: "2026-06-02", userId: 124, valor: 890 },
    { data: "2026-06-03", userId: 132, valor: 310 },
    { data: "2026-06-04", userId: 140, valor: 1200 },
    { data: "2026-06-05", userId: 141, valor: 0 },
    { data: "2026-06-06", userId: 155, valor: 1550 },
    { data: "2026-06-07", userId: 168, valor: 980 },
  ]);

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Lancamento[]>([]);
  const [perfilUsuario, setPerfilUsuario] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarTodosOsDados = async () => {
    const userId = localStorage.getItem("@AzulFinancas:userId");

    try {
      setLoading(true);
      setError(null);

      const [dadosUsuarios, dadosPlanos, resUser, metrics, payData] =
        await Promise.all([
          userGetAll().catch(() => []),
          planGet().catch(() => []),
          userId && userId !== "undefined" ? userGet().catch(() => null) : null,
          dashboardGetChartData().catch(() => null),
          dashboardGetTransactions().catch(() => []),
        ]);

      setUsersList(dadosUsuarios || []);
      setPlans(dadosPlanos || []);
      setRecentTransactions(Array.isArray(payData) ? payData : []);

      // 💡 Se o back-end retornar um array válido no futuro, ele substitui o estático.
      // Se não, ele mantém o mock estático intacto para não quebrar a tela.
      if (Array.isArray(metrics) && metrics.length > 0) {
        setChartData(metrics);
      }

      // Lógica do perfil do usuário logado
      if (resUser && resUser.data && !Array.isArray(resUser.data)) {
        setPerfilUsuario(resUser.data);
      } else if (userId && dadosUsuarios && dadosUsuarios.length > 0) {
        const usuarioLogado = dadosUsuarios.find(
          (u: UserProfile) => String(u.id) === String(userId)
        );
        setPerfilUsuario(usuarioLogado || null);
      } else {
        setPerfilUsuario(null);
      }

    } catch (err: any) {
      console.error("Erro geral ao carregar dados:", err);
      setError("Ocorreu um erro ao atualizar as fontes de dados do painel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTodosOsDados();
  }, []);

  // --- CÁLCULOS DINÂMICOS BASEADOS NAS VARIÁVEIS INALTERADAS ---
  const temDadosGrafico = chartData.length > 0;

  const receitaAcumuladaTotal = chartData.reduce((acc, item) => acc + (item.valor || 0), 0);
  const receitaSaaSFormatada = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(receitaAcumuladaTotal);

  const somaUserIds = chartData.reduce((acc, item) => acc + (item.userId || 0), 0);
  const volumeOperacoes = recentTransactions.length;

  const usuariosAtivos = usersList.filter((u) => u.status === "ATIVO").length;
  const usuariosAssinantes = usersList.filter((u) => u.planoUser === "BASICO" || u.planoUser === "MEDIO").length;

  const primeiroPlano = plans.length > 0 ? plans[0] : null;
  const precoLimpo = primeiroPlano ? String(primeiroPlano.preco).replace(/[^\d.,]/g, "").replace(",", ".") : "0";
  const receitaEstimadaPlanos = (parseFloat(precoLimpo) || 0) * usuariosAssinantes;

  // Formata a string "YYYY-MM-DD" para exibir "DD/MM" no gráfico
  const formatarDiaMes = (dataStr: string) => {
    if (!dataStr || !dataStr.includes("-")) return dataStr;
    const partes = dataStr.split("-");
    if (partes.length < 3) return dataStr; 
    const [, mes, dia] = partes;
    return `${dia}/${mes}`;
  };

  return (
    <section className="p-4 lg:p-8 bg-[#EEF3FB] min-h-screen">
      {/* TOPBAR */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1D3567]">Dashboard</h1>
          <p className="mt-2 text-slate-500">Visão geral da plataforma SaaS.</p>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto">
          <button
            onClick={carregarTodosOsDados}
            disabled={loading}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-50 text-slate-600 disabled:opacity-50"
            title="Atualizar dados"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-50">
            <Bell size={20} className="text-slate-600" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] font-bold text-white">
              {perfilUsuario?.name ? perfilUsuario.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              {loading ? (
                <p className="text-xs text-slate-400">Carregando...</p>
              ) : !perfilUsuario ? (
                <p className="text-xs text-slate-400">Sem dados</p>
              ) : (
                <div>
                  <p className="font-semibold text-[#1D3567] leading-tight">{perfilUsuario.name || "Admin"}</p>
                  <p className="text-xs text-slate-500">{perfilUsuario.tipo || "Administrador"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* STATS CARDS */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">Usuários Ativos</p>
            <div className="rounded-2xl bg-blue-50 p-3 text-[#2C5292] font-semibold text-sm">
              {loading ? "..." : usuariosAtivos}
            </div>
          </div>
          <h3 className="mt-5 text-3xl font-bold text-[#1D3567] tracking-tight">
            {loading ? "..." : usuariosAtivos}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <ArrowUpRight size={16} /> +12% crescimento
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">Operações (Mês)</p>
          </div>
          <h3 className="mt-5 text-3xl font-bold text-[#1D3567] tracking-tight">
            {loading ? "..." : Number(volumeOperacoes).toLocaleString("pt-BR")}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <ArrowUpRight size={16} /> Sistema estável
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">Receita Mensal (MRR)</p>
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="mt-5 text-3xl font-bold text-[#1D3567] tracking-tight truncate">
            {loading ? "..." : receitaEstimadaPlanos.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <ArrowUpRight size={16} /> Receita recorrente
          </div>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {/* GRÁFICO DE USUÁRIOS */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1D3567]">Crescimento de Usuários</h2>
              <p className="mt-1 text-xs text-slate-400">Evolução progressiva da base.</p>
            </div>
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">Semestre atual</span>
          </div>

          <div className="mt-8 h-[320px] w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">Carregando gráfico...</div>
            ) : chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-sm">
                Nenhum dado retornado pelo banco de dados.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2C5292" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2C5292" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="data" tickFormatter={formatarDiaMes} tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} />
                  <Tooltip formatter={(value: any) => [Number(value).toLocaleString("pt-BR"), "Usuários"]} labelFormatter={(label) => `Data: ${formatarDiaMes(label)}`} />
                  <Area type="monotone" dataKey="userId" stroke="#1D3567" strokeWidth={3} fill="url(#usersGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* GRÁFICO DE RECEITA */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1D3567]">Faturamento Mensal</h2>
              <p className="mt-1 text-xs text-slate-400">Evolução do faturamento bruto.</p>
            </div>
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">Semestre atual</span>
          </div>

          <div className="mt-8 h-[320px] w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">Carregando gráfico...</div>
            ) : chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-sm">
                Nenhum dado retornado pelo banco de dados.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="data" tickFormatter={formatarDiaMes} tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} />
                  <Tooltip formatter={(value: any) => [new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value), "Receita"]} labelFormatter={(label) => `Data: ${formatarDiaMes(label)}`} />
                  <Line type="monotone" dataKey="valor" stroke="#2C5292" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* HISTÓRICO DE TRANSAÇÕES */}
      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm border border-slate-100 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1D3567]">Últimas transações</h2>
          <p className="mt-1 text-xs text-slate-400">Movimentações recentes da plataforma.</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {loading ? (
            <p className="py-6 text-center text-slate-400 text-sm">Buscando movimentações...</p>
          ) : recentTransactions.length === 0 ? (
            <p className="py-6 text-center text-slate-400 text-sm">Nenhuma transação recente encontrada.</p>
          ) : (
            recentTransactions.map((item) => (
              <div key={item.idLaunch} className="flex items-center justify-between rounded-2xl bg-slate-50/60 p-4 transition hover:bg-slate-100/80 border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${item.tipoLaunch === "ENTRADA" ? "bg-emerald-500" : "bg-red-500"}`}>
                    {item.tipoLaunch === "ENTRADA" ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1D3567]">{item.nomeUsuario || `Usuário #${item.userId}`}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.tipoLaunch}</p>
                  </div>
                </div>
                <p className={`font-bold text-sm ${item.tipoLaunch === "ENTRADA" ? "text-emerald-600" : "text-slate-700"}`}>
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.valor)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
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
  const [chartData, setChartData] = useState<Grafico[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Lancamento[]>(
    [],
  );
  const [perfilUsuario, setPerfilUsuario] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarTodosOsDados = async () => {
    const userId = localStorage.getItem("@AzulFinancas:userId");

    try {
      setLoading(true);
      setError(null);

      if (!userId || userId === "undefined") {
        console.log("Aviso: userId inválido no localStorage:", userId);
      }

      // Chamadas paralelas à API
      const [dadosUsuarios, dadosPlanos, resUser, metrics, payData] =
        await Promise.all([
          userGetAll().catch(() => []),
          planGet().catch(() => []),
          userId && userId !== "undefined" ? userGet().catch(() => null) : null,
          userId && userId !== "undefined"
            ? dashboardGetChartData(userId).catch(() => [])
            : [],
          dashboardGetTransactions().catch(() => []),
        ]);

      // Atualiza as listas globais do dashboard
      setUsersList(dadosUsuarios || []);
      setPlans(dadosPlanos || []);
      setChartData(Array.isArray(metrics) ? metrics : []);
      setRecentTransactions(Array.isArray(payData) ? payData : []);

      // 🔍 LÓGICA DE DETECÇÃO DO USUÁRIO LOGADO
      if (resUser && resUser.data && !Array.isArray(resUser.data)) {
        // 1ª Opção: Se a API retornou o objeto direto do usuário logado
        setPerfilUsuario(resUser.data);
      } else if (userId && dadosUsuarios && dadosUsuarios.length > 0) {
        // 2ª Opção (Fallback Seguro): Encontra o usuário correspondente ao ID logado de dentro da lista geral
        const usuarioLogado = dadosUsuarios.find(
          (u: UserProfile) => String(u.id) === String(userId)
        );
        
        if (usuarioLogado) {
          setPerfilUsuario(usuarioLogado);
        } else {
          setPerfilUsuario(null);
        }
      } else {
        setPerfilUsuario(null);
      }

    } catch (err: any) {
      console.error("Erro ao carregar dados unificados do painel:", err);
      setError(
        "Ocorreu um erro ao atualizar alguma das fontes de dados do painel.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Dispara apenas uma vez na montagem do componente
  useEffect(() => {
    carregarTodosOsDados();
  }, []);

  // --- CÁLCULOS DINÂMICOS BLINDADOS ---
  const temDadosGrafico = chartData.length > 0;
  const ultimoMesValido = temDadosGrafico
    ? chartData[chartData.length - 1]
    : null;

  // 1. Receita SaaS Total
  const receitaAcumuladaTotal = chartData.reduce(
    (acc, item) => acc + (item.valor || 0),
    0,
  );
  const receitaSaaSFormatada = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(receitaAcumuladaTotal);

  // 2. Volume de Operações (Se chartData estiver vazio, baseia-se puramente nas transações recentes)
  const somaUserIds = chartData.reduce(
    (acc, item) => acc + (item.userId || 0),
    0,
  );
  const volumeOperacoes =
    recentTransactions.length > 0 || temDadosGrafico
      ? (somaUserIds / 2 + recentTransactions.length).toFixed(0)
      : "0";
  // 3. MRR (Receita Mensal Atual)
  const mrrFormatado = ultimoMesValido
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(ultimoMesValido.valor)
    : "R$ 0";

  // 4. Usuários Ativos
  const usuariosAtivos = usersList.filter((u) => u.status === "ATIVO").length;

  // 5. Receita Estimada por Assinaturas Ativas
  const usuariosAssinantes = usersList.filter(
    (u) => u.planoUser === "BASICO" || u.planoUser === "MEDIO",
  ).length;

  const primeiroPlano = plans.length > 0 ? plans[0] : null;
  const precoLimpo = primeiroPlano
    ? String(primeiroPlano.preco)
        .replace(/[^\d.,]/g, "")
        .replace(",", ".")
    : "0";
  const receitaEstimadaPlanos =
    (parseFloat(precoLimpo) || 0) * usuariosAssinantes;

  const formatarMesAno = (dataStr: string) => {
    if (!dataStr || !dataStr.includes("-")) return dataStr;
    const [ano, mes] = dataStr.split("-");
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const index = parseInt(mes, 10) - 1;
    return index >= 0 && index < 12
      ? `${meses[index]}/${ano.slice(-2)}`
      : dataStr;
  };

  return (
    <section className="p-4 lg:p-8 bg-[#EEF3FB] min-h-screen">
      {/* TOPBAR */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1D3567]">Dashboard</h1>
          <p className="mt-2 text-slate-500">Visão geral da plataforma SaaS.</p>
        </div>

        {/* CONTROLS & USER */}
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
              {perfilUsuario?.name
                ? perfilUsuario.name.charAt(0).toUpperCase()
                : "A"}
            </div>
            <div>
              {loading ? (
                <p className="text-xs text-slate-400">Carregando...</p>
              ) : !perfilUsuario ? (
                <p className="text-xs text-slate-400">Sem dados</p>
              ) : (
                <div>
                  <p className="font-semibold text-[#1D3567] leading-tight">
                    {perfilUsuario.name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {perfilUsuario.tipo || "Administrador"}
                  </p>
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
        {/* CARD: RECEITA ACUMULADA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] p-6 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <p className="text-blue-100 font-medium">Receita SaaS Total</p>
              <DollarSign size={24} className="text-blue-200" />
            </div>
            <h3 className="mt-5 text-3xl font-bold tracking-tight truncate">
              {loading ? "..." : receitaSaaSFormatada}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-300">
              <TrendingUp size={16} />
              +18% este mês
            </div>
          </div>
        </div>

        {/* CARD: USUÁRIOS ATIVOS */}
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
            <ArrowUpRight size={16} />
            +12% crescimento
          </div>
        </div>

        {/* CARD: OPERAÇÕES */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">Operações (Mês)</p>
          </div>
          <h3 className="mt-5 text-3xl font-bold text-[#1D3567] tracking-tight">
            {loading ? "..." : Number(volumeOperacoes).toLocaleString("pt-BR")}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <ArrowUpRight size={16} />
            Sistema estável
          </div>
        </div>

        {/* CARD: MRR */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <p className="text-slate-500 font-medium">Receita Mensal (MRR)</p>
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-700">
              <TrendingUp size={20} />
            </div>
          </div>
          <h3 className="mt-5 text-3xl font-bold text-[#1D3567] tracking-tight truncate">
            {loading
              ? "..."
              : receitaEstimadaPlanos.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <ArrowUpRight size={16} />
            Receita recorrente
          </div>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {/* GRÁFICO DE USUÁRIOS */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1D3567]">
                Crescimento de Usuários
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Evolução progressiva da base.
              </p>
            </div>
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              Semestre atual
            </span>
          </div>

          <div className="mt-8 h-[320px] w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                Carregando gráfico...
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                Sem dados de usuários para exibir.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="usersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#2C5292" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2C5292" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="data"
                    tickFormatter={formatarMesAno}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      Number(value).toLocaleString("pt-BR"),
                      "Usuários",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="userId"
                    stroke="#1D3567"
                    strokeWidth={3}
                    fill="url(#usersGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* GRÁFICO DE RECEITA */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1D3567]">
                Faturamento Mensal
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Evolução do faturamento bruto.
              </p>
            </div>
            <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              Semestre atual
            </span>
          </div>

          <div className="mt-8 h-[320px] w-full">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                Carregando gráfico...
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                Sem dados de faturamento para exibir.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F1F5F9"
                  />
                  <XAxis
                    dataKey="data"
                    tickFormatter={formatarMesAno}
                    tick={{ fill: "#94A3B8", fontSize: 12 }}
                    axisLine={false}
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(value),
                      "Receita",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="valor"
                    stroke="#2C5292"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* HISTÓRICO DE TRANSAÇÕES */}
      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm border border-slate-100 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#1D3567]">
            Últimas transações
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Movimentações recentes da plataforma.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {loading ? (
            <p className="py-6 text-center text-slate-400 text-sm">
              Buscando movimentações...
            </p>
          ) : recentTransactions.length === 0 ? (
            <p className="py-6 text-center text-slate-400 text-sm">
              Nenhuma transação recente encontrada.
            </p>
          ) : (
            recentTransactions.map((item) => (
              <div
                key={item.idLaunch}
                className="flex items-center justify-between rounded-2xl bg-slate-50/60 p-4 transition hover:bg-slate-100/80 border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${
                      item.tipoLaunch === "ENTRADA"
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                  >
                    {item.tipoLaunch === "ENTRADA" ? (
                      <ArrowUpRight size={18} />
                    ) : (
                      <ArrowDownRight size={18} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1D3567]">
                      {item.nomeUsuario || `Usuário #${item.userId}`}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      {item.tipoLaunch}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-bold text-sm ${item.tipoLaunch === "ENTRADA" ? "text-emerald-600" : "text-slate-700"}`}
                >
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(item.valor)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

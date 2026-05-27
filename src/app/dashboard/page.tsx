"use client";

import { useState, useEffect } from "react";
import { dashboardGetChartData, dashboardGetTransactions } from "@/services/dashboard";

import {
  Bell,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Users,
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

// Interfaces para tipagem do TypeScript
interface ChartItem {
  month: string;
  users: number;
  revenue: number;
}

interface TransactionItem {
  id: number;
  user: string;
  type: "ENTRADA" | "SAÍDA";
  value: string;
}

export default function DashboardPage() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega todos os dados necessários em paralelo
  const carregarDadosDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricas, transacoes] = await Promise.all([
        dashboardGetChartData(),
        dashboardGetTransactions(),
      ]);

      setChartData(metricas || []);
      setRecentTransactions(transacoes || []);
    } catch (err) {
      setError("Não foi possível atualizar os dados do painel.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  // Cálculos dinâmicos baseados no último mês do histórico da API para os Cards
  const ultimoMesValido = chartData[chartData.length - 1];
  
  const receitaSaaS = ultimoMesValido 
    ? `R$ ${(ultimoMesValido.revenue / 1000).toFixed(1)}K` 
    : "R$ 0";
    
  const totalUsuarios = ultimoMesValido 
    ? ultimoMesValido.users.toLocaleString("pt-BR") 
    : "0";

  return (
    <section>
      {/* TOPBAR */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1D3567]">Dashboard</h1>
          <p className="mt-2 text-slate-500">Visão geral da plataforma SaaS.</p>
        </div>

        {/* USER */}
        <div className="flex items-center gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-100">
            <Bell size={20} className="text-slate-600" />
          </button>

          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] font-bold text-white">
              A
            </div>
            <div>
              <p className="font-semibold text-[#1D3567]">Admin</p>
              <p className="text-sm text-slate-500">Administrador</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* RECEITA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] p-6 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <p className="text-blue-100">Receita SaaS</p>
              <DollarSign size={28} />
            </div>
            <h3 className="mt-5 text-5xl font-bold">
              {loading ? "..." : receitaSaaS}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-300">
              <TrendingUp size={16} />
              +18% este mês
            </div>
          </div>
        </div>

        {/* USERS */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-500">Usuários</p>
            <div className="rounded-2xl bg-blue-100 p-3 text-[#2C5292]">
              <Users size={22} />
            </div>
          </div>
          <h3 className="mt-5 text-5xl font-bold text-[#1D3567]">
            {loading ? "..." : totalUsuarios}
          </h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <ArrowUpRight size={16} />
            +12% crescimento
          </div>
        </div>

        {/* TRANSAÇÕES */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-500">Operações</p>
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
              <Activity size={22} />
            </div>
          </div>
          <h3 className="mt-5 text-5xl font-bold text-[#1D3567]">8.421</h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <ArrowUpRight size={16} />
            Sistema estável
          </div>
        </div>

        {/* MRR */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-500">Receita mensal</p>
            <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-700">
              <TrendingUp size={22} />
            </div>
          </div>
          <h3 className="mt-5 text-5xl font-bold text-[#1D3567]">R$ 86K</h3>
          <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600">
            <ArrowUpRight size={16} />
            Receita recorrente
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        {/* USERS CHART */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1D3567]">
                Crescimento de Usuários
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Evolução da base de usuários.
              </p>
            </div>
            <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              Últimos 6 meses
            </button>
          </div>

          <div className="mt-10 h-[350px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400">Carregando gráfico...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2C5292" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2C5292" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#1D3567"
                    strokeWidth={4}
                    fill="url(#usersGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* REVENUE CHART */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1D3567]">
                Receita do SaaS
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Receita recorrente mensal.
              </p>
            </div>
            <button className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
              Últimos 6 meses
            </button>
          </div>

          <div className="mt-10 h-[350px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-slate-400">Carregando gráfico...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2C5292"
                    strokeWidth={4}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1D3567]">
              Últimas transações
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Movimentações recentes da plataforma.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {loading ? (
            <p className="py-6 text-center text-slate-400 text-sm">Buscando movimentações...</p>
          ) : recentTransactions.length === 0 ? (
            <p className="py-6 text-center text-slate-400 text-sm">Nenhuma transação recente encontrada.</p>
          ) : (
            recentTransactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-5 transition hover:bg-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${
                      item.type === "ENTRADA" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  >
                    {item.type === "ENTRADA" ? (
                      <ArrowUpRight size={20} />
                    ) : (
                      <ArrowDownRight size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1D3567]">{item.user}</p>
                    <p className="text-sm text-slate-500">{item.type}</p>
                  </div>
                </div>
                <p className="font-bold text-[#1D3567]">{item.value}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

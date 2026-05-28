"use client";

import { useState, useEffect } from "react";
import PlanModal from "../../../components/modals/PlanModal";
import { planGet, planDelete } from "../../../services/plan-service"; // Importando as funções da API

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Bell,
  CheckCircle2,
  Gem,
  Crown,
  CreditCard,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { userGet, userGetAll } from "@/src/services/user-service";
import { dashboardGetTransactions } from "@/src/services/dashboard";

// Definição da interface para o TypeScript entender o formato do plano vindo da API
interface Plan {
  idServ: number;
  nameServ: string;
  preco: string;
  userId: number;
  beneficios: string;
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

interface Lancamento {
  idLaunch: number;
  contaId: number;
  data: Date;
  descricaoLaunch: string;
  statusLaunch: "PROCESSANDO" | "PROCESSADO";
  userId: string; // ID do usuário
  nomeUsuario?: string; // Nome do cliente vindo da API
  tipoLaunch: "ENTRADA" | "SAIDA";
  valor: number; // Corrigido de string para número
}

export default function PlansPage() {
  const [openModal, setOpenModal] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Lancamento[]>(
    [],
  );
  const [perfilUsuario, setPerfilUsuario] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarDadosDashboard = async () => {
    const userId = localStorage.getItem("@AzulFinancas:userId") || "1";

    if (!userId || userId === "undefined") {
      console.warn("Aguardando ID do usuário para carregar pagamentos...");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [payData, resUser] = await Promise.all([
        dashboardGetTransactions(),
        userGet(),
      ]);

      console.log("Transações brutas da API:", payData);

      setRecentTransactions(Array.isArray(payData) ? payData : []);

      if (resUser && !Array.isArray(resUser)) {
        setPerfilUsuario(resUser?.data || resUser);
      } else if (Array.isArray(resUser) && resUser.length > 0) {
        setPerfilUsuario(resUser[0]);
      } else {
        setPerfilUsuario(null);
      }
    } catch (err: any) {
      console.error("Erro ao carregar dados do painel:", err);
      setError(
        err?.message || "Ocorreu um erro ao carregar os dados do painel.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDadosDashboard();
  }, []);

  // Função para buscar os planos da API
  const carregarPlanos = async () => {
    try {
      setLoading(true);
      setError(null);
      const dados = await planGet();
      // Se o retorno for null ou vazio, garante que salva uma array vazia
      setPlans(dados || []);
    } catch (err: any) {
      setError("Não foi possível carregar os planos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Executa a busca assim que a página renderiza
  useEffect(() => {
    carregarPlanos();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const dados = await userGetAll();
      setUsersList(dados || []);
    } catch (err) {
      setError("Não foi possível carregar a lista de usuários.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const usuariosAssinantes = usersList.filter(
    (u) => u.planoUser === "BASICO" || u.planoUser === "MEDIO",
  ).length;
  const usuariosVIP = usersList.filter(
    (u) => u.planoUser === "AVANCADO",
  ).length;
  // Multiplica o preço de cada plano individual pelo número de assinantes e soma tudo
  // Pega o primeiro plano da lista (posição 0)
  const primeiroPlano = plans[0];
  
  // Limpa o preço e multiplica direto
  const precoLimpo = primeiroPlano ? String(primeiroPlano.preco).replace(/[^\d.,]/g, "").replace(",", ".") : "0";
  const receita = (parseFloat(precoLimpo) || 0) * usuariosAssinantes;
  return (
    <section>
      {/* TOPBAR */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-4xl font-bold text-[#1D3567]">Planos</h1>
        <p className="mt-2 text-slate-500">
          Gerencie planos e assinaturas da plataforma.
        </p>

        <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-100">
          <Bell size={20} className="text-slate-600" />
        </button>
      </div>

      {/* STATS */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] p-6 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total de planos</p>
              <h3 className="mt-4 text-5xl font-bold">{plans.length}</h3>
              <span className="mt-4 inline-block rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100">
                Planos ativos
              </span>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-xl">
              <CreditCard size={34} />
            </div>
          </div>
        </div>

        {/* ASSINANTES */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">Assinantes</p>
              <h3 className="mt-4 text-5xl font-bold text-emerald-600">
                {usuariosAssinantes}
              </h3>
              <span className="mt-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                Receita recorrente
              </span>
            </div>
            <div className="rounded-3xl bg-emerald-100 p-5 text-emerald-600">
              <CheckCircle2 size={34} />
            </div>
          </div>
        </div>

        {/* MRR */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">Receita mensal</p>
              <h3 className="mt-4 text-5xl font-bold text-[#1D3567]">
                {receita.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
              <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                +18% este mês
              </span>
            </div>
            <div className="rounded-3xl bg-blue-100 p-5 text-[#2C5292]">
              <DollarSign size={34} />
            </div>
          </div>
        </div>

        {/* PREMIUM */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">Plano premium</p>
              <h3 className="mt-4 text-5xl font-bold text-[#1D3567]">VIP</h3>
              <span className="mt-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700">
                Maior faturamento
              </span>
            </div>
            <div className="rounded-3xl bg-indigo-100 p-5 text-indigo-700">
              <Crown size={34} />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        {/* HEADER */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1D3567]">
              Lista de planos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Controle preços, usuários e receita dos planos.
            </p>
          </div>
        </div>

        {/* LISTAGEM CONTROLADA POR ESTADO */}
        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="py-10 text-center text-slate-500">
              Carregando planos...
            </p>
          ) : error ? (
            <p className="py-10 text-center text-red-500">{error}</p>
          ) : plans.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              Nenhum plano encontrado.
            </p>
          ) : (
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="pb-3">Plano</th>
                  <th className="pb-3">Preço</th>
                  <th className="pb-3">Usuários</th>
                  <th className="pb-3">Benefícios</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr
                    key={plan.idServ}
                    className="bg-slate-50 transition hover:bg-slate-100"
                  >
                    <td className="rounded-l-2xl px-4 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] text-white">
                          {plan.nameServ === "VIP" ? (
                            <Crown size={22} />
                          ) : (
                            <Gem size={22} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1D3567]">
                            {plan.nameServ}
                          </p>
                          <p className="text-sm text-slate-500">
                            Plano financeiro
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-5">
                      <span className="font-semibold text-[#1D3567]">
                        {plan.preco}
                      </span>
                    </td>
                    <td className="px-4 py-5">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {plan.userId} usuários
                      </span>
                    </td>
                    <td className="max-w-[260px] px-4 py-5 text-sm text-slate-600">
                      {plan.beneficios}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <PlanModal open={openModal} onClose={() => setOpenModal(false)} />
    </section>
  );
}

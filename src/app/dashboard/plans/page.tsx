"use client";

import { useState } from "react";
import PlanModal from "../../../components/modals/PlanModal";

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

const plans = [
  {
    id: 1,
    name: "BÁSICO",
    price: "R$ 29,90",
    users: 248,
    benefits: "Controle financeiro básico",
    status: "ATIVO",
    revenue: "R$ 7.415",
  },
  {
    id: 2,
    name: "INTERMEDIÁRIO",
    price: "R$ 59,90",
    users: 532,
    benefits: "Relatórios e gestão avançada",
    status: "ATIVO",
    revenue: "R$ 31.866",
  },
  {
    id: 3,
    name: "AVANÇADO",
    price: "R$ 99,90",
    users: 468,
    benefits: "Recursos completos da plataforma",
    status: "ATIVO",
    revenue: "R$ 46.753",
  },
];

export default function PlansPage() {
  const [openModal, setOpenModal] =
    useState(false);

  return (
    <section>
      {/* TOPBAR */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1D3567]">
            Planos
          </h1>

          <p className="mt-2 text-slate-500">
            Gerencie planos e assinaturas da
            plataforma.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Buscar plano..."
              className="h-12 w-[250px] rounded-2xl border border-slate-200 bg-white pl-11 pr-4 outline-none transition focus:border-[#2C5292]"
            />
          </div>

          {/* NOTIFICATION */}
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-100">
            <Bell
              size={20}
              className="text-slate-600"
            />
          </button>

          {/* BUTTON */}
          <button
            onClick={() => setOpenModal(true)}
            className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1D3567] to-[#2C5292] px-5 font-medium text-white shadow-lg transition hover:opacity-90"
          >
            <Plus size={18} />
            Novo plano
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] p-6 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-blue-100">
                Total de planos
              </p>

              <h3 className="mt-4 text-5xl font-bold">
                3
              </h3>

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
              <p className="text-slate-500">
                Assinantes
              </p>

              <h3 className="mt-4 text-5xl font-bold text-emerald-600">
                1.248
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
              <p className="text-slate-500">
                Receita mensal
              </p>

              <h3 className="mt-4 text-5xl font-bold text-[#1D3567]">
                R$ 86K
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
              <p className="text-slate-500">
                Plano premium
              </p>

              <h3 className="mt-4 text-5xl font-bold text-[#1D3567]">
                PRO
              </h3>

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
              Controle preços, usuários e receita
              dos planos.
            </p>
          </div>

          {/* FILTER */}
          <div className="flex gap-3">
            <select className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none">
              <option>Status</option>
              <option>ATIVO</option>
              <option>INATIVO</option>
            </select>

            <button className="flex h-11 items-center gap-2 rounded-2xl bg-slate-100 px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-200">
              <TrendingUp size={16} />
              Mais vendidos
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th className="pb-3">Plano</th>
                <th className="pb-3">Preço</th>
                <th className="pb-3">Usuários</th>
                <th className="pb-3">Receita</th>
                <th className="pb-3">Benefícios</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {plans.map((plan) => (
                <tr
                  key={plan.id}
                  className="bg-slate-50 transition hover:bg-slate-100"
                >
                  <td className="rounded-l-2xl px-4 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] text-white">
                        {plan.name === "AVANÇADO" ? (
                          <Crown size={22} />
                        ) : (
                          <Gem size={22} />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold text-[#1D3567]">
                          {plan.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          Plano financeiro
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-5">
                    <span className="font-semibold text-[#1D3567]">
                      {plan.price}
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                      {plan.users} usuários
                    </span>
                  </td>

                  <td className="px-4 py-5">
                    <span className="font-semibold text-emerald-600">
                      {plan.revenue}
                    </span>
                  </td>

                  <td className="max-w-[260px] px-4 py-5 text-sm text-slate-600">
                    {plan.benefits}
                  </td>

                  <td className="px-4 py-5">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                      {plan.status}
                    </span>
                  </td>

                  <td className="rounded-r-2xl px-4 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          setOpenModal(true)
                        }
                        className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-[#2C5292] transition hover:bg-blue-100"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      <button className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100">
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PlanModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </section>
  );
}
"use client";

import { useState } from "react";
import UserModal from "../../../components/modals/UserModal";


import { useEffect } from "react";

import {
  Search,
  Plus,
  Shield,
  UserCheck,
  Pencil,
  Trash2,
  Bell,
} from "lucide-react";

const users = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    tipo: "ADMIN",
    status: "ATIVO",
    plano: "AVANCADO",
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria@email.com",
    tipo: "USER",
    status: "ATIVO",
    plano: "INTERMEDIARIO",
  },
  {
    id: 3,
    name: "Carlos Mendes",
    email: "carlos@email.com",
    tipo: "USER",
    status: "INATIVO",
    plano: "BASICO",
  },
];

export default function UsersPage() {
  const [openModal, setOpenModal] =
    useState(false);

  return (
    <section>
      {/* TOPBAR */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1D3567]">
            Usuários
          </h1>

          <p className="mt-2 text-slate-500">
            Gerencie acessos e permissões da
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
              placeholder="Buscar usuário..."
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
            Novo usuário
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] p-6 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-blue-100">
                Usuários totais
              </p>

              <h3 className="mt-4 text-5xl font-bold">
                1.248
              </h3>

              <span className="mt-4 inline-block rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100">
                +12% este mês
              </span>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-xl">
              <UserCheck size={34} />
            </div>
          </div>
        </div>

        {/* CARD */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">
                Usuários ativos
              </p>

              <h3 className="mt-4 text-5xl font-bold text-emerald-600">
                982
              </h3>

              <span className="mt-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-700">
                Sistema saudável
              </span>
            </div>

            <div className="rounded-3xl bg-emerald-100 p-5 text-emerald-600">
              <UserCheck size={34} />
            </div>
          </div>
        </div>

        {/* CARD */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">
                Administradores
              </p>

              <h3 className="mt-4 text-5xl font-bold text-[#1D3567]">
                24
              </h3>

              <span className="mt-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-700">
                Controle avançado
              </span>
            </div>

            <div className="rounded-3xl bg-indigo-100 p-5 text-indigo-700">
              <Shield size={34} />
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
              Lista de usuários
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Gerencie todos os usuários da
              plataforma.
            </p>
          </div>

          {/* FILTERS */}
          <div className="flex flex-wrap gap-3">
            <select className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none">
              <option>Status</option>
              <option>ATIVO</option>
              <option>INATIVO</option>
            </select>

            <select className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none">
              <option>Plano</option>
              <option>BASICO</option>
              <option>INTERMEDIARIO</option>
              <option>AVANCADO</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th className="pb-3">Usuário</th>
                <th className="pb-3">Tipo</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Plano</th>
                <th className="pb-3 text-right">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="bg-slate-50 transition hover:bg-slate-100"
                >
                  {/* USER */}
                  <td className="rounded-l-2xl px-4 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] font-bold text-white">
                        {user.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-semibold text-[#1D3567]">
                          {user.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* TIPO */}
                  <td className="px-4 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.tipo === "ADMIN"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.tipo}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.status === "ATIVO"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* PLANO */}
                  <td className="px-4 py-5">
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                      {user.plano}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="rounded-r-2xl px-4 py-5">
                    <div className="flex items-center justify-end gap-2">
                      {/* EDIT */}
                      <button
                        onClick={() =>
                          setOpenModal(true)
                        }
                        className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-[#2C5292] transition hover:bg-blue-100"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      {/* DELETE */}
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

      <UserModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </section>
  );
}
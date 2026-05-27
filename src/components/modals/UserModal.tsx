"use client";

import { X } from "lucide-react";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
}


export default function UserModal({
  open,
  onClose,
}: UserModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1D3567]">
              Novo usuário
            </h2>

            <p className="mt-1 text-slate-500">
              Preencha os dados do usuário.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 transition hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form className="mt-8 grid gap-5">
          {/* NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Nome
            </label>

            <input
              type="text"
              placeholder="Digite o nome"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292]"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Email
            </label>

            <input
              type="email"
              placeholder="Digite o email"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292]"
            />
          </div>

          {/* GRID */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* TIPO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1D3567]">
                Tipo
              </label>

              <select className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none">
                <option>USER</option>
                <option>ADMIN</option>
              </select>
            </div>

            {/* PLANO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1D3567]">
                Plano
              </label>

              <select className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none">
                <option>BASICO</option>
                <option>INTERMEDIARIO</option>
                <option>AVANCADO</option>
              </select>
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Status
            </label>

            <select className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none">
              <option>ATIVO</option>
              <option>INATIVO</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-2xl bg-slate-100 px-5 font-medium text-slate-600 transition hover:bg-slate-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="h-12 rounded-2xl bg-gradient-to-r from-[#1D3567] to-[#2C5292] px-6 font-medium text-white shadow-lg transition hover:opacity-90"
            >
              Salvar usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
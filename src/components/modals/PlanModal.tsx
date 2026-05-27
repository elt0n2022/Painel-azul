"use client";

import { X } from "lucide-react";

interface PlanModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PlanModal({
  open,
  onClose,
}: PlanModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1D3567]">
              Novo plano
            </h2>

            <p className="mt-1 text-slate-500">
              Configure um novo plano da
              plataforma.
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
              Nome do plano
            </label>

            <input
              type="text"
              placeholder="Ex: AVANÇADO"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292]"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Preço mensal
            </label>

            <input
              type="text"
              placeholder="Ex: R$ 99,90"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292]"
            />
          </div>

          {/* BENEFITS */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Benefícios
            </label>

            <textarea
              placeholder="Descreva os benefícios do plano"
              className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-[#2C5292]"
            />
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
              Salvar plano
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
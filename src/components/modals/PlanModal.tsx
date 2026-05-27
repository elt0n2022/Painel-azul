"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface PlanModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: PlanFormData) => void;
}

export interface PlanFormData {
  name: string;
  price: number; // Armazenado como número puro (ex: 99.90) para o backend
  benefits: string;
  status: "ATIVO" | "INATIVO";
}

export default function PlanModal({ open, onClose, onSave }: PlanModalProps) {
  // Estados do formulário
  const [name, setName] = useState("");
  const [priceRaw, setPriceRaw] = useState(""); // Valor bruto para a máscara
  const [benefits, setBenefits] = useState("");
  const [status, setStatus] = useState<"ATIVO" | "INATIVO">("ATIVO");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  // Função para aplicar máscara de moeda (R$) em tempo real
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove tudo que não for dígito
    
    // Converte para o padrão decimal de centavos
    const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    const formattedValue = value 
      ? new Intl.NumberFormat("pt-BR", options).format(parseFloat(value) / 100)
      : "";

    setPriceRaw(formattedValue ? `R$ ${formattedValue}` : "");
  };

  // Converte a string mascarada de volta para um float numérico puro
  const parsePriceToFloat = (value: string): number => {
    const cleanValue = value
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim();
    return cleanValue ? parseFloat(cleanValue) : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !priceRaw) {
      alert("Por favor, preencha o nome e o preço do plano.");
      return;
    }

    const payload: PlanFormData = {
      name: name.toUpperCase(), // Mantém consistência visual
      price: parsePriceToFloat(priceRaw),
      benefits,
      status,
    };

    try {
      setLoading(true);
      
      // Se houver uma função injetada de salvamento (Ex: chamada Axios)
      if (onSave) {
        await onSave(payload);
      } else {
        // Simulação de envio
        console.log("Dados do plano salvos:", payload);
      }

      // Reseta e fecha o modal
      handleResetAndClose();
    } catch (error) {
      console.error("Erro ao salvar o plano:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setName("");
    setPriceRaw("");
    setBenefits("");
    setStatus("ATIVO");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl mx-4">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1D3567]">Novo plano</h2>
            <p className="mt-1 text-slate-500">
              Configure um novo plano da plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          {/* NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Nome do plano
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: AVANÇADO"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292] text-slate-800 transition"
              disabled={loading}
              required
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Preço mensal
            </label>
            <input
              type="text"
              value={priceRaw}
              onChange={handlePriceChange}
              placeholder="R$ 0,00"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292] text-slate-800 font-mono transition"
              disabled={loading}
              required
            />
          </div>

          {/* BENEFITS */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Benefícios
            </label>
            <textarea
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
              placeholder="Ex: Suporte 24h, Relatórios customizados, APIs ilimitadas"
              className="min-h-[120px] w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-[#2C5292] text-slate-800 transition resize-none"
              disabled={loading}
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "ATIVO" | "INATIVO")}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292] text-slate-800 bg-white transition cursor-pointer"
              disabled={loading}
            >
              <option value="ATIVO">ATIVO</option>
              <option value="INATIVO">INATIVO</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleResetAndClose}
              className="h-12 rounded-2xl bg-slate-100 px-5 font-medium text-slate-600 transition hover:bg-slate-200 outline-none"
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-2xl bg-gradient-to-r from-[#1D3567] to-[#2C5292] px-6 font-medium text-white shadow-lg transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Salvando..." : "Salvar plano"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

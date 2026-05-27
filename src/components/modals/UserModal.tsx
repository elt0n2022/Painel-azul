"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: UserFormData) => void;
}

export interface UserFormData {
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  plan: "BASICO" | "INTERMEDIARIO" | "AVANCADO";
  status: "ATIVO" | "INATIVO";
}

export default function UserModal({ open, onClose, onSave }: UserModalProps) {
  // Estados para controlar os inputs do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("USER");
  const [plan, setPlan] = useState<"BASICO" | "INTERMEDIARIO" | "AVANCADO">("BASICO");
  const [status, setStatus] = useState<"ATIVO" | "INATIVO">("ATIVO");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica simples
    if (!name.trim() || !email.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios (Nome e Email).");
      return;
    }

    const payload: UserFormData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      plan,
      status,
    };

    try {
      setLoading(true);

      if (onSave) {
        await onSave(payload);
      } else {
        // Simulação caso não venha nenhuma função externa nas Props
        console.log("Dados do usuário salvos:", payload);
      }

      // Reseta os campos e fecha o modal se tudo der certo
      handleResetAndClose();
    } catch (error) {
      console.error("Erro ao salvar o usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  // Garante que o formulário limpe a memória ao fechar ou cancelar
  const handleResetAndClose = () => {
    setName("");
    setEmail("");
    setRole("USER");
    setPlan("BASICO");
    setStatus("ATIVO");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
        
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1D3567]">Novo usuário</h2>
            <p className="mt-1 text-slate-500">Preencha os dados do usuário.</p>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 outline-none"
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          {/* NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome completo"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292] text-slate-800 transition"
              disabled={loading}
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex: exemplo@azul.com"
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292] text-slate-800 transition"
              disabled={loading}
              required
            />
          </div>

          {/* GRID TIPO E PLANO */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* TIPO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1D3567]">
                Tipo de Conta
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "USER" | "ADMIN")}
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292] text-slate-800 bg-white cursor-pointer transition"
                disabled={loading}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* PLANO */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#1D3567]">
                Plano Vinculado
              </label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value as "BASICO" | "INTERMEDIARIO" | "AVANCADO")}
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292] text-slate-800 bg-white cursor-pointer transition"
                disabled={loading}
              >
                <option value="BASICO">BÁSICO</option>
                <option value="INTERMEDIARIO">INTERMEDIÁRIO</option>
                <option value="AVANCADO">AVANÇADO</option>
              </select>
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "ATIVO" | "INATIVO")}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292] text-slate-800 bg-white cursor-pointer transition"
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
              {loading ? "Salvando..." : "Salvar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { userCadastro } from "@/src/services/auth-service";
// 💡 Importe o serviço responsável pela edição de usuário aqui. Exemplo fictício:
import { userPut } from "@/src/services/user-service"; 

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  tipo: "USER" | "ADMIN"; // ✅ Campo adicionado à interface
}

interface UserModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  // ✅ Atualizado para refletir a tipagem correta com 'tipo'
  user?: (UserFormData & { id: number }) | null; 
}
//
export default function UserModal({
  open,
  onClose,
  onSave,
  user,
}: UserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState<"USER" | "ADMIN">("USER"); // ✅ Estado para controlar o tipo
  const senhaPadrao = "123456";
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (user) {
        setName(user.name || "");
        setEmail(user.email || "");
        setTipo(user.tipo || "USER"); // ✅ Alimenta o estado ao editar
      } else {
        limparFormulario();
      }
    }
  }, [open, user]);

  if (!open) return null;

  const limparFormulario = () => {
    setName("");
    setEmail("");
    setTipo("USER"); // ✅ Reseta para o padrão
  };

  const handleResetAndClose = () => {
    limparFormulario();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios (Nome e Email).");
      return;
    }

    // Estrutura o payload padrão
    const payload: any = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      tipo: tipo, // ✅ Injetando o tipo no payload
    };

    try {
      setLoading(true);

      if (user?.id) {
        // 🔄 MODO EDIÇÃO: Envia para a rota PUT utilizando o ID do usuário
        // OBS: Geralmente APIs de atualização não exigem o envio da senha
        await userPut(payload, user.id);
        alert("Usuário atualizado com sucesso!");
      } else {
        // 🆕 MODO CRIAÇÃO: Mantém o comportamento de cadastro enviando a senha padrão
        payload.password = senhaPadrao;
        await userCadastro(payload);
        alert("Usuário cadastrado com sucesso!");
      }

      if (onSave) {
        // Retorna o payload com o id injetado para atualizar a listagem local em tela se necessário
        await onSave(user?.id ? { ...payload, id: user.id } : payload);
      }

      handleResetAndClose();
    } catch (error: any) {
      console.error("Erro ao salvar o usuário:", error);
      alert(
        error?.response?.data?.message || 
        error?.message || 
        "Ocorreu um erro ao salvar os dados no servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1D3567]">
              {user ? "Editar usuário" : "Novo usuário"}
            </h2>
            <p className="mt-1 text-slate-500">
              {user ? "Altere as informações abaixo." : "Preencha os dados do novo usuário."}
            </p>
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

          {/* ✅ NOVO CAMPO: TIPO DE USUÁRIO */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#1D3567]">
              Tipo de Permissão
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as "USER" | "ADMIN")}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2C5292] text-slate-800 bg-white transition cursor-pointer"
              disabled={loading}
            >
              <option value="USER">Usuário Comum (USER)</option>
              <option value="ADMIN">Administrador (ADMIN)</option>
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
              {loading ? "Salvando..." : user ? "Atualizar dados" : "Salvar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
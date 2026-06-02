"use client";

import { useState, useEffect } from "react";
import UserModal from "../../../components/modals/UserModal";
import { userGetAll, userPut } from "../../../services/user-service";

import { Plus, Shield, UserCheck, Pencil, Ban, Bell } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  tipo: "ADMIN" | "USER";
  status: "ATIVO" | "INATIVO";
  planoUser: string;
}

export default function UsersPage() {
  const [openModal, setOpenModal] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<User | null>(
    null,
  );

  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carrega o ID do usuário logado para evitar auto-exclusão
  const currentAdminId =
    typeof window !== "undefined"
      ? localStorage.getItem("@AzulFinancas:userId")
      : null;

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

  const handleDeletarUsuario = async (user: User) => {
    if (currentAdminId && String(user.id) === String(currentAdminId)) {
      alert("Ação inválida: Você não pode desativar sua própria conta administrativa.");
      return;
    }

    if (confirm(`Tem certeza que deseja desativar o acesso de ${user.name}?`)) {
      try {
        // 📦 Payload Limpo: Enviamos os dados sem o 'id' no corpo, 
        // já que o ID já vai na URL da requisição.
        const payload = {
          name: user.name,
          email: user.email,
          tipo: user.tipo,
          planoUser: user.planoUser,
          status: "INATIVO" // Mudança do status
        };

        // Envia apenas as propriedades limpas para a rota PUT
        await userPut(payload, user.id);
        
        // Atualiza o estado local para atualizar a tabela na tela
        setUsersList((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: "INATIVO" } : u))
        );
        
        alert("Usuário desativado com sucesso!");
      } catch (err) {
        console.error("Erro ao desativar usuário:", err);
        alert("O servidor rejeitou a atualização. Verifique as permissões ou os campos obrigatórios.");
      }
    }
  };

  const handleNovoUsuario = () => {
    setUsuarioSelecionado(null);
    setOpenModal(true);
  };

  const handleEditarUsuario = (user: User) => {
    setUsuarioSelecionado(user);
    setOpenModal(true);
  };

  const totalUsuarios = usersList.length;
  const usuariosAtivos = usersList.filter((u) => u.status === "ATIVO").length;
  const totalAdmins = usersList.filter((u) => u.tipo === "ADMIN").length;

  return (
    <section>
      {/* TOPBAR */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1D3567]">Usuários</h1>
          <p className="mt-2 text-slate-500">
            Gerencie acessos e permissões da plataforma.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition hover:bg-slate-100">
            <Bell size={20} className="text-slate-600" />
          </button>

          <button
            onClick={handleNovoUsuario}
            className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#1D3567] to-[#2C5292] px-5 font-medium text-white shadow-lg transition hover:opacity-90"
          >
            <Plus size={18} />
            Novo usuário
          </button>
        </div>
      </div>

      {/* STATS DINÂMICOS */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {/* TOTAL */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] p-6 text-white shadow-xl">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-blue-100">Usuários totais</p>
              <h3 className="mt-4 text-5xl font-bold">{totalUsuarios}</h3>
              <span className="mt-4 inline-block rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100">
                Cadastrados na base
              </span>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 backdrop-blur-xl">
              <UserCheck size={34} />
            </div>
          </div>
        </div>

        {/* ATIVOS */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">Usuários ativos</p>
              <h3 className="mt-4 text-5xl font-bold text-emerald-600">
                {usuariosAtivos}
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

        {/* ADMINS */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500">Administradores</p>
              <h3 className="mt-4 text-5xl font-bold text-[#1D3567]">
                {totalAdmins}
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

      {/* CONTAINER PRINCIPAL DA TABELA */}
      <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1D3567]">
              Lista de usuários
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Gerencie todos os usuários da plataforma.
            </p>
          </div>
        </div>

        {/* CONTEÚDO CONDICIONAL DA TABELA */}
        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <p className="py-10 text-center text-slate-500">
              Carregando usuários...
            </p>
          ) : error ? (
            <p className="py-10 text-center text-red-500">{error}</p>
          ) : usersList.length === 0 ? (
            <p className="py-10 text-center text-slate-500">
              Nenhum usuário encontrado.
            </p>
          ) : (
            <table className="w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="pb-3 pl-4">Usuário</th>
                  <th className="pb-3">Tipo</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Plano</th>
                  <th className="pb-3 text-right pr-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {usersList.map((user) => (
                  <tr
                    key={user.id}
                    className="bg-slate-50 transition hover:bg-slate-100"
                  >
                    <td className="rounded-l-2xl px-4 py-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1D3567] to-[#2C5292] font-bold text-white">
                          {user.name ? user.name.charAt(0) : "?"}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1D3567]">
                            {user.name}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>

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

                    <td className="px-4 py-5">
                      <div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.status === "ATIVO"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-5">
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">
                        {user.planoUser}
                      </span>
                    </td>

                    <td className="rounded-r-2xl px-4 py-5 pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditarUsuario(user)}
                          className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-medium text-[#2C5292] transition hover:bg-blue-100"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                        {/* Altere esta linha no seu botão de Excluir */}
                        <button
                          onClick={() => handleDeletarUsuario(user)} // ⬅️ Passando o objeto 'user' inteiro aqui
                          className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                        >
                          <Ban size={20} className="text-red-500" />
                          Inativar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL DE CONTROLE */}
      <UserModal
        open={openModal}
        user={usuarioSelecionado}
        onClose={() => {
          setOpenModal(false);
          setUsuarioSelecionado(null);
        }}
        onSave={() => carregarUsuarios()}
      />
    </section>
  );
}

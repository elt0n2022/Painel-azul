// src/services/user.ts
import { apiRequest } from "./api";

interface LoginData {
  email: string;
  className?: string; // Ajuste conforme os parâmetros extras do seu backend se houver
  password?: string;
}

// Envia as credenciais para o backend e retorna o token de acesso
export const authLogin = (data: any) => apiRequest("POST", "/users/login", data);

// Busca os dados de um usuário específico ou a listagem geral se o backend suportar
export const userGetAll = () => apiRequest("GET", "/admin");

// Deleta um usuário do sistema
export const userDelete = (userId: string | number) => apiRequest("DELETE", `/Admin/${userId}`);

export const userGet = () => apiRequest("GET", `/admin`);
export const userPut = (dados: any, userId: string | number) => apiRequest("PUT", `/users/admin/${userId}`, dados);
export const userGetById = (userId: string | number) => apiRequest("GET", `/users/Ex/${userId}`);

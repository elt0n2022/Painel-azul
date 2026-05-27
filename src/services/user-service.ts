// src/services/user.ts
import { apiRequest } from "./api";

// Busca os dados de um usuário específico ou a listagem geral se o backend suportar
export const userGetAll = () => apiRequest("GET", "/users");

// Deleta um usuário do sistema
export const userDelete = (userId: string | number) => apiRequest("DELETE", `/users/${userId}`);

export const userGet = (userId: string | number) => apiRequest("GET", `/users/${userId}`);
export const userPut = (dados: any, userId: string | number) => apiRequest("PUT", `/users/${userId}`, dados);
export const userGetById = (userId: string | number) => apiRequest("GET", `/usersEx/${userId}`);

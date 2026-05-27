// src/services/plan.ts
import { apiRequest } from "./api";

// Busca todos os planos cadastrados no banco
export const planGet = () => apiRequest("GET", "/servicos"); 

// Caso precise deletar um plano no futuro
export const planDelete = (planId: string | number) => apiRequest("DELETE", `/servicos/${planId}`);

// src/services/dashboard.ts
import { apiRequest } from "./api";

// 1. Busca os dados para os gráficos através do ID do usuário nas entradas
export const dashboardGetChartData = (userId: string | number) => 
  apiRequest("GET", `/entrada/${userId}`);

// 2. CORRIGIDO: Agora recebe o userId e aponta para a rota real '/Pay/:id/contas'
export const dashboardGetTransactions = () => 
  apiRequest("GET", `/Pay`);

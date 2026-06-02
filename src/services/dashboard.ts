// src/services/dashboard.ts
import { apiRequest } from "./api";

// 1. Aponta para a rota real de estatísticas/gráficos do back-end
export const dashboardGetChartData = () => 
  apiRequest("GET", `/users`); //Substitua pela rota real de métricas do seu back-end

// 2. Busca as transações gerais
export const dashboardGetTransactions = () => 
  apiRequest("GET", `/Pay`);
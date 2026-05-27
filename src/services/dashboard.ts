// src/services/dashboard.ts
import { apiRequest } from "./api";

// Busca os dados consolidados para os gráficos (Usuários e Receita por mês)
export const dashboardGetChartData = () => apiRequest("GET", "/dashboard/metrics");

// Busca o histórico das últimas transações financeiras
export const dashboardGetTransactions = () => apiRequest("GET", "/transactions");

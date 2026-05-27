// src/services/api.ts

// Dica: No Next.js, é melhor colocar a URL em uma variável de ambiente (.env.local)
// Exemplo: NEXT_PUBLIC_API_URL=http://172.17.240.1:3001
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://172.17.240.1:3001";

export const apiRequest = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  dados: any = null,
) => {
  try {
    const config: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
      // O Next.js possui cache automático no fetch para Server Components.
      // Se precisar de dados sempre atualizados (SSR), adicione:
      // cache: "no-store" 
    };

    if (dados && method !== "GET") {
      config.body = JSON.stringify(dados);
    }

    const res = await fetch(`${API_URL}${endpoint}`, config);

    if (res.status === 204) {
      return null;
    }

    const responseText = await res.text();
    let responseData = null;

    if (responseText.trim().length > 0) {
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        throw new Error(
          `O servidor não retornou um formato JSON válido. Resposta recebida: ${responseText}`,
        );
      }
    }

    if (!res.ok) {
      throw new Error(
        responseData?.message ||
          `Erro na requisição ${method} (Status: ${res.status})`,
      );
    }

    if (method === "GET") {
      if (
        !responseData ||
        (typeof responseData === "object" &&
          Object.keys(responseData).length === 0)
      ) {
        return null;
      }
    }

    return responseData || {};
  } catch (error) {
    console.error("Erro de rede/servidor:", error);
    throw error;
  }
};

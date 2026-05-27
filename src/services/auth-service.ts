import { apiRequest } from "./api";

export const userCadastro = (dados: any) => apiRequest("POST", "/users/cadastro", dados);
export const userLogin = (dados: any) => apiRequest("POST", "/users/login", dados);d

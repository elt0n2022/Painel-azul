import { apiRequest } from "./api";

export const userCadastro = (dados: any) => apiRequest("POST", "/users/cadastro", dados);
export const userLogin = ({ email, password, tipo }: any) => apiRequest("POST", "/users/login", { email, password, tipo });

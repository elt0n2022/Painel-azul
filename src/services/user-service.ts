import { apiRequest } from "./api";

export const userGet = (userId: string | number) => apiRequest("GET", `/users/${userId}`);
export const userPut = (dados: any, userId: string | number) => apiRequest("PUT", `/users/${userId}`, dados);
export const userGetById = (userId: string | number) => apiRequest("GET", `/usersEx/${userId}`);

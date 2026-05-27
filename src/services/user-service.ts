import { apiFetch } from "./api";

export async function getUsers() {
  return apiFetch("/users");
}

export async function createUser(
  data: any
) {
  return apiFetch("/users", {
    method: "POST",

    body: JSON.stringify(data),
  });
}

export async function updateUser(
  id: number,
  data: any
) {
  return apiFetch(`/users/${id}`, {
    method: "PUT",

    body: JSON.stringify(data),
  });
}

export async function deleteUser(
  id: number
) {
  return apiFetch(`/users/${id}`, {
    method: "DELETE",
  });
}
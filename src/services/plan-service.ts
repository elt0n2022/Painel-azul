import { apiFetch } from "./api";

export async function getPlans() {
  return apiFetch("/plans");
}

export async function createPlan(
  data: any
) {
  return apiFetch("/plans", {
    method: "POST",

    body: JSON.stringify(data),
  });
}

export async function updatePlan(
  id: number,
  data: any
) {
  return apiFetch(`/plans/${id}`, {
    method: "PUT",

    body: JSON.stringify(data),
  });
}

export async function deletePlan(
  id: number
) {
  return apiFetch(`/plans/${id}`, {
    method: "DELETE",
  });
}
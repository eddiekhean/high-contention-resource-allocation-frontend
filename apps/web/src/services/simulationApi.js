import { normalizeSimulation } from "./normalizeSimulation";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://api.eddiekhean.site";

export async function runSimulation(params) {
  const res = await fetch(`${API_BASE_URL}/public/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Simulation failed");
  }

  const raw = await res.json();
  return raw;
}

export async function matchImageHash(dhash) {
  const res = await fetch(`${API_BASE_URL}/leetcode/maze/images/match`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ dhash }),
  });

  if (!res.ok) {
    throw new Error(`Match request failed: ${res.status}`);
  }

  const data = await res.json();
  console.log("Image Match Response:", data);
  return data;
}

export async function fetchImages() {
  const res = await fetch(`${API_BASE_URL}/public/images`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch images: ${res.status}`);
  }

  const data = await res.json();
  return data.images;
}

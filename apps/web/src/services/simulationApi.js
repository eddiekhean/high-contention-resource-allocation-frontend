import { normalizeSimulation } from "./normalizeSimulation";

const API_BASE_URL = "https://www.eddiekhean.site/api/v1";

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



export async function generateMaze({ rows, cols, loop_ratio, seed }) {
  const payload = { rows, cols, loop_ratio };
  if (seed !== undefined && seed !== null && seed !== '') {
    payload.seed = Number(seed);
  }

  const res = await fetch(`${API_BASE_URL}/public/leetcode/maze/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Maze generation failed: ${res.status}`);
  }

  return await res.json();
}



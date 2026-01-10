import { normalizeSimulation } from "./normalizeSimulation";
export async function runSimulation(params) {
  const res = await fetch("https://api.eddiekhean.site/simulate", {
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
  const res = await fetch("https://api.eddiekhean.site/simulate/leetcode/maze/images/match", {
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

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

export async function runSimulation(params) {
  const res = await fetch("http://54.206.179.188:8080/simulate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    throw new Error("Simulation failed");
  }

  return res.json();
}

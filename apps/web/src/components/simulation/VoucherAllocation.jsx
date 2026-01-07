import "./css/simulation.css";
// import useReveal from "../../hooks/useReveal";
import { useState } from "react";
// import { useRevealOnMount } from "../../hooks/useRevealOnMount";
import SimulationStage from "./SimulationStage";
import { runSimulation } from "../../services/simulationApi";


export default function VoucherAllocationSimulation() {
  // const heroRef = useRevealOnMount(150);
  // const contextRef = useReveal();
  // const pressureRef = useReveal();
  // const failureRef = useReveal();
  // const entryRef = useReveal();
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    total_clients: 100,
    total_vouchers: 2,
    seed: 23,
    policy: "fifo",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "policy" ? value : Number(value),
    });
  };
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await runSimulation(form);
      setSimulationData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="simulation-page voucher-allocation-simulation">
      {/* ===== HERO ===== */}

      {/* Simulation Parameters Section */}
      <section className="section">
        <div className="m2 simulation-card">
          <div className="card-content">
            <h2>Simulation Parameters</h2>

            <div className="form-grid">
              <label>
                Total Clients
                <input
                  type="number"
                  name="total_clients"
                  value={form.total_clients}
                  onChange={handleChange}
                />
              </label>

              <label>
                Total Vouchers
                <input
                  type="number"
                  name="total_vouchers"
                  value={form.total_vouchers}
                  onChange={handleChange}
                />
              </label>

              <label>
                Seed
                <input
                  type="number"
                  name="seed"
                  value={form.seed}
                  onChange={handleChange}
                />
              </label>

              <label>
                Policy
                <select
                  name="policy"
                  value={form.policy}
                  onChange={handleChange}
                >
                  <option value="fifo">FIFO</option>
                  <option value="lifo">LIFO</option>
                  <option value="random">Random</option>
                </select>
              </label>
            </div>

            <button onClick={handleSubmit} disabled={loading || simulationData}>
              {loading
                ? "Running..."
                : simulationData
                  ? "Simulation Ready"
                  : "Start Simulation"}
            </button>
            {error && <p className="error">Simulation failed: {error}</p>}
          </div>
        </div>
        {/* Simulation Parameters Section */}
        {/* {simulationData && ( */}
        {/* <SimulationTable simulationData={simulationData} /> */}
        <SimulationStage simulationData={simulationData} />
        {/* )} */}
      </section>
    </main>
  );
}

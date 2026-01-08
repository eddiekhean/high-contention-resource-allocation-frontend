import "./css/simulation.css";
import { useMemo } from "react";
// import useReveal from "../../hooks/useReveal";
import { useState } from "react";
import { normalizeClientDecisions } from "../../services/normalizeSimulation";
// import { useRevealOnMount } from "../../hooks/useRevealOnMount";
import SimulationStage from "./SimulationStage";
import OrbitalBackground from "../common/OrbitalBackground";
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
      console.log("RAW backend data:", data);
      setSimulationData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const decisions = useMemo(() => {
    if (
      !simulationData ||
      !simulationData.events ||
      !simulationData.events.ArrivalOrder
    ) {
      return [];
    }

    return normalizeClientDecisions(simulationData);
  }, [simulationData]);

  return (
    <div className="simulation-page" style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <OrbitalBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <main className="voucher-allocation-simulation">
          {/* ================= HERO ================= */}
          <section className="section hero">
            <h1>Voucher Allocation Simulation</h1>
            <p className="subtitle">
              Comparing Fairness-oriented and Priority-based Allocation
              under High Contention
            </p>

            <p className="intro">
              This simulation demonstrates how different allocation policies behave
              when the number of clients exceeds the number of available vouchers.
              By visualizing arrivals and allocation decisions, we highlight the
              trade-offs between fairness and greedy prioritization.
            </p>
          </section>

          {/* ================= PROBLEM CONTEXT ================= */}
          <section className="section context">
            <h2>The Allocation Problem</h2>

            <p>
              In systems such as flash sales, voucher campaigns, or limited resource
              distribution, demand often exceeds supply. When multiple clients compete
              for a small number of vouchers, the system must decide who receives one
              and who does not.
            </p>

            <ul className="bullet-list">
              <li>Clients arrive sequentially over time</li>
              <li>Vouchers are limited and non-reusable</li>
              <li>Once vouchers are exhausted, remaining clients are rejected</li>
              <li>The allocation policy defines who wins and who loses</li>
            </ul>
          </section>

          {/* ================= POLICY OVERVIEW ================= */}
          <section className="section policies">
            <h2>Allocation Policies</h2>

            <div className="policy-grid">
              <div className="policy-card">
                <h3>FIFO (First In, First Out)</h3>
                <p>
                  Vouchers are allocated strictly based on arrival order.
                  Earlier clients are always served first.
                </p>
                <ul>
                  <li>Deterministic behavior</li>
                  <li>Easy to reason about</li>
                  <li>Often perceived as fair</li>
                </ul>
              </div>

              <div className="policy-card">
                <h3>LIFO (Last In, First Out)</h3>
                <p>
                  Vouchers are allocated starting from the most recent arrivals.
                  Earlier clients may be skipped entirely.
                </p>
                <ul>
                  <li>Counter-intuitive behavior</li>
                  <li>Can cause starvation</li>
                  <li>Useful for stress-testing unfair outcomes</li>
                </ul>
              </div>

              <div className="policy-card">
                <h3>Random Allocation</h3>
                <p>
                  Vouchers are assigned randomly among clients.
                  Arrival order does not guarantee success.
                </p>
                <ul>
                  <li>Removes arrival-time bias</li>
                  <li>Non-deterministic results</li>
                  <li>Useful as a fairness baseline</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ================= FAIRNESS VS PRIORITY ================= */}
          <section className="section comparison">
            <h2>Fairness vs Priority-based Allocation</h2>

            <div className="comparison-grid">
              <div className="comparison-card">
                <h3>Fairness-oriented Allocation</h3>
                <p>
                  A fairness-oriented allocator aims to minimize systematic
                  disadvantage among clients. The goal is to ensure equal opportunity
                  rather than maximizing short-term efficiency.
                </p>
                <ul>
                  <li>Reduces starvation</li>
                  <li>More predictable outcomes</li>
                  <li>Lower variance between clients</li>
                </ul>
              </div>

              <div className="comparison-card">
                <h3>Priority / Greedy Allocation</h3>
                <p>
                  Priority-based allocation optimizes for predefined objectives such
                  as arrival order, score, or urgency, often favoring efficiency over
                  equity.
                </p>
                <ul>
                  <li>High efficiency</li>
                  <li>Clear winners and losers</li>
                  <li>Potentially unfair outcomes</li>
                </ul>
              </div>
            </div>
          </section>

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
            <SimulationStage
              simulationData={simulationData}
              decisions={decisions}
              totalVouchers={form.total_vouchers}
            />

            {/* )} */}
          </section>
          {/* ================= TAKEAWAY ================= */}
          <section className="section takeaway">
            <h2>Key Takeaway</h2>
            <p>
              Allocation policies are not neutral. Each policy encodes trade-offs
              between fairness, efficiency, and control. This simulation visualizes
              how those choices impact real clients under extreme contention.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

import "./simulation.css";
import { useReveal } from "../../hooks/useReveal";
import { useState } from "react";
import { useRevealOnMount } from "../../hooks/useRevealOnMount";

export default function VoucherAllocationSimulation() {
  const heroRef = useRevealOnMount(150);
  const contextRef = useReveal();
  const pressureRef = useReveal();
  const failureRef = useReveal();
  const entryRef = useReveal();
  const [form, setForm] = useState({
    total_clients: 100,
    total_vouchers: 2,
    seed: 23,
    policy: "fifo",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "policy" ? value : Number(value),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8080/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Simulation failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error running simulation");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="simulation-page voucher-allocation-simulation">
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="section section-hero reveal">
        <h1>Resource Allocation Under Contention</h1>
        <p className="lead">
          A simulation that explores how systems allocate scarce resources when
          concurrent request volume significantly exceeds available capacity.
        </p>
      </section>

      {/* ===== CONTEXT ===== */}
      <section ref={contextRef} className="section reveal">
        <h2>Problem Context</h2>

        <p>
          In real-world systems, resource allocation problems emerge whenever
          demand spikes far beyond supply within a very short time window. These
          situations are common in time-sensitive product flows where user
          behavior becomes highly synchronized.
        </p>

        <p>
          Typical examples include promotional voucher releases, limited event
          registrations, software license distribution, flash sales, or shared
          compute resources across internal services.
        </p>

        <p>
          The challenge is not only that resources are finite, but that requests
          often arrive nearly simultaneously. Under these conditions,
          millisecond differences can determine whether a request succeeds or
          fails.
        </p>
      </section>

      {/* ===== SYSTEM PRESSURE ===== */}
      <section ref={pressureRef} className="section reveal">
        <h2>System Pressure Under High Contention</h2>

        <p>
          Under low traffic, allocation logic rarely draws attention. However,
          when contention increases, pressure propagates through the entire
          system pipeline—from network ingress and request queues to scheduling
          logic and persistence layers.
        </p>

        <p>
          At this point, the system is no longer just processing requests. It is
          continuously making allocation decisions under tight time constraints,
          partial information, and competing fairness expectations.
        </p>

        <p>
          Without a clear allocation strategy, system behavior becomes difficult
          to predict, eroding user trust and increasing operational complexity
          during high-traffic events.
        </p>
      </section>

      {/* ===== FAILURE MODES ===== */}
      <section ref={failureRef} className="section section-box reveal">
        <h2>Why Naive Approaches Fail</h2>

        <p>
          Simple strategies such as First-Come-First-Serve or Strict Priority
          are often chosen for their conceptual simplicity and ease of
          implementation. Under high contention, however, their limitations
          become immediately apparent.
        </p>

        <ul className="failure-list">
          <li>
            Low-priority requests may experience starvation and never receive
            resources, even after waiting for extended periods.
          </li>
          <li>
            Latency becomes unpredictable and strongly dependent on timing
            rather than business intent.
          </li>
          <li>
            The system lacks explainability, making it difficult to reason about
            why a particular request succeeded or failed.
          </li>
        </ul>
      </section>

      {/* ===== ENTRY POINT ===== */}
      <section ref={entryRef} className="section section-divider reveal">
        <h2>Simulation Entry Point</h2>

        <p>
          The simulation below initializes a complete allocation scenario. A
          fixed number of resources is defined upfront, and a burst of
          concurrent requests is generated according to configurable parameters.
        </p>

        <p>
          These requests are placed into an intermediate queue, where scheduling
          decisions are executed based on the simulated allocation strategy.
        </p>

        <p className="muted">
          The following sections focus on visualizing these decisions, from
          queue state evolution to final allocation outcomes.
        </p>
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

            <button onClick={handleSubmit} disabled={loading}>
              {loading ? "Running..." : "Start Simulation"}
            </button>
          </div>
        </div>
      </section>
{/* Simulation Parameters Section */}
      {result && (
  <section className="section">
    <div className="m2 simulation-card">
      <div className="card-content">
        <h2>Simulation Result</h2>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    </div>
  </section>
)}
    </main>
  );
}

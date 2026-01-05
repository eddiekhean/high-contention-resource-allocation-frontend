import "./simulation.css";
import { useReveal } from "../../hooks/useReveal";
import { useRevealOnMount } from "../../hooks/useRevealOnMount";

export default function VoucherAllocationSimulation() {
  const heroRef = useRevealOnMount(150);
  const contextRef = useReveal();
  const pressureRef = useReveal();
  const failureRef = useReveal();
  const entryRef = useReveal();

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
          often arrive nearly simultaneously. Under these conditions, millisecond
          differences can determine whether a request succeeds or fails.
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
          Simple strategies such as First-Come-First-Serve or Strict Priority are
          often chosen for their conceptual simplicity and ease of implementation.
          Under high contention, however, their limitations become immediately
          apparent.
        </p>

        <ul className="failure-list">
          <li>
            Low-priority requests may experience starvation and never receive
            resources, even after waiting for extended periods.
          </li>
          <li>
            Latency becomes unpredictable and strongly dependent on timing rather
            than business intent.
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
          fixed number of resources is defined upfront, and a burst of concurrent
          requests is generated according to configurable parameters.
        </p>

        <p>
          These requests are placed into an intermediate queue, where scheduling
          decisions are executed based on the simulated allocation strategy.
        </p>

        <p className="muted">
          The following sections focus on visualizing these decisions, from queue
          state evolution to final allocation outcomes.
        </p>
      </section>

      {/* ===== ACTION PLACEHOLDER ===== */}
      {/* Start Simulation / Visualization goes here */}
    </main>
  );
}

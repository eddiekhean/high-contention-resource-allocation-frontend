import "./css/simulation.css";
import { Link } from "react-router-dom";
import useReveal from "../../hooks/useReveal";
import { useRevealOnMount } from "../../hooks/useRevealOnMount";
export default function SimulationContent() {
  const introRef = useRevealOnMount(150);
  const listRef = useReveal();

  return (
    <main className="simulation-page simulation-index">
      <section ref={introRef} className="intro reveal">
        <h1>Learning Journey</h1>

        <p className="lead">
          This page documents my learning journey in system design, concurrency,
          and performance through a collection of focused simulations.
        </p>

        <div className="intro-body">
          <p>
            Instead of relying on theoretical explanations or isolated snippets,
            I build simulations that model how systems behave under real-world
            conditions.
          </p>

          <p>
            These include concurrent requests, limited resources, and different
            processing policies.
          </p>

          <p>
            Each simulation represents a concrete problem I encountered or
            intentionally explored while learning.
          </p>
        </div>

        <p className="intro-goal">
          The goal is to make abstract system concepts observable and traceable.
        </p>
      </section>

      <section ref={listRef} className="simulation-list reveal">
        <h2>Simulations</h2>

        <ul>
          <li>
            <Link
              to="/simulations/voucher-allocation"
              className="simulation-link"
            >
              <div className="item-header">
                <span className="name">
                  Voucher Allocation Under Contention
                </span>
              </div>
              <span className="meta">Redis · Concurrency · Fairness</span>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}

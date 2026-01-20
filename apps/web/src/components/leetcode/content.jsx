import "../../styles/shared-content.css";
import OrbitalBackground from "../common/OrbitalBackground";
import { Link } from "react-router-dom";
import useReveal from "../../hooks/useReveal";
import { useRevealOnMount } from "../../hooks/useRevealOnMount";

export default function LeetCodeContent() {
    const introRef = useRevealOnMount(100);
    const listRef = useRevealOnMount(400);

    return (
        <main className="app-stage app-container">
            <OrbitalBackground />
            <section ref={introRef} className="intro reveal">
                <h1>LeetCode Journey</h1>

                <p className="lead">
                    This page documents my problem-solving journey through LeetCode,
                    focusing on patterns, trade-offs, and reasoning rather than raw
                    problem counts.
                </p>

                <div className="intro-body">
                    <p>
                        Instead of grinding problems blindly, I group solutions by core
                        ideas such as data structure choice, state representation, and
                        algorithmic trade-offs.
                    </p>

                    <p>
                        Each problem is treated as a small system: inputs, constraints,
                        invariants, and failure modes.
                    </p>

                    <p>
                        Solutions emphasize clarity, correctness, and how the approach
                        scales under different constraints.
                    </p>
                </div>

                <p className="intro-goal">
                    The goal is to build strong algorithmic intuition that transfers
                    naturally to real-world system design.
                </p>
            </section>

            <section ref={listRef} className="nav-list reveal">
                <h2>Problem Sets</h2>

                <ul>
                    <li>
                        <Link
                            to="/leetcode/labyrinth"
                            className="nav-card"
                        >
                            <div className="item-header">
                                <span className="name">
                                    Labyrinth problem
                                </span>
                            </div>
                            <span className="meta">
                                BFS · DFS · A* · Variations
                            </span>
                        </Link>
                    </li>

                </ul>
            </section>
        </main>
    );
}

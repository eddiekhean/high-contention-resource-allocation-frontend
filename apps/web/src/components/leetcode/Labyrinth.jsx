import React from "react";
import "../../styles/shared-content.css";
import OrbitalBackground from "../common/OrbitalBackground";
import { useRevealOnMount } from "../../hooks/useRevealOnMount";

export default function Labyrinth() {
    const introRef = useRevealOnMount(100);
    const contentRef = useRevealOnMount(400);

    return (
        <main className="app-stage app-container">
            <OrbitalBackground />
            <section ref={introRef} className="intro reveal">
                <h1>Labyrinth Problem</h1>
                <p className="lead">
                    Traversal strategies: BFS, DFS, A*, and their variations.
                </p>
            </section>

            <section ref={contentRef} className="intro-body reveal">
                <h2>Problem Overview</h2>
                <p>
                    Finding a path through a grid or a maze is a classic problem that
                    introduces core search algorithms.
                </p>

                <h3>Algorithms</h3>
                <ul>
                    <li>
                        <strong>Breadth-First Search (BFS):</strong> Guarantees the
                        shortest path in unweighted graphs.
                    </li>
                    <li>
                        <strong>Depth-First Search (DFS):</strong> Explores paths
                        exhaustively; useful for connectivity and topological sorting.
                    </li>
                    <li>
                        <strong>A* Search:</strong> Uses heuristics to find the shortest
                        path more efficiently than BFS.
                    </li>
                </ul>

                <h3>Key Variations</h3>
                <ul>
                    <li>Multi-source BFS for nearest exit problems.</li>
                    <li>State-space search for labyrinths with keys or transitions.</li>
                    <li>Dijkstra for weighted edges in complex terrains.</li>
                </ul>
            </section>
        </main>
    );
}

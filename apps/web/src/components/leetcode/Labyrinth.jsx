import React, { useState, useRef } from 'react';
import OrbitalBackground from '../common/OrbitalBackground';
import MazeRenderer from './MazeRenderer';
import { generateMaze, submitMaze } from '../../services/simulationApi';
import './Labyrinth.css';

/**
 * Labyrinth Component
 *
 * An educational UI for explaining and visualizing the Labyrinth (Maze) Problem.
 * Refined to match the project's design language and layout patterns.
 */

// Content for Algorithm Explanations
const ALGORITHM_INFO = {
    bfs: {
        title: 'Breadth-First Search (BFS)',
        description: 'Breadth-First Search explores the maze level-by-level, starting from the source and visiting all neighbors at the current depth before moving to the next level.',
        keyPoints: [
            'Guarantees the shortest path in unweighted mazes.',
            'Uses a queue (FIFO) data structure.',
            'Explores systematically in all directions.'
        ]
    },
    dfs: {
        title: 'Depth-First Search (DFS)',
        description: 'Depth-First Search explores the maze by going as deep as possible along each branch before backtracking.',
        keyPoints: [
            'Memory-efficient (uses a stack or recursion).',
            'Does not guarantee the shortest path.',
            'Often used for maze generation itself.'
        ]
    },
    astar: {
        title: 'A* Search',
        description: 'A* Search is an informed search algorithm that uses heuristics to guide its exploration towards the goal.',
        keyPoints: [
            'Combines actual cost from start and estimated cost to goal.',
            'Efficient and optimal if the heuristic is admissible.',
            'Widely used in gaming and robotics for pathfinding.'
        ]
    },
    greedy: {
        title: 'Greedy Best-First Search',
        description: 'Greedy Best-First Search expands the node that appears to be closest to the goal based on a heuristic.',
        keyPoints: [
            'Prioritizes speed over optimality.',
            'Can get stuck in local minima or dead ends.',
            'Fast performance in simple environments.'
        ]
    }
};

const TRAVERSAL_STRATEGIES = {
    bfs: "BFS",
    dfs: "DFS",
    astar: "ASTAR",
    greedy: "GREEDY"
};

const Labyrinth = () => {
    const [selectedAlgo, setSelectedAlgo] = useState('bfs');

    // Maze Data State
    const [mazeData, setMazeData] = useState(null);
    const [genParams, setGenParams] = useState({
        rows: 20,
        cols: 20,
        loop_ratio: 0.5,
        seed: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [cellStates, setCellStates] = useState(new Map());
    const [isAnimating, setIsAnimating] = useState(false);
    const animationRef = useRef(null);

    const handleGenerate = async () => {
        setLoading(true);
        // Reset states on new generation
        setCellStates(new Map());
        setIsAnimating(false);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);

        try {
            const data = await generateMaze({
                rows: Number(genParams.rows),
                cols: Number(genParams.cols),
                loop_ratio: Number(genParams.loop_ratio),
                seed: genParams.seed
            });
            setMazeData(data);
        } catch (error) {
            console.error("Failed to generate maze:", error);
            // Optionally set error state here or show a toast
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!mazeData) return;
        setSubmitting(true);
        // Clear previous animation
        setCellStates(new Map());
        if (animationRef.current) cancelAnimationFrame(animationRef.current);

        const payload = {
            ...mazeData,
            strategy: TRAVERSAL_STRATEGIES[selectedAlgo] || "BFS"
        };

        try {
            const result = await submitMaze(payload);
            console.log("Maze submitted successfully (verified HMR), result:", result);
            // Handle PascalCase (Path, Steps) or camelCase (path, steps)
            // Backend seems to return PascalCase based on logs
            const steps = result.Steps || result.steps;
            const path = result.Path || result.path;

            // Start animation
            animateSolution(steps, path);
        } catch (error) {
            console.error("Failed to submit maze:", error);
            alert("Failed to submit maze. Check console for details.");
        } finally {
            setSubmitting(false);
        }
    };

    const animateSolution = (steps, finalPath) => {
        if (!steps || steps.length === 0) {
            console.warn("No steps to animate. Received:", steps);
            return;
        }

        // Ensure steps are sorted by step index
        const sortedSteps = [...steps].sort((a, b) => {
            const stepA = a.step !== undefined ? a.step : a.Step;
            const stepB = b.step !== undefined ? b.step : b.Step;
            return stepA - stepB;
        });

        setIsAnimating(true);
        let stepIndex = 0;
        let lastTime = 0;
        const speed = 40; // ms per step

        const newStates = new Map();

        const tick = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const elapsed = timestamp - lastTime;

            if (elapsed > speed) {
                // Process one step
                if (stepIndex < sortedSteps.length) {
                    const step = sortedSteps[stepIndex];
                    // Handle PascalCase (backend) vs camelCase
                    const point = step.point || step.Point;
                    const type = step.type || step.Type;

                    if (point) {
                        const x = point.x !== undefined ? point.x : point.X;
                        const y = point.y !== undefined ? point.y : point.Y;
                        const key = `${x},${y}`;

                        // Update state map
                        newStates.set(key, type);
                        setCellStates(new Map(newStates));
                    }

                    stepIndex++;
                    lastTime = timestamp;
                } else {
                    // Animation complete
                    // Explicitly highlight the final path as per requirements
                    if (finalPath && finalPath.length > 0) {
                        finalPath.forEach(p => {
                            const x = p.x !== undefined ? p.x : p.X;
                            const y = p.y !== undefined ? p.y : p.Y;
                            newStates.set(`${x},${y}`, 'PATH');
                        });
                        setCellStates(new Map(newStates));
                    }

                    setIsAnimating(false);
                    return;
                }
            }

            animationRef.current = requestAnimationFrame(tick);
        };

        animationRef.current = requestAnimationFrame(tick);
    };

    const currentAlgo = ALGORITHM_INFO[selectedAlgo];

    return (
        <div className="labyrinth-page">
            <OrbitalBackground />
            <div className="labyrinth-container">
                {/* LEFT COLUMN: MAZE DISPLAY & CONTROL */}
                <section className="maze-section">
                    <div className="labyrinth-card">
                        <div className="maze-display-frame">
                            {mazeData ? (
                                <MazeRenderer mazeData={mazeData} cellStates={cellStates} />
                            ) : (
                                <div className="maze-placeholder">
                                    <div className="maze-placeholder-icon">🗺️</div>
                                    <p>No maze generated</p>
                                    <p style={{ fontSize: '13px', marginTop: '8px', opacity: 0.6 }}>
                                        Set parameters and click Generate
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Control Panel */}
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div className="control-group">
                                <label>Rows</label>
                                <input
                                    type="number"
                                    value={genParams.rows}
                                    onChange={e => setGenParams({ ...genParams, rows: e.target.value })}
                                    min="5" max="50"
                                />
                            </div>
                            <div className="control-group">
                                <label>Cols</label>
                                <input
                                    type="number"
                                    value={genParams.cols}
                                    onChange={e => setGenParams({ ...genParams, cols: e.target.value })}
                                    min="5" max="50"
                                />
                            </div>
                            <div className="control-group">
                                <label>Loop Ratio</label>
                                <input
                                    type="number"
                                    value={genParams.loop_ratio}
                                    onChange={e => setGenParams({ ...genParams, loop_ratio: e.target.value })}
                                    min="0" max="1" step="0.1"
                                />
                            </div>
                            <div className="control-group">
                                <label>Seed (Optional)</label>
                                <input
                                    type="number"
                                    value={genParams.seed}
                                    onChange={e => setGenParams({ ...genParams, seed: e.target.value })}
                                    placeholder="Random"
                                />
                            </div>

                            <button
                                className="action-button"
                                onClick={handleGenerate}
                                disabled={loading}
                                style={{ marginLeft: 'auto' }}
                            >
                                {loading ? 'Generating...' : 'Generate Maze'}
                            </button>
                            <button
                                className="action-button"
                                onClick={handleSubmit}
                                disabled={submitting || !mazeData}
                                style={{ marginLeft: '10px' }}
                            >
                                {submitting ? 'Submitting...' : 'Submit Maze'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* RIGHT COLUMN: INFO & ALGO EXPLANATION */}
                <section className="info-section">
                    <div className="labyrinth-card intro-panel">
                        <h1>Labyrinth Problem</h1>
                        <p>
                            A classic computational challenge where the objective is to navigate
                            from a start point to an exit through a complex network of paths and obstacles.
                        </p>
                        <div style={{ marginBottom: '12px', fontWeight: '600', color: '#6f8cff' }}>
                            Real-world Applications:
                        </div>
                        <ul className="app-list">
                            <li><strong>Pathfinding:</strong> GPS and network routing optimization.</li>
                            <li><strong>Robotics:</strong> Autonomous navigation in dynamic environments.</li>
                            <li><strong>Games:</strong> NPC behavior and procedural level generation.</li>
                            <li><strong>AI:</strong> Search space exploration in decision-making models.</li>
                        </ul>
                    </div>

                    <div className="labyrinth-card algo-panel">
                        <h2>
                            <span>⚙️</span> Traversal Strategies
                        </h2>

                        <select
                            className="algo-select"
                            value={selectedAlgo}
                            onChange={(e) => setSelectedAlgo(e.target.value)}
                        >
                            <option value="bfs">Breadth-First Search (BFS)</option>
                            <option value="dfs">Depth-First Search (DFS)</option>
                            <option value="astar">A* Search</option>
                            <option value="greedy">Greedy Best-First Search</option>
                        </select>

                        <div className="algo-content">
                            <h3>{currentAlgo.title}</h3>
                            <p>{currentAlgo.description}</p>
                            <ul>
                                {currentAlgo.keyPoints.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        </div>

                        <p className="placeholder-text">
                            Maze solving visualization will be implemented in a future version.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Labyrinth;

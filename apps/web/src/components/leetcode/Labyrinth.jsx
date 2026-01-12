import React, { useState, useRef, useEffect } from 'react';
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
    const [speed, setSpeed] = useState(40);
    const speedRef = useRef(40);

    // Update ref when speed changes
    useEffect(() => {
        speedRef.current = speed;
    }, [speed]);

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
        // speed is now read from ref in loop

        const newStates = new Map();

        const tick = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const elapsed = timestamp - lastTime;

            if (elapsed > speedRef.current) {
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
                {/* PRIMARY CONTENT: SIMULATION ZONE */}
                <div className="simulation-zone">
                    {/* LEFT: MAZE VISUALIZATION & CONTROLS */}
                    <section className="maze-section">
                        <div className="labyrinth-card maze-card">
                            <div className="maze-header">
                                <h2>Maze Visualization</h2>
                                <div className="maze-status">
                                    {loading && <span className="status-badge loading">Generating</span>}
                                    {submitting && <span className="status-badge active">Solving</span>}
                                </div>
                            </div>

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

                            {/* Control Panel inside the maze card for tight integration */}
                            <div className="control-panel">
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
                                    <label>Seed</label>
                                    <input
                                        type="number"
                                        value={genParams.seed}
                                        onChange={e => setGenParams({ ...genParams, seed: e.target.value })}
                                        placeholder="Random"
                                    />
                                </div>
                                <div className="control-group speed-control">
                                    <label>Speed: {speed}ms</label>
                                    <input
                                        type="range"
                                        min="10"
                                        max="500"
                                        step="10"
                                        value={speed}
                                        onChange={e => setSpeed(Number(e.target.value))}
                                    />
                                </div>

                                <div className="action-buttons">
                                    <button
                                        className="action-button secondary"
                                        onClick={handleGenerate}
                                        disabled={loading}
                                    >
                                        {loading ? '...' : 'Generate'}
                                    </button>
                                    <button
                                        className="action-button primary"
                                        onClick={handleSubmit}
                                        disabled={submitting || !mazeData}
                                    >
                                        {submitting ? '...' : 'Solve'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT: ALGORITHM EXPLANATION */}
                    <section className="algo-section">
                        <div className="labyrinth-card algo-panel">
                            <h2>
                                <span>⚙️</span> Algorithm
                            </h2>

                            <div className="algo-selector-wrapper">
                                <label>Traversal Strategy</label>
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
                            </div>

                            <div className="algo-content">
                                <h3>{currentAlgo.title}</h3>
                                <p>{currentAlgo.description}</p>
                                <h4>Key Characteristics:</h4>
                                <ul>
                                    {currentAlgo.keyPoints.map((point, index) => (
                                        <li key={index}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                {/* SECONDARY CONTENT: CONTEXT & INFO */}
                <section className="context-section">
                    <div className="labyrinth-card intro-panel">
                        <div className="intro-content">
                            <div>
                                <h1>Labyrinth Problem</h1>
                                <p>
                                    A classic computational challenge where the objective is to navigate
                                    from a start point to an exit through a complex network of paths and obstacles.
                                    This simulation visualizes how different algorithms approach the problem of pathfinding.
                                </p>
                            </div>
                            <div className="applications-list">
                                <h3>Real-world Applications</h3>
                                <ul className="app-list">
                                    <li><strong>Pathfinding:</strong> GPS and network routing optimization.</li>
                                    <li><strong>Robotics:</strong> Autonomous navigation in dynamic environments.</li>
                                    <li><strong>Games:</strong> NPC behavior and procedural level generation.</li>
                                    <li><strong>AI:</strong> Search space exploration in decision-making models.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Labyrinth;

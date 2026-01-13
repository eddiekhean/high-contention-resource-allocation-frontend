import React, { useState, useRef, useEffect, useCallback } from 'react';
import OrbitalBackground from '../common/OrbitalBackground';
import MazeRenderer from './MazeRenderer';
import AnimationControls from './AnimationControls';
import AlgoMetrics from './AlgoMetrics';
import { generateMaze, submitMaze } from '../../services/simulationApi';
import './Labyrinth.css';

/**
 * Labyrinth Component
 *
 * An educational UI for explaining and visualizing the Labyrinth (Maze) Problem.
 * Now features a robust animation engine and metrics visualization.
 */

// Content for Algorithm Explanations
const ALGORITHM_INFO = {
    bfs: {
        title: 'Breadth-First Search (BFS)',
        description: 'Breadth-First Search explores the maze level-by-level, starting from the source and visiting all neighbors at the current depth before moving to the next level.',
        keyPoints: [
            'Guarantees the shortest path in unweighted mazes.',
            'Uses a queue (FIFO) data structure.',
            'Explores systematically in all directions.',
            'Time Complexity: O(V + E)',
            'Space Complexity: O(V)'
        ]
    },
    dfs: {
        title: 'Depth-First Search (DFS)',
        description: 'Depth-First Search explores the maze by going as deep as possible along each branch before backtracking.',
        keyPoints: [
            'Memory-efficient (uses a stack or recursion) implementation dependent.',
            'Does not guarantee the shortest path.',
            'Often used for maze generation itself.',
            'Time Complexity: O(V + E)',
            'Space Complexity: O(V)'
        ]
    },
    astar: {
        title: 'A* Search',
        description: 'A* Search is an informed search algorithm that uses heuristics to guide its exploration towards the goal.',
        keyPoints: [
            'Combines actual cost from start and estimated cost to goal.',
            'Efficient and optimal if the heuristic is admissible.',
            'Widely used in gaming and robotics for pathfinding.',
            'Time Complexity: Depends on heuristic',
            'Space Complexity: O(V)'
        ]
    },
    greedy: {
        title: 'Greedy Best-First Search',
        description: 'Greedy Best-First Search expands the node that appears to be closest to the goal based on a heuristic.',
        keyPoints: [
            'Prioritizes speed over optimality.',
            'Can get stuck in local minima or dead ends.',
            'Fast performance in simple environments.',
            'Time Complexity: O(b^m) worst case',
            'Space Complexity: O(V)'
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
    // UI State
    const [selectedAlgo, setSelectedAlgo] = useState('bfs');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Maze Data
    const [mazeData, setMazeData] = useState(null);
    const [genParams, setGenParams] = useState({
        rows: 20,
        cols: 20,
        loop_ratio: 0.5,
        seed: ''
    });

    // Animation Engine State
    const [steps, setSteps] = useState([]); // Full history of steps
    const [finalPath, setFinalPath] = useState([]); // Final solution path
    const [currentStepIndex, setCurrentStepIndex] = useState(0); // Current playback position
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(40); // ms per frame

    // Visualization State (Derived)
    const [cellStates, setCellStates] = useState(new Map());

    // Refs for Animation Loop
    const animationFrameRef = useRef(null);
    const lastFrameTimeRef = useRef(0);

    // --- Maze Generation ---
    const handleGenerate = async () => {
        setLoading(true);
        resetAnimation();
        setMazeData(null); // Clear old maze while generating

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
            alert("Failed to generate maze.");
        } finally {
            setLoading(false);
        }
    };

    // --- Maze Solving ---
    const handleSubmit = async () => {
        if (!mazeData) return;
        setSubmitting(true);
        resetAnimation();

        const payload = {
            ...mazeData,
            strategy: TRAVERSAL_STRATEGIES[selectedAlgo] || "BFS"
        };

        try {
            const result = await submitMaze(payload);
            const rawSteps = result.Steps || result.steps || [];
            const rawPath = result.Path || result.path || [];

            // Sort steps by index to ensure correct playback order
            const sortedSteps = [...rawSteps].sort((a, b) => {
                const stepA = a.step !== undefined ? a.step : a.Step;
                const stepB = b.step !== undefined ? b.step : b.Step;
                return stepA - stepB;
            });

            setSteps(sortedSteps);
            setFinalPath(rawPath);
            setCurrentStepIndex(0);
            setIsPlaying(true); // Auto-start
        } catch (error) {
            console.error("Failed to submit maze:", error);
            alert("Failed to solve maze. See console.");
        } finally {
            setSubmitting(false);
        }
    };

    // --- Animation Logic ---

    const resetAnimation = useCallback(() => {
        setIsPlaying(false);
        setCurrentStepIndex(0);
        setSteps([]);
        setFinalPath([]);
        setCellStates(new Map());
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
    }, []);

    const stepForward = useCallback(() => {
        setCurrentStepIndex(prev => Math.min(prev + 1, steps.length));
    }, [steps.length]);

    const stepBackward = useCallback(() => {
        setCurrentStepIndex(prev => Math.max(0, prev - 1));
    }, []);

    // The Animation Loop
    useEffect(() => {
        if (!isPlaying) {
            lastFrameTimeRef.current = 0;
            return;
        }

        const loop = (timestamp) => {
            if (!lastFrameTimeRef.current) lastFrameTimeRef.current = timestamp;
            const elapsed = timestamp - lastFrameTimeRef.current;

            if (elapsed > playbackSpeed) {
                setCurrentStepIndex(prev => {
                    const next = prev + 1;
                    if (next > steps.length) {
                        setIsPlaying(false); // Stop at end
                        return prev;
                    }
                    return next;
                });
                lastFrameTimeRef.current = timestamp;
            }

            animationFrameRef.current = requestAnimationFrame(loop);
        };

        animationFrameRef.current = requestAnimationFrame(loop);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isPlaying, playbackSpeed, steps.length]);

    // Derived State Computation: Update Visuals when Step Index Changes
    // Optimized: Only re-calc when index changes. 
    // For very large mazes, consider incremental updates, but for <50x50 this is fine.
    useEffect(() => {
        if (!steps.length) return;

        const newMap = new Map();

        // 1. Draw Visited Cells up to current index
        // We limit the number of items we process if we just want to jump to state
        const limit = Math.min(currentStepIndex, steps.length);

        for (let i = 0; i < limit; i++) {
            const step = steps[i];
            const p = step.point || step.Point;
            // Standardize coordinate keys
            const x = p.x !== undefined ? p.x : p.X;
            const y = p.y !== undefined ? p.y : p.Y;

            // Mark as visited
            newMap.set(`${x},${y}`, 'VISIT');
        }

        // 2. Highlight the "Frontier" (the very last step processed)
        if (limit > 0 && limit <= steps.length) {
            const headStep = steps[limit - 1];
            const p = headStep.point || headStep.Point;
            const x = p.x !== undefined ? p.x : p.X;
            const y = p.y !== undefined ? p.y : p.Y;
            newMap.set(`${x},${y}`, 'FRONTIER');
        }

        // 3. Draw Path if animation is complete or near end
        // Only show path if we are at the very end
        if (currentStepIndex >= steps.length && finalPath.length > 0) {
            finalPath.forEach(node => {
                const x = node.x !== undefined ? node.x : node.X;
                const y = node.y !== undefined ? node.y : node.Y;
                newMap.set(`${x},${y}`, 'PATH');
            });
        }

        setCellStates(newMap);

    }, [currentStepIndex, steps, finalPath]);


    const currentAlgo = ALGORITHM_INFO[selectedAlgo];
    const gridSize = genParams.rows * genParams.cols;

    return (
        <div className="labyrinth-page">
            <OrbitalBackground />
            <div className="labyrinth-container">
                {/* HEADER: CONTEXT & INFO */}
                <section className="context-section" style={{ marginBottom: '32px' }}>
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
                                    {(!loading && !submitting && isPlaying) && <span className="status-badge active">Animating</span>}
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

                            {/* Control Panel: Generation Params */}
                            <div className="control-panel">
                                <div className="control-group">
                                    <label>Rows</label>
                                    <input
                                        type="number"
                                        value={genParams.rows}
                                        onChange={e => setGenParams({ ...genParams, rows: e.target.value })}
                                        min="5" max="100"
                                        disabled={loading || isPlaying}
                                    />
                                </div>
                                <div className="control-group">
                                    <label>Cols</label>
                                    <input
                                        type="number"
                                        value={genParams.cols}
                                        onChange={e => setGenParams({ ...genParams, cols: e.target.value })}
                                        min="5" max="100"
                                        disabled={loading || isPlaying}
                                    />
                                </div>
                                <div className="control-group">
                                    <label>Loop Ratio</label>
                                    <input
                                        type="number"
                                        value={genParams.loop_ratio}
                                        onChange={e => setGenParams({ ...genParams, loop_ratio: e.target.value })}
                                        min="0.2" max="0.5" step="0.1"
                                        disabled={loading || isPlaying}
                                    />
                                </div>
                                <div className="control-group">
                                    <label>Seed</label>
                                    <input
                                        type="number"
                                        value={genParams.seed}
                                        onChange={e => setGenParams({ ...genParams, seed: e.target.value })}
                                        placeholder="Random"
                                        disabled={loading || isPlaying}
                                    />
                                </div>

                                <div className="action-buttons">
                                    <button
                                        className="action-button secondary"
                                        onClick={handleGenerate}
                                        disabled={loading || isPlaying}
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

                    {/* RIGHT: ALGORITHM EXPLANATION & METRICS */}
                    <section className="algo-section">
                        {/* Playback Controls */}
                        {steps.length > 0 && (
                            <div className="labyrinth-card playback-card" style={{ marginBottom: '24px' }}>
                                <AnimationControls
                                    isPlaying={isPlaying}
                                    onPlayPause={() => setIsPlaying(!isPlaying)}
                                    onStepForward={stepForward}
                                    onStepBackward={stepBackward}
                                    onReset={() => {
                                        setIsPlaying(false);
                                        setCurrentStepIndex(0);
                                    }}
                                    speed={playbackSpeed}
                                    onSpeedChange={setPlaybackSpeed}
                                    progress={steps.length ? currentStepIndex / steps.length : 0}
                                    totalSteps={steps.length}
                                />
                            </div>
                        )}

                        {/* Real-time Metrics */}
                        {steps.length > 0 && (
                            <div className="labyrinth-card algo-panel" style={{ marginBottom: '24px' }}>
                                <AlgoMetrics
                                    algorithmName={TRAVERSAL_STRATEGIES[selectedAlgo]}
                                    stepsExplored={currentStepIndex}
                                    pathLength={finalPath.length}
                                    gridSize={gridSize}
                                    timeComplexity={currentAlgo.keyPoints.find(k => k.includes('Time Complexity'))?.split(': ')[1]}
                                    spaceComplexity={currentAlgo.keyPoints.find(k => k.includes('Space Complexity'))?.split(': ')[1]}
                                />
                            </div>
                        )}

                        {/* Algorithm Explanation (Always Visible) */}
                        <div className="labyrinth-card algo-panel">
                            <h2><span>⚙️</span> Algorithm</h2>
                            <div className="algo-selector-wrapper">
                                <label>Traversal Strategy</label>
                                <select
                                    className="algo-select"
                                    value={selectedAlgo}
                                    onChange={(e) => setSelectedAlgo(e.target.value)}
                                    disabled={isPlaying}
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


            </div>
        </div>
    );
};

export default Labyrinth;

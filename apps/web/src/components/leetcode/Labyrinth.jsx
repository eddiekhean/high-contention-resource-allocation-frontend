import React, { useState } from 'react';
import OrbitalBackground from '../common/OrbitalBackground';
import ImageUploader from './ImageUploader';
import ImageGallery from './ImageGallery';
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

const Labyrinth = () => {
    const [selectedAlgo, setSelectedAlgo] = useState('bfs');
    const [mazeImage, setMazeImage] = useState(null);
    const [showGallery, setShowGallery] = useState(true);
    const [selectedImageId, setSelectedImageId] = useState(null);

    const handleUploadSuccess = (file, hash) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setMazeImage(reader.result);
            setSelectedImageId(null);
        };
        reader.readAsDataURL(file);
        console.log('Image processed and matched. dHash:', hash);
    };

    const handleSelectImage = (img) => {
        setMazeImage(img.url);
        setSelectedImageId(img.id);
    };

    const currentAlgo = ALGORITHM_INFO[selectedAlgo];

    return (
        <div className="labyrinth-page">
            <OrbitalBackground />
            <div className="labyrinth-container">
                {/* LEFT COLUMN: MAZE DISPLAY & GALLERY */}
                <section className="maze-section">
                    <div className="labyrinth-card">
                        <div className="maze-display-frame">
                            {mazeImage ? (
                                <img src={mazeImage} alt="Selected Maze" />
                            ) : (
                                <div className="maze-placeholder">
                                    <div className="maze-placeholder-icon">🗺️</div>
                                    <p>No maze selected</p>
                                    <p style={{ fontSize: '13px', marginTop: '8px', opacity: 0.6 }}>
                                        Upload an image or browse the gallery
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="upload-btn-container">
                            <ImageUploader onUploadSuccess={handleUploadSuccess} />
                        </div>
                    </div>

                    <div className="labyrinth-card gallery-container">
                        <div className="gallery-header">
                            <h2>Community Gallery</h2>
                            <button
                                className="browse-btn"
                                onClick={() => setShowGallery(!showGallery)}
                            >
                                {showGallery ? 'Hide Gallery' : 'Show Gallery'}
                            </button>
                        </div>

                        {showGallery && (
                            <ImageGallery
                                onSelect={handleSelectImage}
                                selectedId={selectedImageId}
                            />
                        )}
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

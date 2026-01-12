import React from 'react';
import './AlgoMetrics.css';

const AlgoMetrics = ({
    algorithmName,
    stepsExplored,
    pathLength,
    gridSize, // Total cells (rows * cols)
    timeComplexity,
    spaceComplexity
}) => {
    const coverage = gridSize > 0 ? ((stepsExplored / gridSize) * 100).toFixed(1) : 0;
    const efficiency = stepsExplored > 0 ? (pathLength / stepsExplored).toFixed(3) : 0;

    return (
        <div className="algo-metrics">
            <h3 className="metrics-title">
                Running: <span>{algorithmName}</span>
            </h3>

            <div className="metrics-grid">
                <div className="metric-card">
                    <span className="metric-label">Steps Explored</span>
                    <span className="metric-value">{stepsExplored}</span>
                    <span className="metric-sub">{coverage}% of Map</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Path Length</span>
                    <span className="metric-value highlight">{pathLength || '--'}</span>
                    <span className="metric-sub">Nodes</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Efficiency</span>
                    <span className="metric-value">{efficiency}</span>
                    <span className="metric-sub">Path / Steps</span>
                </div>
            </div>

            <div className="complexity-info">
                <div className="complexity-row">
                    <span className="comp-label">Time Complexity:</span>
                    <code className="comp-val">{timeComplexity || 'O(V + E)'}</code>
                </div>
                <div className="complexity-row">
                    <span className="comp-label">Space Complexity:</span>
                    <code className="comp-val">{spaceComplexity || 'O(V)'}</code>
                </div>
            </div>
        </div>
    );
};

export default AlgoMetrics;

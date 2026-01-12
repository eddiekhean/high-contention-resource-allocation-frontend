import React from 'react';
import './AnimationControls.css';

const AnimationControls = ({
    isPlaying,
    onPlayPause,
    onStepForward,
    onStepBackward,
    onReset,
    speed,
    onSpeedChange,
    progress, // 0 to 1
    totalSteps
}) => {
    return (
        <div className="animation-controls">
            <div className="playback-bar">
                <button
                    className="control-btn"
                    onClick={onReset}
                    title="Reset"
                >
                    ⏪
                </button>
                <button
                    className="control-btn"
                    onClick={onStepBackward}
                    disabled={isPlaying || progress <= 0}
                    title="Step Backward"
                >
                    ◀
                </button>
                <button
                    className={`control-btn play-pause ${isPlaying ? 'active' : ''}`}
                    onClick={onPlayPause}
                    title={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                    className="control-btn"
                    onClick={onStepForward}
                    disabled={isPlaying || progress >= 1}
                    title="Step Forward"
                >
                    ▶
                </button>
            </div>

            <div className="progress-section">
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
                    />
                </div>
                <span className="step-counter">
                    {Math.round(progress * totalSteps)} / {totalSteps} steps
                </span>
            </div>

            <div className="speed-section">
                <span className="speed-label">Speed</span>
                <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    // Reverse value so slider right is faster (smaller delay)
                    value={510 - speed}
                    onChange={(e) => onSpeedChange(510 - Number(e.target.value))}
                    className="speed-slider"
                />
            </div>
        </div>
    );
};

export default AnimationControls;

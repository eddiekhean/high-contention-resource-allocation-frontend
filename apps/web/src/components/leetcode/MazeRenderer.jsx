import React, { useEffect, useRef } from 'react';
import { drawingSurfaces } from './drawingSurfaces';
import './MazeRenderer.css';

const MazeRenderer = ({ mazeData }) => {
    const canvasRef = useRef(null);
    const surfaceRef = useRef(null);

    useEffect(() => {
        if (!mazeData || !canvasRef.current) return;

        const { rows, cols, cells, start, end } = mazeData;
        const canvas = canvasRef.current;

        // Set high resolution for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        // We'll trust the CSS to set the size, but we need internal resolution
        // Check if we need to resize
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        }

        // Initialize user provided drawing surface
        const surface = drawingSurfaces.canvas({ el: canvas });
        surfaceRef.current = surface;

        // Configure coordinate system
        // The drawingSurfaces seems to expect us to define a logical coordinate space.
        // We will map 0..cols and 0..rows to the canvas.
        surface.setSpaceRequirements(cols, rows);

        surface.clear();

        // 1. Draw Background (Optional, maybe just clear is fine)

        // 2. Draw Start and End
        if (start) {
            surface.setColour('#00ff9d33'); // Transparent Green
            surface.fillPolygon(
                { x: start.x, y: start.y },
                { x: start.x + 1, y: start.y },
                { x: start.x + 1, y: start.y + 1 },
                { x: start.x, y: start.y + 1 }
            );
            // Marker center (filled)
            surface.setColour('#00ff9d');
            surface.fillSegment(start.x + 0.5, start.y + 0.5, 0, 0.3, 0, Math.PI * 2);
        }

        if (end) {
            surface.setColour('#ff005533'); // Transparent Red
            surface.fillPolygon(
                { x: end.x, y: end.y },
                { x: end.x + 1, y: end.y },
                { x: end.x + 1, y: end.y + 1 },
                { x: end.x, y: end.y + 1 }
            );
            // Marker center (filled)
            surface.setColour('#ff0055');
            surface.fillSegment(end.x + 0.5, end.y + 0.5, 0, 0.3, 0, Math.PI * 2);
        }

        // 3. Draw Walls
        surface.setColour('#6f8cff');

        cells.forEach(cell => {
            const { x, y, walls } = cell;
            if (walls.top) surface.line(x, y, x + 1, y);
            if (walls.right) surface.line(x + 1, y, x + 1, y + 1);
            if (walls.bottom) surface.line(x, y + 1, x + 1, y + 1);
            if (walls.left) surface.line(x, y, x, y + 1);
        });

        // Cleanup
        return () => {
            if (surfaceRef.current) {
                surfaceRef.current.dispose();
            }
        };

    }, [mazeData]);

    return (
        <div className="maze-renderer">
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
};

export default MazeRenderer;

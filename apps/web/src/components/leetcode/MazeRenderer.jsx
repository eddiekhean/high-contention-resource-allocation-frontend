import React, { useEffect, useRef } from 'react';
import { drawingSurfaces } from './drawingSurfaces';
import './MazeRenderer.css';

const MazeRenderer = ({ mazeData, cellStates }) => {
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
        // pass 3 as shapeSpecificLineWidthAdjustment to make walls thicker
        // We will reset this later for walls, or just set it here. 
        // Actually, setSpaceRequirements sets the global line width.
        // If we want thin walls, 1 is good.
        surface.setSpaceRequirements(cols, rows, 1);

        surface.clear();

        // Get styles from CSS
        const computedStyle = getComputedStyle(canvas);
        const wallColor = computedStyle.getPropertyValue('--maze-wall-color').trim() || '#6f8cff';
        const wallWidth = parseFloat(computedStyle.getPropertyValue('--maze-wall-width').trim()) || 1;


        // 1. Draw Background (Optional, maybe just clear is fine)

        // 2. Draw Cell States (Animation/Solution) - Background Layer
        if (cellStates && cellStates.size > 0) {
            cellStates.forEach((type, key) => {
                const [sx, sy] = key.split(',').map(Number);

                let color = null;
                let padding = 0; // Default padding

                if (type === 'VISIT') {
                    color = '#4aa3df66'; // Light Blue with transparency
                }
                if (type === 'FRONTIER') {
                    color = '#f9f871'; // Bright Yellow for current head
                    padding = 0.1;
                }
                if (type === 'ENQUEUE') {
                    // color = '#f9f87180'; // Optional: show queue
                }
                if (type === 'PATH') {
                    color = '#00cc7a'; // Deep/Rich Green
                    padding = 0.2; // Smaller path (inset)
                }

                if (color) {
                    surface.setColour(color);
                    surface.fillPolygon(
                        { x: sx + padding, y: sy + padding },
                        { x: sx + 1 - padding, y: sy + padding },
                        { x: sx + 1 - padding, y: sy + 1 - padding },
                        { x: sx + padding, y: sy + 1 - padding }
                    );
                }
            });
        }

        // 3. Draw Start/End Markers (Middle Layer)
        if (start) {
            // Marker center (filled)
            surface.setColour('#00ff9d');
            surface.fillSegment(start.x + 0.5, start.y + 0.5, 0, 0.3, 0, Math.PI * 2);
        }



        if (end) {
            // Marker center (filled)
            surface.setColour('#ff0055');
            surface.fillSegment(end.x + 0.5, end.y + 0.5, 0, 0.3, 0, Math.PI * 2);
        }

        // 4. Draw Walls (Last to cover edges of cells)
        // Restore to default (1) for thinner walls
        surface.setSpaceRequirements(cols, rows, wallWidth);
        // Use theme color
        surface.setColour(wallColor);

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

    }, [mazeData, cellStates]);

    return (
        <div className="maze-renderer">
            <canvas
                ref={canvasRef}
                style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    aspectRatio: `${mazeData.cols} / ${mazeData.rows}`
                }}
            />
        </div>
    );
};

export default MazeRenderer;

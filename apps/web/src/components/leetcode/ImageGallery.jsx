import { useState, useEffect } from "react";
import { fetchImages } from "../../services/simulationApi";
import "./ImageGallery.css";

export default function ImageGallery({ onSelect, selectedId }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadImages = async () => {
            try {
                setLoading(true);
                const data = await fetchImages();
                setImages(data);
                setError(null);
            } catch (err) {
                console.error("Failed to load gallery:", err);
                setError("Failed to load images. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        loadImages();
    }, []);

    if (loading) {
        return (
            <div className="gallery-placeholder">
                <div className="spinner"></div>
                <p>Fetching amazing mazes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="gallery-placeholder error">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="gallery-grid">
            {images.map((img) => (
                <div
                    key={img.id}
                    className={`gallery-item ${selectedId === img.id ? "selected" : ""}`}
                    onClick={() => onSelect && onSelect(img)}
                >
                    <div className="image-container">
                        <img src={img.url} alt={`Maze ${img.id}`} loading="lazy" />
                        <div className="image-overlay">
                            <span className="image-hash">Hash: {img.dhash}</span>
                        </div>
                    </div>
                </div>
            ))}

            {images.length === 0 && (
                <div className="gallery-placeholder empty">
                    <p>No images found in the gallery.</p>
                </div>
            )}
        </div>
    );
}

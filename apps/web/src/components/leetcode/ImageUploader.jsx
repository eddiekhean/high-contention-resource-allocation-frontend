import React, { useState } from 'react';
import { computeDHash, MAX_FILE_SIZE } from './ImageHashService';
import { matchImageHash } from '../../services/simulationApi';
import './ImageUploader.css';

/**
 * ImageUploader Component
 *
 * Handles file selection, client-side processing, and dHash API submission.
 */
const ImageUploader = ({ onUploadSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [hash, setHash] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Reset state
        setError(null);
        setHash(null);

        // 1. Validate file size (Max 5MB)
        if (file.size > MAX_FILE_SIZE) {
            setError(`File is too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max size is 5MB.`);
            return;
        }

        setIsProcessing(true);

        try {
            // 2. Client-side Image Processing & dHash computation
            const computedHash = await computeDHash(file);
            setHash(computedHash);

            // 3. Backend Communication via Service
            await matchImageHash(computedHash);

            // Callback to parent component (e.g., to display the image)
            if (onUploadSuccess) {
                onUploadSuccess(file, computedHash);
            }

        } catch (err) {
            console.error('Image processing error:', err);
            setError(err.message || 'An error occurred during image processing.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="image-uploader">
            <label className={`custom-file-upload ${isProcessing ? 'disabled' : ''}`}>
                <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                />
                {isProcessing ? 'Processing...' : 'Upload Maze Image'}
            </label>

            {error && <div className="upload-error">{error}</div>}

            {hash && (
                <div className="upload-info">
                    <span className="hash-label">dHash:</span>
                    <code className="hash-value">{hash}</code>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;

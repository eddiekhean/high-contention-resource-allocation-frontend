/**
 * ImageHashService
 *
 * Provides client-side image processing and dHash computation.
 * Using HTML5 Canvas API only as per requirements.
 */

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Computes a 64-bit dHash for a given image file.
 *
 * Algorithm Steps:
 * 1. Load image into an Image() object
 * 2. Resize image to 9x8 pixels
 * 3. Convert pixels to grayscale: gray = 0.299*R + 0.587*G + 0.114*B
 * 4. Compare adjacent pixels horizontally (9 pixels -> 8 comparisons per row)
 * 5. Generate 64-bit hash (8 rows * 8 bits)
 *
 * @param {File} file - The image file to process
 * @returns {Promise<string>} - The 64-bit hash as a hex string (16 chars)
 */
export async function computeDHash(file) {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size exceeds 5MB limit.');
    }

    const img = await loadImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Resize to 9x8
    canvas.width = 9;
    canvas.height = 8;
    ctx.drawImage(img, 0, 0, 9, 8);

    const imageData = ctx.getImageData(0, 0, 9, 8);
    const pixels = imageData.data;

    // Convert to grayscale
    const grayscale = [];
    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        // gray = 0.299 * R + 0.587 * G + 0.114 * B
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        grayscale.push(gray);
    }

    // Compute dHash (Difference Hash)
    // For each row (8 rows):
    // Compare adjacent pixels horizontally (9 pixels -> 8 comparisons)
    let hashBits = '';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const leftIdx = row * 9 + col;
            const rightIdx = row * 9 + col + 1;

            if (grayscale[leftIdx] > grayscale[rightIdx]) {
                hashBits += '1';
            } else {
                hashBits += '0';
            }
        }
    }

    // Convert binary string to Hex string (16 chars)
    return binaryToHex(hashBits);
}

/**
 * Loads an image file into an Image object.
 */
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error('Failed to load image.'));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Failed to read file.'));
        reader.readAsDataURL(file);
    });
}

/**
 * Converts a 64-bit binary string to a 16-character hex string.
 */
function binaryToHex(binary) {
    let hex = '';
    for (let i = 0; i < binary.length; i += 4) {
        const chunk = binary.substr(i, 4);
        const decimal = parseInt(chunk, 2);
        hex += decimal.toString(16);
    }
    return hex.padStart(16, '0');
}

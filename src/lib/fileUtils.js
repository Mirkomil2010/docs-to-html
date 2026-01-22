/**
 * Read file content as text
 * @param {File} file - File object
 * @returns {Promise<string>} - File content as string
 */
export function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            resolve(e.target.result);
        };

        reader.onerror = (e) => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsText(file);
    });
}

/**
 * Validate file type
 * @param {File} file - File object
 * @param {string[]} allowedTypes - Array of allowed MIME types or extensions
 * @returns {boolean} - Whether file is valid
 */
export function validateFileType(file, allowedTypes = []) {
    if (!file) return false;

    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    // Default allowed types for document conversion
    const defaultAllowed = [
        'text/plain',
        'text/markdown',
        'text/html',
        '.txt',
        '.md',
        '.markdown',
        '.html',
        '.htm'
    ];

    const types = allowedTypes.length > 0 ? allowedTypes : defaultAllowed;

    return types.some(type => {
        if (type.startsWith('.')) {
            return fileName.endsWith(type);
        }
        return fileType === type;
    });
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted size string
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Download content as a file
 * @param {string} content - File content
 * @param {string} filename - Name of the file
 * @param {string} mimeType - MIME type
 */
export function downloadFile(content, filename = 'converted.html', mimeType = 'text/html') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

/**
 * Get file extension from filename
 * @param {string} filename - File name
 * @returns {string} - File extension
 */
export function getFileExtension(filename) {
    if (!filename) return '';
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : '';
}

/**
 * Detect content type from file extension
 * @param {string} filename - File name
 * @returns {string} - Content type ('markdown', 'text', 'html')
 */
export function detectContentType(filename) {
    const ext = getFileExtension(filename);

    const markdownExts = ['md', 'markdown', 'mdown', 'mkd'];
    const htmlExts = ['html', 'htm'];

    if (markdownExts.includes(ext)) {
        return 'markdown';
    } else if (htmlExts.includes(ext)) {
        return 'html';
    } else {
        return 'text';
    }
}

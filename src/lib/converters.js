import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Configure marked options for better HTML output
 */
marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false,
});

/**
 * Convert Markdown to HTML
 * @param {string} markdown - The markdown content
 * @returns {string} - Sanitized HTML
 */
export function markdownToHtml(markdown) {
    if (!markdown || typeof markdown !== 'string') return '';

    try {
        const rawHtml = marked(markdown);
        return DOMPurify.sanitize(rawHtml);
    } catch (error) {
        console.error('Error converting markdown:', error);
        return '';
    }
}

/**
 * Convert plain text to formatted HTML
 * @param {string} text - Plain text content
 * @returns {string} - Formatted HTML
 */
export function textToHtml(text) {
    if (!text || typeof text !== 'string') return '';

    try {
        // Split into paragraphs (double line breaks)
        const paragraphs = text.split(/\n\n+/);

        const html = paragraphs
            .map(para => {
                // Don't wrap empty paragraphs
                if (!para.trim()) return '';

                // Replace single line breaks with <br>
                const formatted = para.replace(/\n/g, '<br>');
                return `<p>${formatted}</p>`;
            })
            .filter(Boolean)
            .join('\n');

        return DOMPurify.sanitize(html);
    } catch (error) {
        console.error('Error converting text:', error);
        return '';
    }
}

/**
 * Beautify HTML code for better readability
 * @param {string} html - Raw HTML string
 * @returns {string} - Formatted HTML
 */
export function beautifyHtml(html) {
    if (!html || typeof html !== 'string') return '';

    try {
        let formatted = html;
        let indent = 0;
        const indentStr = '  ';

        // Simple HTML beautifier
        formatted = formatted.replace(/>\s*</g, '>\n<');

        const lines = formatted.split('\n');
        const beautified = lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';

            // Decrease indent for closing tags
            if (trimmed.startsWith('</')) {
                indent = Math.max(0, indent - 1);
            }

            const indented = indentStr.repeat(indent) + trimmed;

            // Increase indent for opening tags (but not self-closing)
            if (trimmed.startsWith('<') &&
                !trimmed.startsWith('</') &&
                !trimmed.endsWith('/>') &&
                !trimmed.match(/<(br|hr|img|input|meta|link)/i)) {
                indent++;
            }

            return indented;
        });

        return beautified.filter(Boolean).join('\n');
    } catch (error) {
        console.error('Error beautifying HTML:', error);
        return html;
    }
}

/**
 * Sanitize HTML content
 * @param {string} html - Raw HTML
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHtml(html) {
    if (!html || typeof html !== 'string') return '';
    return DOMPurify.sanitize(html);
}

/**
 * Auto-detect content type and convert to HTML
 * @param {string} content - Input content
 * @param {string} type - Content type hint ('markdown', 'text', 'html')
 * @returns {string} - HTML output
 */
export function autoConvertToHtml(content, type = 'auto') {
    if (!content) return '';

    if (type === 'html') {
        return sanitizeHtml(content);
    }

    if (type === 'markdown') {
        return markdownToHtml(content);
    }

    if (type === 'text') {
        return textToHtml(content);
    }

    // Auto-detect
    const hasMarkdownSyntax = /[#*_\[\]`]/.test(content);
    const hasHtmlTags = /<[^>]+>/.test(content);

    if (hasHtmlTags) {
        return sanitizeHtml(content);
    } else if (hasMarkdownSyntax) {
        return markdownToHtml(content);
    } else {
        return textToHtml(content);
    }
}

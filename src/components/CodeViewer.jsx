import { useState, useEffect } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-markup';
import { copyToClipboard, downloadFile } from '@/lib/fileUtils';

export default function CodeViewer({ html, fileName = 'converted' }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Highlight code when HTML changes
        Prism.highlightAll();
    }, [html]);

    const handleCopy = async () => {
        const success = await copyToClipboard(html);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        const filename = fileName.replace(/\.[^/.]+$/, '') + '.html';
        downloadFile(html, filename, 'text/html');
    };

    if (!html) {
        return (
            <Card className="p-8 text-center text-muted-foreground">
                <p>HTML output will appear here...</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Action buttons */}
            <div className="flex gap-2 justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy Code
                        </>
                    )}
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download HTML
                </Button>
            </div>

            {/* Code display */}
            <Card className="overflow-hidden">
                <div className="bg-[#2d2d2d] p-6 overflow-x-auto max-h-[600px]">
                    <pre className="!m-0 !p-0 !bg-transparent">
                        <code className="language-markup text-sm">
                            {html}
                        </code>
                    </pre>
                </div>
            </Card>
        </div>
    );
}

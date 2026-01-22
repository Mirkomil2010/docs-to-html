import { Card } from '@/components/ui/card';

export default function PreviewPane({ html }) {
    if (!html) {
        return (
            <Card className="p-8 text-center text-muted-foreground h-full flex items-center justify-center">
                <p>Preview will appear here...</p>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden h-full">
            <div className="p-6 bg-background overflow-y-auto max-h-[600px]">
                {/* Render HTML safely using dangerouslySetInnerHTML */}
                {/* The HTML is already sanitized by DOMPurify in the converter */}
                <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </div>
        </Card>
    );
}

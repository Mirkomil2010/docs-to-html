import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { validateFileType, formatFileSize, readFileAsText, detectContentType } from '@/lib/fileUtils';

export default function FileUpload({ onFileLoad }) {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (!file) return;

        if (!validateFileType(file)) {
            alert('Please upload a valid file (.txt, .md, .html)');
            return;
        }

        setIsUploading(true);
        setUploadSuccess(false);

        try {
            const content = await readFileAsText(file);
            const contentType = detectContentType(file.name);

            setUploadedFile({
                name: file.name,
                size: file.size,
                type: contentType
            });

            // Trigger success animation
            setTimeout(() => {
                setUploadSuccess(true);
                setIsUploading(false);
            }, 500);

            // Call parent callback
            if (onFileLoad) {
                onFileLoad(content, contentType, file.name);
            }
        } catch (error) {
            console.error('Error reading file:', error);
            alert('Failed to read file. Please try again.');
            setIsUploading(false);
        }
    }, [onFileLoad]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/plain': ['.txt'],
            'text/markdown': ['.md', '.markdown'],
            'text/html': ['.html', '.htm']
        },
        maxFiles: 1,
        multiple: false
    });

    const clearFile = () => {
        setUploadedFile(null);
        setUploadSuccess(false);
        setIsUploading(false);
    };

    return (
        <div className="w-full">
            {!uploadedFile ? (
                <div
                    {...getRootProps()}
                    className={`
            relative overflow-hidden
            border-2 border-dashed rounded-2xl p-12
            transition-all duration-300 cursor-pointer
            hover:scale-[1.02] hover:shadow-xl
            ${isDragActive
                            ? 'border-primary bg-primary/5 scale-[1.02]'
                            : 'border-border bg-card/50'
                        }
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
                >
                    <input {...getInputProps()} />

                    {/* Animated background gradient */}
                    <div className={`
            absolute inset-0 opacity-0 transition-opacity duration-300
            bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10
            ${isDragActive ? 'opacity-100' : ''}
          `} />

                    <div className="relative flex flex-col items-center justify-center gap-4 text-center">
                        <div className={`
              p-6 rounded-full bg-primary/10 text-primary
              transition-transform duration-300
              ${isDragActive ? 'scale-110 animate-bounce' : ''}
            `}>
                            <Upload className="w-12 h-12" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold">
                                {isDragActive ? 'Drop your file here' : 'Upload a document'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Drag & drop or click to browse
                            </p>
                        </div>

                        <div className="flex gap-2 flex-wrap justify-center">
                            <Badge variant="outline">.txt</Badge>
                            <Badge variant="outline">.md</Badge>
                            <Badge variant="outline">.html</Badge>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border-2 border-primary rounded-2xl p-6 bg-card animate-fadeIn">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`
                p-3 rounded-lg bg-primary/10 text-primary
                ${uploadSuccess ? 'animate-pulse' : ''}
              `}>
                                {uploadSuccess ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                ) : (
                                    <File className="w-6 h-6" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold truncate">{uploadedFile.name}</h4>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    <Badge variant="secondary">{formatFileSize(uploadedFile.size)}</Badge>
                                    <Badge variant="outline">{uploadedFile.type}</Badge>
                                    {uploadSuccess && (
                                        <Badge variant="default" className="animate-fadeIn">
                                            ✓ Loaded
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={clearFile}
                            className="hover:bg-destructive/10 hover:text-destructive"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from 'react';
import { FileText, Sparkles, Code2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import FileUpload from '@/components/FileUpload';
import CodeViewer from '@/components/CodeViewer';
import PreviewPane from '@/components/PreviewPane';
import { autoConvertToHtml, beautifyHtml } from '@/lib/converters';

export default function HomePage() {
  const [inputContent, setInputContent] = useState('');
  const [contentType, setContentType] = useState('markdown');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [fileName, setFileName] = useState('document');

  // Convert content to HTML whenever input changes
  useEffect(() => {
    if (inputContent) {
      const converted = autoConvertToHtml(inputContent, contentType);
      const beautified = beautifyHtml(converted);
      setHtmlOutput(beautified);
    } else {
      setHtmlOutput('');
    }
  }, [inputContent, contentType]);

  const handleFileLoad = (content, type, name) => {
    setInputContent(content);
    setContentType(type);
    setFileName(name);
  };

  const handleClearAll = () => {
    setInputContent('');
    setHtmlOutput('');
    setFileName('document');
  };

  const exampleContent = {
    markdown: `# Welcome to Docs to HTML Converter

This is a **beautiful** and *powerful* document converter.

## Features

- Convert Markdown to HTML
- Convert Plain Text to HTML
- Live preview
- Syntax highlighting
- Download as HTML file

### Try it out!

Just start typing or upload a file to see the magic happen.`,
    text: `Welcome to Docs to HTML Converter

This is a simple text document.
It will be converted to properly formatted HTML.

You can have multiple paragraphs.

Each separated by blank lines.`,
    html: `<h1>HTML Content</h1>
<p>You can also paste HTML content directly.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>`
  };

  const loadExample = (type) => {
    setContentType(type);
    setInputContent(exampleContent[type]);
    setFileName(`example.${type === 'markdown' ? 'md' : type === 'html' ? 'html' : 'txt'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-animated opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4 animate-fadeIn">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl animate-float">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Docs to HTML
              </h1>
              <div className="p-3 bg-primary/10 rounded-2xl animate-float" style={{ animationDelay: '0.5s' }}>
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your documents into beautiful HTML with live preview and syntax highlighting
            </p>

            {/* Content Type Selector */}
            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                variant={contentType === 'markdown' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setContentType('markdown')}
              >
                Markdown
              </Button>
              <Button
                variant={contentType === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setContentType('text')}
              >
                Plain Text
              </Button>
              <Button
                variant={contentType === 'html' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setContentType('html')}
              >
                HTML
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="space-y-6">
          {/* File Upload */}
          <div className="animate-slideInLeft">
            <FileUpload onFileLoad={handleFileLoad} />
          </div>

          {/* Quick Examples */}
          {!inputContent && (
            <Card className="animate-fadeIn glass">
              <CardHeader>
                <CardTitle className="text-lg">Quick Start Examples</CardTitle>
                <CardDescription>Load an example to see how it works</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" onClick={() => loadExample('markdown')}>
                    📝 Markdown Example
                  </Button>
                  <Button variant="outline" onClick={() => loadExample('text')}>
                    📄 Text Example
                  </Button>
                  <Button variant="outline" onClick={() => loadExample('html')}>
                    🔖 HTML Example
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Editor and Output */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <Card className="animate-slideInLeft card-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code2 className="w-5 h-5" />
                      Input
                    </CardTitle>
                    <CardDescription>
                      Type or paste your content here
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{contentType}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={`Enter your ${contentType} content here...`}
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  className="min-h-[500px] font-mono text-sm resize-none"
                />
                {inputContent && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      className="w-full"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card className="animate-slideInRight card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Output
                </CardTitle>
                <CardDescription>
                  Live HTML preview and code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="code">HTML Code</TabsTrigger>
                  </TabsList>

                  <TabsContent value="preview" className="mt-4">
                    <PreviewPane html={htmlOutput} />
                  </TabsContent>

                  <TabsContent value="code" className="mt-4">
                    <CodeViewer html={htmlOutput} fileName={fileName} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          {!inputContent && (
            <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fadeIn">
              <Card className="card-hover text-center">
                <CardHeader>
                  <div className="mx-auto p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-fit">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    See your HTML rendering in real-time as you type
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover text-center">
                <CardHeader>
                  <div className="mx-auto p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-fit">
                    <Code2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Syntax Highlighting</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Beautiful code highlighting for better readability
                  </p>
                </CardContent>
              </Card>

              <Card className="card-hover text-center">
                <CardHeader>
                  <div className="mx-auto p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full w-fit">
                    <FileText className="w-6 h-6 text-pink-600" />
                  </div>
                  <CardTitle className="text-lg">Export Ready</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Download clean HTML files ready to use anywhere
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

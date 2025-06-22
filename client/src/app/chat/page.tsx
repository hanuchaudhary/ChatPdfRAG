"use client"

import React, { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BACKEND_URL } from "@/config"
import { toast } from "sonner"
import { Trash, Copy, Upload, ChevronDown, BookOpen } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { FileUpload } from "@/components/ui/file-upload"

interface DocReference {
  pageContent: string
  metadata: {
    source: string
    pdf?: {
      totalPages?: number
    }
    loc?: {
      pageNumber?: number
    }
  }
  id: string
}

interface Message {
  sender: "user" | "bot"
  text: string
  references?: DocReference[]
}

const MarkdownRenderer = ({ content }: { content: string }) => {
  const renderMarkdown = (text: string) => {
    // Split by lines to process each line
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let inList = false;
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (listItems.length > 0) {
        const ListComponent = listType === 'ol' ? 'ol' : 'ul';
        elements.push(
          <ListComponent key={elements.length} className={`mb-3 ml-4 ${listType === 'ol' ? 'list-decimal' : 'list-disc'} space-y-1`}>
            {listItems.map((item, idx) => (
              <li key={idx} className="text-sm leading-relaxed">
                {processInlineFormatting(item)}
              </li>
            ))}
          </ListComponent>
        );
        listItems = [];
        inList = false;
        listType = null;
      }
    };

    const processInlineFormatting = (text: string) => {
      // Process bold, italic, and code formatting
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
      return parts.map((part, idx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={idx} className="font-semibold">{part.slice(2, -2)}</strong>;
        } else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
          return <em key={idx} className="italic">{part.slice(1, -1)}</em>;
        } else if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={idx} className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{part.slice(1, -1)}</code>;
        }
        return part;
      });
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Handle headers
      if (trimmedLine.startsWith('###')) {
        flushList();
        elements.push(
          <h3 key={elements.length} className="text-base font-semibold mt-4 mb-2 text-foreground">
            {processInlineFormatting(trimmedLine.slice(3).trim())}
          </h3>
        );
      } else if (trimmedLine.startsWith('##')) {
        flushList();
        elements.push(
          <h2 key={elements.length} className="text-lg font-semibold mt-4 mb-2 text-foreground">
            {processInlineFormatting(trimmedLine.slice(2).trim())}
          </h2>
        );
      } else if (trimmedLine.startsWith('#')) {
        flushList();
        elements.push(
          <h1 key={elements.length} className="text-xl font-bold mt-4 mb-3 text-foreground">
            {processInlineFormatting(trimmedLine.slice(1).trim())}
          </h1>
        );
      }
      // Handle unordered lists
      else if (trimmedLine.match(/^[*+-]\s+/)) {
        if (!inList || listType !== 'ul') {
          flushList();
          inList = true;
          listType = 'ul';
        }
        listItems.push(trimmedLine.replace(/^[*+-]\s+/, ''));
      }
      // Handle ordered lists
      else if (trimmedLine.match(/^\d+\.\s+/)) {
        if (!inList || listType !== 'ol') {
          flushList();
          inList = true;
          listType = 'ol';
        }
        listItems.push(trimmedLine.replace(/^\d+\.\s+/, ''));
      }
      // Handle empty lines
      else if (trimmedLine === '') {
        flushList();
        if (elements.length > 0) {
          elements.push(<div key={elements.length} className="h-2" />);
        }
      }
      // Handle regular paragraphs
      else if (trimmedLine.length > 0) {
        flushList();
        elements.push(
          <p key={elements.length} className="text-sm leading-relaxed mb-2">
            {processInlineFormatting(trimmedLine)}
          </p>
        );
      }
    });

    // Flush any remaining list items
    flushList();

    return elements;
  };

  return <div className="space-y-1">{renderMarkdown(content)}</div>;
};

export default function ChatToPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleFileUpload = async () => {
    if (!pdfFile) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append("file", pdfFile)

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      toast.success("File uploaded successfully!")
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "PDF uploaded successfully. You can now ask questions about it.",
        },
      ])
    } catch (error) {
      toast.error("Error uploading file.")
      console.error("Error uploading file:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemovePdf = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
    }
    setPdfFile(null)
    setPdfUrl(null)
    // Clear messages when PDF is removed
    setMessages([])
    toast.info("PDF removed")
  }

  const handleSend = async () => {
    if (!input.trim() || !pdfFile) return

    const userMessage = input.trim()
    setMessages((msgs) => [...msgs, { sender: "user", text: userMessage }])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const data = await response.json()
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: data.response,
          references: data.docs,
        },
      ])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "Sorry, I encountered an error processing your request.",
        },
      ])
      toast.error("Error getting response")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Copied to clipboard"))
      .catch(() => toast.error("Failed to copy"))
  }

  const getFileName = (source: string) => {
    if (!source) return "Unknown source"
    const parts = source.split("\\")
    return parts[parts.length - 1]
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-3 md:flex-row md:h-[93vh] h-screen overflow-hidden bg-background">
      <div className="w-full md:w-[40%] flex flex-col items-center justify-center p-4">
        {!pdfFile ? (
          <div className="">
            <FileUpload
              onChange={(files: File[]) => {
                const file = files[0]
                if (file && file.type === "application/pdf") {
                  setPdfFile(file)
                  setPdfUrl(URL.createObjectURL(file))
                } else {
                  toast.error("Please upload a PDF file")
                }
              }}
            />
          </div>
        ) : (
          <div className="w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium truncate max-w-[80%]" title={pdfFile.name}>
                {pdfFile.name}
              </span>
              <Button variant="destructive" size="icon" onClick={handleRemovePdf} title="Remove PDF">
                <Trash className="h-4 w-4" />
              </Button>
            </div>

            {pdfUrl && (
              <div className="relative md:block hidden">
                <iframe src={pdfUrl} title="PDF Preview" className="w-full h-[60vh] rounded border" />
              </div>
            )}

            <Button className="mt-4 w-full" onClick={handleFileUpload} disabled={!pdfFile || isLoading}>
              {isLoading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Upload PDF
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="relative w-full h-full border-l border-border flex flex-col">
        <div ref={chatContainerRef} className="overflow-y-auto md:h-[80%] h-96 p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-muted-foreground text-center mt-20">
              {pdfFile ? "Upload your PDF and start chatting!" : "Upload a PDF to start chatting!"}
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className="relative group">
                  <Card
                    className={`max-w-xs md:text-base text-sm md:max-w-2xl px-4 py-3 ${
                      msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {msg.sender === "bot" ? (
                      <MarkdownRenderer content={msg.text} />
                    ) : (
                      <div className="text-sm">{msg.text}</div>
                    )}
                  </Card>

                  {msg.sender === "bot" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(msg.text)}
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {msg.sender === "bot" && msg.references && msg.references.length > 0 && (
                  <Collapsible className="w-full max-w-xs md:max-w-2xl mt-1">
                    <div className="flex items-center">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-0 h-auto">
                          <BookOpen className="h-3 w-3 mr-1" />
                          <span className="text-xs">References</span>
                          <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
                        </Button>
                      </CollapsibleTrigger>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {msg.references.length} {msg.references.length === 1 ? "source" : "sources"}
                      </Badge>
                    </div>

                    <CollapsibleContent className="mt-2 space-y-2">
                      {msg.references.map((ref, refIdx) => (
                        <Card key={refIdx} className="p-3 text-xs bg-muted/50">
                          <div className="flex justify-between items-start mb-2">
                            <Badge variant="secondary" className="text-[10px]">
                              Page {ref.metadata.loc?.pageNumber || "Unknown"}
                              {ref.metadata.pdf?.totalPages ? ` of ${ref.metadata.pdf.totalPages}` : ""}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {getFileName(ref.metadata.source)}
                            </span>
                          </div>
                          <div className="text-xs line-clamp-4 hover:line-clamp-none transition-all">
                            {ref.pageContent}
                          </div>
                        </Card>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
            ))
          )}

          {isLoading && messages.length > 0 && (
            <div className="flex justify-start">
              <Card className="max-w-xs px-4 py-2 bg-muted">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce delay-75"></div>
                  <div className="h-2 w-2 bg-foreground/50 rounded-full animate-bounce delay-150"></div>
                </div>
              </Card>
            </div>
          )}
        </div>

        <form
          className="p-4 absolute w-full bottom-2"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <div className=" bg-secondary rounded-3xl p-2 border">
            <div className="flex flex-col items-end dark:bg-input/30 bg-transparent rounded-2xl">
              <Input
                className="rounded-2xl md:min-h-16 resize-none"
                placeholder={pdfFile ? "Type your question..." : "Upload a PDF first"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <Button
                variant={"outline"}
                className="m-3"
                type="submit"
                disabled={!input.trim() || !pdfFile || isLoading}
              >
                Send
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
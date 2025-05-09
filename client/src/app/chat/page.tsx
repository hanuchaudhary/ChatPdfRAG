"use client"

import React, { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BACKEND_URL } from "@/config"
import { toast } from "sonner"
import { Trash, Copy, Send, Upload, FileText, ChevronDown, BookOpen } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

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

// Enhanced message type to include references
interface Message {
  sender: "user" | "bot"
  text: string
  references?: DocReference[]
}

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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
      setPdfUrl(URL.createObjectURL(file))
    } else {
      toast.error("Please upload a PDF file")
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
      setPdfUrl(URL.createObjectURL(file))
    }
  }

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
        { sender: "bot", text: "PDF uploaded successfully. You can now ask questions about it." },
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

      // Store both the response text and the reference documents
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
        { sender: "bot", text: "Sorry, I encountered an error processing your request." },
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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center">

        {!pdfFile ? (
          <div
            className="w-full max-w-md border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-8 cursor-pointer hover:border-primary transition"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById("pdf-upload-input")?.click()}
          >
            <input
              id="pdf-upload-input"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <div className="text-muted-foreground text-center">
              <div className="mb-2">Drag & drop your PDF here, or click to browse</div>
              <div className="text-xs">(PDF only)</div>
            </div>
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
              <div className="relative">
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

      {/* Chat Section */}
      <div className="w-full md:w-1/2 border-l border-border flex flex-col">
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-muted-foreground text-center mt-20">
              {pdfFile ? "Upload your PDF and start chatting!" : "Upload a PDF to start chatting!"}
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div className="relative group">
                  <Card
                    className={`max-w-xs md:max-w-md px-4 py-2 ${
                      msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {msg.text}
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

                {/* References section for bot messages */}
                {msg.sender === "bot" && msg.references && msg.references.length > 0 && (
                  <Collapsible className="w-full max-w-xs md:max-w-md mt-1">
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
          className="flex gap-2 p-4 border-t border-border"
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
        >
          <Input
            className="flex-1"
            placeholder={pdfFile ? "Type your question..." : "Upload a PDF first"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!pdfFile || isLoading}
          />
          <Button type="submit" disabled={!input.trim() || !pdfFile || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  ChevronRight,
  FileText,
  MessageSquare,
  Upload,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

const ChatToPdfLandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1">
        <section className="w-full pt-24">
          <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]"></div>
          <div className="mx-auto max-w-7xl px-6">
            <div className="sm:mx-auto lg:mr-auto">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                  hidden: {},
                }}
              >
                <motion.h1
                  variants={transitionVariants.item}
                  className="mt-8 max-w-3xl text-balance text-5xl font-medium md:text-6xl lg:mt-16"
                >
                  Transform Your PDFs into Interactive Conversations
                </motion.h1>
                <motion.p
                  variants={transitionVariants.item}
                  className="mt-8 max-w-2xl text-pretty text-lg text-muted-foreground"
                >
                  Chat with your PDF documents using advanced AI. Ask questions,
                  extract insights, and get instant answers from your files with
                  our powerful RAG-based application.
                </motion.p>
                <motion.div
                  variants={transitionVariants.item}
                  className="mt-12 flex items-center gap-2"
                >
                  <div className="bg-foreground/10 rounded-[14px] border p-0.5">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-xl px-5 text-base"
                    >
                      <Link href="/chat">
                        <span className="text-nowrap">Get Started</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="h-[42px] rounded-xl px-5 text-base"
                  >
                    <Link href="#how-it-works">
                      <span className="text-nowrap">How It Works</span>
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.75,
                },
              },
              hidden: {},
            }}
          >
            <motion.div
              variants={transitionVariants.item}
              className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20"
            >
              <div
                aria-hidden
                className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
              />
              <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-5xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                <div className="bg-background aspect-15/8 relative rounded-2xl border border-border/25 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-10"></div>
                  <div className="flex h-full">
                    <div className="w-1/2 border-r border-border/25 p-6 flex flex-col">
                      <div className="flex items-center mb-4">
                        <Upload className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Upload Your PDF</h3>
                      </div>
                      <div className="flex-1 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center">
                        <div className="text-center p-6">
                          <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drag & drop your PDF here or click to browse
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2 p-6 flex flex-col">
                      <div className="flex items-center mb-4">
                        <MessageSquare className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Chat with Your Document</h3>
                      </div>
                      <div className="flex-1 bg-muted/50 rounded-lg p-4 flex flex-col">
                        <div className="flex-1 space-y-3">
                          <div className="bg-primary/10 text-primary rounded-lg p-3 text-sm max-w-[80%]">
                            What are the key findings in this report?
                          </div>
                          <div className="bg-muted rounded-lg p-3 text-sm max-w-[80%] ml-auto">
                            The report highlights three main findings: 1) 37%
                            increase in user engagement, 2) Cost reduction of
                            24% year-over-year, and 3) New market opportunities
                            in Asia-Pacific region.
                          </div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 bg-background rounded-full border px-4 py-2 text-sm flex items-center">
                            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Ask a question...
                            </span>
                          </div>
                          <Button size="icon" className="rounded-full">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Trusted By Section */}
        <section className="bg-background pb-16 pt-16 md:pb-24">
          <div className="group relative m-auto max-w-7xl px-6">
            <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
              <Link
                href="/"
                className="block text-sm duration-150 hover:opacity-75"
              >
                <span>Trusted by innovative companies</span>
                <ChevronRight className="ml-1 inline-block size-3" />
              </Link>
            </div>
            <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:grid-cols-3 md:grid-cols-6 sm:gap-x-16 sm:gap-y-14">
              {[...Array(6)].map((_, i) => (
                <div className="flex" key={i}>
                  <div className="mx-auto h-8 w-fit bg-muted rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/30"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need for PDF Intelligence
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our platform combines powerful AI with intuitive design to
                  make your documents work for you.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Upload className="h-10 w-10 text-primary" />,
                  title: "Easy PDF Upload",
                  description:
                    "Drag and drop your PDFs or select from cloud storage. Support for documents of any size and complexity.",
                },
                {
                  icon: <MessageSquare className="h-10 w-10 text-primary" />,
                  title: "Natural Conversations",
                  description:
                    "Chat with your documents using natural language. Ask questions and get accurate answers instantly.",
                },
                {
                  icon: <Search className="h-10 w-10 text-primary" />,
                  title: "Smart Search",
                  description:
                    "Find exactly what you need with context-aware search that understands the meaning behind your queries.",
                },
                {
                  icon: <Sparkles className="h-10 w-10 text-primary" />,
                  title: "AI-Powered Insights",
                  description:
                    "Extract key information, summarize content, and discover patterns with advanced AI analysis.",
                },
                {
                  icon: <FileText className="h-10 w-10 text-primary" />,
                  title: "Multi-Document Support",
                  description:
                    "Compare and analyze multiple PDFs simultaneously. Connect information across documents.",
                },
                {
                  icon: <ArrowRight className="h-10 w-10 text-primary" />,
                  title: "Export & Share",
                  description:
                    "Save conversations, export insights, and share findings with your team or clients.",
                },
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden rounded-xl border p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all duration-300"></div>
                  <div className="relative space-y-2">
                    <div className="mb-2">{feature.icon}</div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
                  Process
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  How ChatPDF Works
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                  Our advanced RAG (Retrieval-Augmented Generation) technology
                  makes interacting with PDFs simple and powerful.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid gap-12 md:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Upload Your PDF",
                    description:
                      "Simply drag and drop your PDF document into our platform. We'll process and index it for intelligent retrieval.",
                  },
                  {
                    step: "02",
                    title: "Ask Questions",
                    description:
                      "Type your questions in natural language. Our AI understands context and finds the most relevant information.",
                  },
                  {
                    step: "03",
                    title: "Get Instant Answers",
                    description:
                      "Receive accurate, contextual responses drawn directly from your document with citations to the source.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center text-center"
                  >
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                      <span className="text-xl font-bold">{item.step}</span>
                    </div>
                    {index < 2 && (
                      <div className="absolute hidden md:block top-8 left-[calc(100%-16px)] w-[calc(100%-32px)] h-[2px] bg-border">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary"></div>
                      </div>
                    )}
                    <h3 className="text-xl font-bold mt-2">{item.title}</h3>
                    <p className="text-muted-foreground mt-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-16 flex justify-center">
                <Button size="lg" className="rounded-xl group">
                  Try It Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your PDF Experience?
                </h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
                  Join thousands of professionals who are saving time and
                  gaining deeper insights from their documents.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="rounded-xl">
                  Get Started for Free
                </Button>
                <Button size="lg" variant="outline" className="rounded-xl">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-muted/10">
        <div className="container flex flex-col gap-6 py-8 md:py-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">ChatPDF</span>
            </div>
            <div className="flex gap-4">
              {["Twitter", "GitHub", "LinkedIn"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              {
                title: "Product",
                items: ["Features", "Pricing", "Integrations", "Changelog"],
              },
              {
                title: "Resources",
                items: ["Documentation", "Guides", "API", "Examples"],
              },
              {
                title: "Company",
                items: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Legal",
                items: ["Privacy", "Terms", "Security", "Cookies"],
              },
            ].map((group) => (
              <div key={group.title} className="space-y-3">
                <h3 className="font-medium">{group.title}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ChatPDF. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Made with ❤️ for document intelligence
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatToPdfLandingPage;

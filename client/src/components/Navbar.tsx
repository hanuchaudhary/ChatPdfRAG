"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import { ThemeSwitcher } from "./theme-toggle";
import { FileText } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex w-full items-center justify-between flex-row md:px-10 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
          <FileText className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-bold md:block hidden">ChatPDF</span>
      </div>
      <div className="flex items-center gap-1">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Button asChild variant="outline" size="sm">
            <SignInButton />
          </Button>
          <Button asChild size="sm">
            <SignUpButton />
          </Button>
        </SignedOut>
        <ThemeSwitcher />
      </div>
    </div>
  );
}

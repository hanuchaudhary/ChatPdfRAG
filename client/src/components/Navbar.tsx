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
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isChatPage = pathname === "/chat";
  return (
    <div className="fixed top-0 left-0 flex z-[8000] w-full items-center justify-between px-10 py-7">
      <div>
        <span className="font-semibold text-2xl">ChatPDF</span>
      </div>
      {!isChatPage && (
        <div className="flex gap-6">
          {[
            {
              name: "Home",
              href: "/",
            },
            {
              name: "Chat",
              href: "/chat",
            },
            {
              name: "Docs",
              href: "/docs",
            },
            {
              name: "Pricing",
              href: "/pricing",
            },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="font-semibold uppercase text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors duration-200 ease-in-out rounded-md px-3 py-2"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
      <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
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

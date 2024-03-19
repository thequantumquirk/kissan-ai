"use client";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { UserIdContext } from "@/components/userid-provider";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState("");
  return (
    <html lang="en" className="lg:overflow-hidden">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className={plusJakarta.className}>
        <UserIdContext.Provider value={{ userId, setUserId }}>
          <TooltipProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              {children}
            </ThemeProvider>
          </TooltipProvider>
        </UserIdContext.Provider>
      </body>
    </html>
  );
}

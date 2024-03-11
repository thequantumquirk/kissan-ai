import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agritalk AI",
  description: "Simple solution for Tamilnadu Farmers",
};

export default function RootLayout({
  children,
}: {       
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="lg:overflow-hidden">
      <head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </head>
      <body className={plusJakarta.className}>
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
      </body>
    </html>
  );
}

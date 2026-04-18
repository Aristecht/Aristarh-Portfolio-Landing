import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../styles/globals.css";
import { TanstackQueryProvider } from "@/providers/TanstackQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { Navbar } from "@/components/elements/Navbar";
import { cn } from "@/utils/tw-merge";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Portfolio - Aristecht",
  description: "A platform for showcasing your portfolio, projects and albums.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      className={cn("font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <TanstackQueryProvider>
          <ThemeProvider>
            <ToastProvider />
            <Navbar />
            {children}
          </ThemeProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}

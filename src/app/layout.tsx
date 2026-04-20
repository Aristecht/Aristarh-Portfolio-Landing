import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "../styles/globals.css";
import { TanstackQueryProvider } from "@/providers/TanstackQueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { Navbar } from "@/components/elements/Navbar";
import { cn } from "@/utils/tw-merge";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "Aristarh Studio";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aristarh Studio | Разработка сайтов под ключ",
    template: "%s | Aristarh Studio",
  },
  description:
    "Aristarh Studio разрабатывает современные сайты под ключ: лендинги, корпоративные сайты и индивидуальные веб-решения с фокусом на заявки и продажи.",
  keywords: [
    "разработка сайтов",
    "создание сайтов",
    "веб-студия",
    "лендинг под ключ",
    "корпоративный сайт",
    "Aristarh Studio",
    "веб разработка",
    "сайт для бизнеса",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: "Aristarh Studio | Разработка сайтов под ключ",
    description:
      "Современные сайты для бизнеса: продуманная структура, быстрая загрузка и акцент на конверсию.",
    locale: "ru_RU",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Логотип Aristarh Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aristarh Studio | Разработка сайтов под ключ",
    description:
      "Запускаем сайты, которые выглядят уверенно и приводят клиентов.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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

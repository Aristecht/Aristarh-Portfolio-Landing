import type { Metadata } from "next";
import { WorksPageClient } from "./WorksPageClient";

export const metadata: Metadata = {
  title: "Портфолио и выполненные работы",
  description:
    "Портфолио Aristarh Studio: лендинги, корпоративные сайты и веб-проекты, которые уже работают и приносят результат бизнесу.",
  alternates: {
    canonical: "/works",
  },
  openGraph: {
    title: "Портфолио и выполненные работы | Aristarh Studio",
    description:
      "Изучите кейсы и примеры сайтов, разработанных Aristarh Studio для реальных задач бизнеса.",
    url: "/works",
  },
  twitter: {
    title: "Портфолио и выполненные работы | Aristarh Studio",
    description:
      "Кейсы, примеры сайтов и реальные веб-проекты из портфолио Aristarh Studio.",
  },
};

export default function WorksPage() {
  return <WorksPageClient />;
}

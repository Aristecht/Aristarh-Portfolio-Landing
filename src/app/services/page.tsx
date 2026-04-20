import type { Metadata } from "next";
import { ServicesPageClient } from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Услуги и цены на разработку сайтов",
  description:
    "Услуги Aristarh Studio: лендинги, корпоративные сайты и индивидуальная веб-разработка с прозрачными сроками, стоимостью и результатом.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Услуги и цены на разработку сайтов | Aristarh Studio",
    description:
      "Изучите пакеты услуг, сроки разработки и стоимость запуска сайта под задачи бизнеса.",
    url: "/services",
  },
  twitter: {
    title: "Услуги и цены на разработку сайтов | Aristarh Studio",
    description:
      "Пакеты услуг по разработке сайтов с понятной стоимостью, сроками и наполнением.",
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}

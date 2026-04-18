"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectsApi, pricesApi } from "@/libs/api";
import { ProjectStatus } from "@/types/api.types";
import { HomeContactsSection } from "@/components/features/home/HomeContactsSection";
import { HomeFinalCta } from "@/components/features/home/HomeFinalCta";
import { HomeHero } from "@/components/features/home/HomeHero";
import { HomeProjectsSection } from "@/components/features/home/HomeProjectsSection";
import { HomeServicesSection } from "@/components/features/home/HomeServicesSection";
import { HomeWorkflowSection } from "@/components/features/home/HomeWorkflowSection";
import { formatPrice } from "@/components/features/home/home-content";

export default function Home() {
  const whatsAppLink = process.env.NEXT_PUBLIC_WHATSAPP_URL;
  const instagramLink = process.env.NEXT_PUBLIC_INSTAGRAM_URL;

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", "home-page"],
    queryFn: () => projectsApi.findAll(),
  });

  const { data: prices, isLoading: pricesLoading } = useQuery({
    queryKey: ["prices", "home-page"],
    queryFn: () => pricesApi.findAll(),
  });

  const projectList = useMemo(() => projects ?? [], [projects]);
  const priceList = useMemo(() => prices ?? [], [prices]);

  const featuredProjects = useMemo(
    () => projectList.slice(0, 3),
    [projectList]
  );
  const featuredPrices = useMemo(() => priceList.slice(0, 3), [priceList]);

  const metrics = useMemo(() => {
    const completedProjects = projectList.filter(
      (project) => project.status === ProjectStatus.DONE
    ).length;
    const minPrice = priceList.length
      ? Math.min(...priceList.map((price) => price.priceFrom))
      : 0;

    return [
      {
        label: "Проектов в портфолио",
        value: projectList.length,
      },
      {
        label: "Завершенных запусков",
        value: completedProjects,
      },
      {
        label: "Старт пакета от",
        value: minPrice ? `${formatPrice(minPrice)} ₸` : "по запросу",
      },
    ];
  }, [priceList, projectList]);

  const popularPrice = useMemo(
    () => priceList.find((price) => price.isPopular) ?? priceList[0],
    [priceList]
  );

  return (
    <main className="bg-background relative min-h-screen overflow-x-clip pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/12 absolute top-0 left-1/2 h-112 w-md -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-accent/10 absolute top-40 -left-24 h-80 w-80 rounded-full blur-3xl" />
        <div className="bg-primary/12 absolute right-0 bottom-16 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <HomeHero metrics={metrics} popularPrice={popularPrice} />
      <HomeServicesSection
        pricesLoading={pricesLoading}
        featuredPrices={featuredPrices}
      />
      <HomeWorkflowSection />
      <HomeProjectsSection
        projectsLoading={projectsLoading}
        featuredProjects={featuredProjects}
      />
      <HomeContactsSection
        whatsAppLink={whatsAppLink}
        instagramLink={instagramLink}
      />
      <HomeFinalCta />
    </main>
  );
}

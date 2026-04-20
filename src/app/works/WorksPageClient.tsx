"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Sparkles,
  Clock3,
  FolderKanban,
  Check,
} from "lucide-react";
import { projectsApi } from "@/libs/api";
import { ProjectStatus, type Project } from "@/types/api.types";
import { Button } from "@/components/common/Button";
import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/utils/tw-merge";
import { Separator } from "@/components/common/Seperator";

const filters: Array<{ value: "ALL" | ProjectStatus; label: string }> = [
  { value: "ALL", label: "Все" },
  { value: ProjectStatus.DRAFT, label: "Черновики" },
  { value: ProjectStatus.IN_PROGRESS, label: "В работе" },
  { value: ProjectStatus.DONE, label: "Завершенные" },
];

function getStatusMeta(status: ProjectStatus) {
  if (status === "DONE") {
    return {
      label: "Завершен",
      tone: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
      icon: Check,
    };
  }

  if (status === "IN_PROGRESS") {
    return {
      label: "В работе",
      tone: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
      icon: Clock3,
    };
  }

  return {
    label: "Черновик",
    tone: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
    icon: FolderKanban,
  };
}

function getImageSrc(imageUrl?: string) {
  if (!imageUrl) return "";
  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  try {
    const parsedApiUrl = new URL(rawApiUrl);
    const apiOrigin = parsedApiUrl.origin;
    const apiPath = parsedApiUrl.pathname.replace(/\/+$/, "");
    const normalizedApiPath = apiPath.replace(/^\/+/, "");
    const normalizedImagePath = imageUrl.replace(/^\/+/, "");

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      const absoluteImageUrl = new URL(imageUrl);
      const isLocalhostImage =
        absoluteImageUrl.hostname === "localhost" ||
        absoluteImageUrl.hostname === "127.0.0.1";

      if (!isLocalhostImage) {
        return imageUrl;
      }

      const normalizedAbsolutePath = absoluteImageUrl.pathname
        .replace(/^\/+/, "")
        .replace(/^api\//, "");

      if (apiPath && normalizedAbsolutePath.startsWith("uploads/")) {
        return `${apiOrigin}${apiPath}/${normalizedAbsolutePath}`;
      }

      return `${apiOrigin}/${normalizedAbsolutePath}`;
    }

    if (normalizedImagePath.startsWith("uploads/")) {
      return apiPath
        ? `${apiOrigin}${apiPath}/${normalizedImagePath}`
        : `${apiOrigin}/${normalizedImagePath}`;
    }

    if (
      normalizedApiPath &&
      normalizedImagePath.startsWith(`${normalizedApiPath}/uploads/`)
    ) {
      return `${apiOrigin}/${normalizedImagePath}`;
    }

    if (apiPath && apiPath !== "/") {
      if (normalizedImagePath.startsWith(`${normalizedApiPath}/`)) {
        return `${apiOrigin}/${normalizedImagePath}`;
      }

      return `${apiOrigin}${apiPath}/${normalizedImagePath}`;
    }

    return `${apiOrigin}/${normalizedImagePath}`;
  } catch {
    return imageUrl;
  }
}

export function WorksPageClient() {
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | ProjectStatus>(
    "ALL"
  );

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", "works-page"],
    queryFn: () => projectsApi.findAll(),
  });

  const getProjectTimeline = (project: Project) => {
    const startDate = new Date(project.createdAt);

    if (project.status === "DONE") {
      const endDate = new Date(project.updatedAt);
      const diffMs = endDate.getTime() - startDate.getTime();
      const days = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      return `Срок выполнения: ${days} дн.`;
    }

    if (project.status === "IN_PROGRESS") {
      return `Старт: ${startDate.toLocaleDateString("ru-RU")}`;
    }

    return `Создан: ${startDate.toLocaleDateString("ru-RU")}`;
  };

  const filteredProjects = useMemo(() => {
    const list = projects ?? [];
    if (selectedFilter === "ALL") {
      return list;
    }
    return list.filter((project) => project.status === selectedFilter);
  }, [projects, selectedFilter]);

  return (
    <main className="bg-background relative min-h-screen overflow-x-clip pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/10 absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-accent/10 absolute top-1/3 -left-24 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute right-0 bottom-0 h-72 w-72 rounded-full blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="glass-lg relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="from-primary/15 to-accent/10 absolute inset-0 bg-linear-to-br via-transparent" />
          <div className="relative z-10">
            <div className="border-primary/30 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide sm:text-sm">
              <Sparkles className="h-4 w-4" />
              Наши проекты
            </div>
            <h1 className="max-w-3xl text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              Портфолио решений, которые уже работают в реальном мире
            </h1>
            <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
              От лендингов и ecommerce до внутренних систем и автоматизации.
              Здесь собраны проекты, где важны не только визуал, но и результат.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="border-border bg-card rounded-full border px-4 py-2 text-sm">
                Всего проектов:{" "}
                <span className="text-primary font-semibold">
                  {projects?.length ?? 0}
                </span>
              </div>
              <div className="border-border bg-card rounded-full border px-4 py-2 text-sm">
                Показано:{" "}
                <span className="text-primary font-semibold">
                  {filteredProjects.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setSelectedFilter(filter.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                selectedFilter === filter.value
                  ? "border-primary bg-primary/15 text-primary shadow-soft"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="border-border/60 h-105 rounded-3xl border"
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass mx-auto max-w-xl rounded-3xl p-8 text-center sm:p-10">
            <h2 className="text-xl font-semibold sm:text-2xl">Пока пусто</h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              По выбранному фильтру проектов еще нет. Попробуйте переключить
              статус.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project: Project) => {
              const status = getStatusMeta(project.status);
              const StatusIcon = status.icon;

              return (
                <article
                  key={project.id}
                  className="group border-border/70 bg-card/85 hover:shadow-primary/20 hover:border-primary/35 shadow-soft flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="relative h-60 w-full overflow-hidden sm:h-64">
                    {project.imageUrl ? (
                      <Image
                        src={getImageSrc(project.imageUrl)}
                        alt={project.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="from-primary/15 via-muted to-accent/15 h-full w-full bg-linear-to-br" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="line-clamp-2 text-lg leading-snug font-medium">
                        {project.title}
                      </h2>
                      <div className="">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md",
                            status.tone
                          )}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <div className="text-muted-foreground my-4 text-xs font-bold">
                      {getProjectTimeline(project)}
                    </div>
                    <Separator />
                    <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-relaxed">
                      {project.description ||
                        "Описание проекта пока не добавлено."}
                    </p>

                    {project.tags && project.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.slice(0, 4).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-primary/10 text-primary rounded-full px-2.5 py-1 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-1 text-xs">
                            +{project.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-5">
                      {project.siteUrl ? (
                        <Button asChild className="w-full">
                          <Link
                            href={project.siteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Открыть проект
                          </Link>
                        </Button>
                      ) : (
                        <Button disabled className="w-full">
                          Ссылка недоступна
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

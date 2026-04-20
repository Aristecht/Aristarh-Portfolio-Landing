import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, FolderKanban } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Skeleton } from "@/components/common/Skeleton";
import type { Project } from "@/types/api.types";
import { cn } from "@/utils/tw-merge";
import { getImageSrc, getStatusMeta } from "./home-content";

interface HomeProjectsSectionProps {
  projectsLoading: boolean;
  featuredProjects: Project[];
}

export function HomeProjectsSection({
  projectsLoading,
  featuredProjects,
}: HomeProjectsSectionProps) {
  return (
    <section className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            Кейсы
          </div>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
            Проекты, которые уже выглядят и работают как нужно
          </h2>
        </div>
        <Button variant="ghost" asChild className="hidden sm:inline-flex">
          <Link href="/works">
            Все работы
            <ArrowRight className="ml-1" />
          </Link>
        </Button>
      </div>

      {projectsLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="border-border/60 h-112 rounded-[1.75rem] border"
            />
          ))}
        </div>
      ) : featuredProjects.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredProjects.map((project) => {
            const status = getStatusMeta(project.status);

            return (
              <article
                key={project.id}
                className="group border-border/70 bg-card/85 shadow-soft hover:border-primary/35 hover:shadow-primary/20 flex h-full flex-col overflow-hidden rounded-[1.75rem] border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative h-60 overflow-hidden sm:h-64">
                  {project.imageUrl ? (
                    <Image
                      src={getImageSrc(project.imageUrl)}
                      alt={project.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="from-primary/15 via-muted to-accent/15 h-full w-full bg-linear-to-br" />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md",
                        status.tone
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl leading-tight font-semibold">
                      {project.title}
                    </h3>
                    <span className="bg-muted text-muted-foreground inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                      <FolderKanban className="h-5 w-5" />
                    </span>
                  </div>

                  <p className="text-muted-foreground mt-4 line-clamp-3 text-sm leading-relaxed">
                    {project.description ||
                      "Описание проекта пока не опубликовано, но кейс уже готов к показу."}
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
                    </div>
                  )}

                  <div className="mt-auto pt-6">
                    {project.siteUrl ? (
                      <Button asChild className="w-full">
                        <Link href={project.siteUrl} target="_blank">
                          Открыть проект
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/works">Смотреть кейс</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="glass rounded-[1.75rem] p-8 text-center sm:p-10">
          <h3 className="text-xl font-semibold sm:text-2xl">
            Кейсы скоро появятся
          </h3>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Главная секция под проекты готова, осталось только наполнить ее
            данными.
          </p>
        </div>
      )}
    </section>
  );
}

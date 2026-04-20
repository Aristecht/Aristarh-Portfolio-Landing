import Link from "next/link";
import { ArrowRight, Clock3, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Separator } from "@/components/common/Seperator";
import type { Price } from "@/types/api.types";
import { advantages, formatPrice } from "./home-content";

interface HomeHeroProps {
  metrics: Array<{ label: string; value: string | number }>;
  popularPrice?: Price;
}

export function HomeHero({ metrics, popularPrice }: HomeHeroProps) {
  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-12 lg:px-8">
      <div className="glass-lg relative overflow-hidden rounded-[2rem] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="from-primary/15 to-accent/10 absolute inset-0 bg-linear-to-br via-transparent" />
        <div className="relative z-10 grid items-end gap-8 lg:grid-cols-[1.2fr_0.85fr]">
          <div className="min-w-0">
            <div className="border-primary/30 bg-primary/10 text-primary mb-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase sm:text-sm sm:tracking-[0.18em]">
              <Sparkles className="h-4 w-4" />
              Веб-разработка для роста бизнеса
            </div>

            <h1 className="max-w-4xl text-3xl leading-[0.95] font-bold tracking-tight text-balance sm:text-5xl lg:text-7xl">
              Делаю сайты любой сложности,
              <span className="gradient-text block pt-2">
                на совесть, грамотно и по честной цене
              </span>
            </h1>

            <p className="text-muted-foreground mt-5 max-w-2xl text-sm leading-relaxed sm:text-base lg:text-lg">
              Запускаю сильные сайты дешевле многих конкурентов, без потери
              качества: продуманная структура, чистый код, быстрая загрузка и
              понятный путь к заявкам и продажам.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                variant="cyan"
                size="lg"
                asChild
                className="w-full max-w-full min-w-0 whitespace-normal sm:w-auto"
              >
                <Link href="/services">
                  Смотреть услуги
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full max-w-full min-w-0 whitespace-normal sm:w-auto"
              >
                <Link href="/works">Изучить кейсы</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="border-border/60 bg-card/80 min-w-0 rounded-2xl border px-4 py-4 backdrop-blur-md"
                >
                  <div className="text-foreground text-2xl font-semibold sm:text-3xl">
                    {metric.value}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 space-y-4">
            <div className="glass rounded-[1.75rem] p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-muted-foreground text-xs font-medium tracking-[0.14em] uppercase">
                  Мой подход
                </span>
                <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  High-conversion
                </span>
              </div>

              <div className="space-y-3">
                {advantages.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="border-border/50 bg-background/55 min-w-0 rounded-2xl border p-4"
                    >
                      <div className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <h2 className="text-base font-semibold sm:text-lg">
                            {item.title}
                          </h2>
                          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass rounded-[1.75rem] p-5 sm:p-6">
              <div className="text-muted-foreground mb-2 text-xs font-medium tracking-[0.14em] uppercase">
                Рекомендуемый пакет
              </div>
              {popularPrice ? (
                <>
                  <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold wrap-break-word sm:text-2xl">
                        {popularPrice.title}
                      </h2>
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                        {popularPrice.description}
                      </p>
                    </div>
                    <span className="border-primary/30 bg-primary/10 text-primary inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      Популярно
                    </span>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                    <div className="min-w-0">
                      <div className="text-3xl font-bold wrap-break-word sm:text-4xl">
                        от {formatPrice(popularPrice.priceFrom)} ₸
                      </div>
                      <div className="text-muted-foreground mt-1 inline-flex items-center gap-2 text-sm">
                        <Clock3 className="h-4 w-4" />
                        {popularPrice.durationDays} дней на запуск
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full max-w-full min-w-0 whitespace-normal sm:w-auto"
                    >
                      <Link href="/services">Подробнее</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Прайс пока не заполнен, но секция уже готова к публикации.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

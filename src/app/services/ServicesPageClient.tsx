"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Check,
  Clock3,
  Sparkles,
  Star,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { pricesApi } from "@/libs/api";
import type { Price } from "@/types/api.types";
import { Button } from "@/components/common/Button";
import { Skeleton } from "@/components/common/Skeleton";
import { cn } from "@/utils/tw-merge";

function formatPrice(value: number) {
  return value.toLocaleString("ru-RU");
}

export function ServicesPageClient() {
  const { data: prices, isLoading } = useQuery({
    queryKey: ["prices", "services-page"],
    queryFn: () => pricesApi.findAll(),
  });

  const priceList = useMemo(() => prices ?? [], [prices]);
  const popularPrice = useMemo(
    () => priceList.find((item) => item.isPopular) ?? priceList[0],
    [priceList]
  );

  const minPrice = useMemo(() => {
    if (!priceList.length) return 0;
    return Math.min(...priceList.map((item) => item.priceFrom));
  }, [priceList]);

  return (
    <main className="bg-background relative min-h-screen overflow-x-clip pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/10 absolute top-0 left-1/2 h-112 w-md -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-accent/10 absolute top-1/3 -left-24 h-72 w-72 rounded-full blur-3xl" />
        <div className="bg-primary/10 absolute right-0 bottom-0 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="glass-lg overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="from-primary/15 to-accent/10 absolute inset-0 bg-linear-to-br via-transparent" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.25fr_0.9fr] lg:items-end">
            <div>
              <div className="border-primary/30 bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide sm:text-sm">
                <Sparkles className="h-4 w-4" />
                Услуги и цены
              </div>
              <h1 className="max-w-3xl text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                Пакеты услуг, в которых понятны сроки, стоимость и результат
              </h1>
              <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-relaxed sm:text-base">
                Подбираем формат работы под задачу: от быстрого запуска лендинга
                до комплексной разработки с дизайном, аналитикой и поддержкой.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="border-border bg-card rounded-full border px-4 py-2 text-sm">
                  Пакетов:{" "}
                  <span className="text-primary font-semibold">
                    {priceList.length}
                  </span>
                </div>
                <div className="border-border bg-card rounded-full border px-4 py-2 text-sm">
                  От{" "}
                  <span className="text-primary font-semibold">
                    {formatPrice(minPrice)} ₸
                  </span>
                </div>
              </div>
            </div>

            <div className="glass rounded-3xl p-5 sm:p-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  Рекомендуем
                </span>
                <span className="text-muted-foreground text-xs">
                  Самый частый выбор
                </span>
              </div>

              {popularPrice ? (
                <>
                  <h2 className="text-xl font-semibold sm:text-2xl">
                    {popularPrice.title}
                  </h2>
                  <p className="text-muted-foreground mt-2 line-clamp-3 text-sm leading-relaxed">
                    {popularPrice.description}
                  </p>
                  <div className="mt-5 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-foreground text-3xl font-bold sm:text-4xl">
                        от {formatPrice(popularPrice.priceFrom)} ₸
                      </div>
                      <div className="text-muted-foreground mt-1 inline-flex items-center gap-2 text-sm">
                        <Clock3 className="h-4 w-4" />
                        {popularPrice.durationDays} дней на реализацию
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Добавьте хотя бы одну услугу, чтобы показать рекомендации.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="border-border/60 h-120 rounded-3xl border"
              />
            ))}
          </div>
        ) : !priceList.length ? (
          <div className="glass mx-auto max-w-xl rounded-3xl p-8 text-center sm:p-10">
            <h2 className="text-xl font-semibold sm:text-2xl">
              Прайс пока пуст
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Услуги еще не опубликованы. Скоро здесь появятся актуальные пакеты
              и цены.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {priceList.map((price: Price) => (
              <article
                key={price.id}
                className={cn(
                  "group border-border/70 bg-card/85 hover:shadow-primary/20 shadow-soft relative flex h-full flex-col overflow-hidden rounded-3xl border p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl sm:p-6",
                  price.isPopular &&
                    "border-primary/45 shadow-primary/15 ring-primary/10 shadow-xl ring-1"
                )}
              >
                {price.isPopular && (
                  <>
                    <div className="bg-primary/20 pointer-events-none absolute -top-14 -right-14 h-32 w-32 rounded-full blur-2xl" />
                    <div className="via-primary pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent to-transparent" />
                  </>
                )}

                <div className="relative z-10 flex flex-1 flex-col">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl leading-tight font-semibold">
                        {price.title}
                      </h2>
                      <div className="text-muted-foreground mt-2 inline-flex items-center gap-2 text-sm">
                        <Clock3 className="h-4 w-4" />
                        {price.durationDays} дней
                      </div>
                    </div>

                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                        price.isPopular
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      {price.isPopular ? (
                        <>
                          <Star className="h-3.5 w-3.5 fill-current" />
                          Популярно
                        </>
                      ) : (
                        <>
                          <WalletCards className="h-3.5 w-3.5" />
                          Пакет
                        </>
                      )}
                    </span>
                  </div>

                  <div className="from-primary/10 via-primary/5 mb-5 rounded-2xl bg-linear-to-br to-transparent p-4">
                    <div className="text-muted-foreground mb-1 text-xs tracking-[0.16em] uppercase">
                      Стоимость
                    </div>
                    <div className="text-foreground text-3xl font-bold sm:text-4xl">
                      от {formatPrice(price.priceFrom)} ₸
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {price.description}
                  </p>

                  <div className="mt-5 space-y-3">
                    {price.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-6">
                    <Button asChild className="w-full">
                      <Link href="/#contacts">
                        Обсудить проект
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

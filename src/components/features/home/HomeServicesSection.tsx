import Link from "next/link";
import { ArrowRight, Check, Clock3, Star } from "lucide-react";
import { Button } from "@/components/common/Button";
import type { Price } from "@/types/api.types";
import { cn } from "@/utils/tw-merge";
import { formatPrice } from "./home-content";

interface HomeServicesSectionProps {
  pricesLoading: boolean;
  featuredPrices: Price[];
}

export function HomeServicesSection({
  pricesLoading,
  featuredPrices,
}: HomeServicesSectionProps) {
  return (
    <section className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            Услуги
          </div>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
            Форматы работы под разный масштаб задач
          </h2>
        </div>
        <Button variant="ghost" asChild className="hidden sm:inline-flex">
          <Link href="/services">
            Весь прайс
            <ArrowRight className="ml-1" />
          </Link>
        </Button>
      </div>

      {pricesLoading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-card/60 border-border/60 h-96 animate-pulse rounded-[1.75rem] border"
            />
          ))}
        </div>
      ) : featuredPrices.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredPrices.map((price) => (
            <article
              key={price.id}
              className={cn(
                "group border-border/70 bg-card/85 shadow-soft relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl sm:p-6",
                price.isPopular &&
                  "border-primary/40 ring-primary/10 shadow-primary/10 ring-1"
              )}
            >
              {price.isPopular && (
                <div className="bg-primary/15 pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl" />
              )}
              <div className="relative z-10 flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl leading-tight font-semibold">
                      {price.title}
                    </h3>
                    <div className="text-muted-foreground mt-2 inline-flex items-center gap-2 text-sm">
                      <Clock3 className="h-4 w-4" />
                      {price.durationDays} дней
                    </div>
                  </div>
                  {price.isPopular && (
                    <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      Popular
                    </span>
                  )}
                </div>

                <div className="from-primary/10 via-primary/5 mt-5 rounded-2xl bg-linear-to-br to-transparent p-4">
                  <div className="text-muted-foreground text-xs tracking-[0.16em] uppercase">
                    Стоимость
                  </div>
                  <div className="mt-2 text-3xl font-bold sm:text-4xl">
                    от {formatPrice(price.priceFrom)} ₸
                  </div>
                </div>

                <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
                  {price.description}
                </p>

                <div className="mt-5 space-y-3">
                  {price.features.slice(0, 4).map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <Button asChild className="w-full">
                    <Link href="/services">Выбрать пакет</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="glass rounded-[1.75rem] p-8 text-center sm:p-10">
          <h3 className="text-xl font-semibold sm:text-2xl">
            Услуги скоро здесь
          </h3>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Прайс пока пуст, но главная секция уже готова к публикации.
          </p>
        </div>
      )}
    </section>
  );
}

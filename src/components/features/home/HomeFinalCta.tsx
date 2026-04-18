import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/common/Button";

export function HomeFinalCta() {
  return (
    <section className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="glass-lg relative overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="from-primary/15 to-accent/10 absolute inset-0 bg-linear-to-r via-transparent" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
              Готовы к старту
            </div>
            <h2 className="mt-2 text-3xl leading-tight font-bold sm:text-4xl">
              Хотите сайт, который выглядит сильно и реально приводит клиентов?
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
              Выбирайте пакет услуг или переходите к контактам, чтобы быстро
              обсудить задачу и стартовать без долгих согласований.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="cyan" size="lg" asChild>
              <Link href="/services">
                Перейти к услугам
                <ArrowRight className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

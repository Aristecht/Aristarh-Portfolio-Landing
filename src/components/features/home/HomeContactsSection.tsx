import Link from "next/link";
import { ExternalLink, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/common/Button";

interface HomeContactsSectionProps {
  whatsAppLink?: string;
  instagramLink?: string;
}

export function HomeContactsSection({
  whatsAppLink,
  instagramLink,
}: HomeContactsSectionProps) {
  return (
    <section
      id="contacts"
      className="relative mx-auto mt-8 max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass rounded-[1.75rem] p-6 sm:p-7">
          <div className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            Контакты
          </div>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl lg:text-4xl">
            Обсудим ваш проект и подберем лучшее решение под бюджет
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
            Делаю сайты любой сложности по доступной цене среди конкурентов,
            работаю на совесть и пишу чистый, грамотный код. Напишите в удобный
            канал и получите быстрый ответ по стоимости и срокам.
          </p>
          <div className="border-border/60 bg-card/70 text-muted-foreground mt-6 rounded-2xl border p-4 text-sm">
            Подходит для: расчета стоимости, обсуждения сроков, структуры сайта,
            лендинга, интернет-магазина или полного редизайна.
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="border-border/70 bg-card/85 shadow-soft flex h-full flex-col rounded-[1.5rem] border p-5 sm:p-6">
            <div className="bg-primary/10 text-primary inline-flex h-12 w-12 items-center justify-center rounded-2xl">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">WhatsApp</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Быстрый канал для обсуждения заказа, цены и удобного старта по
              проекту.
            </p>
            <div className="mt-auto pt-6">
              {whatsAppLink ? (
                <Button asChild className="w-full">
                  <Link href={whatsAppLink} target="_blank" rel="noreferrer">
                    Написать в WhatsApp
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="border-border text-muted-foreground rounded-2xl border border-dashed px-4 py-3 text-sm">
                  Добавьте NEXT_PUBLIC_WHATSAPP_URL, чтобы активировать ссылку.
                </div>
              )}
            </div>
          </article>

          <article className="border-border/70 bg-card/85 shadow-soft flex h-full flex-col rounded-[1.5rem] border p-5 sm:p-6">
            <div className="bg-primary/10 text-primary inline-flex h-12 w-12 items-center justify-center rounded-2xl">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-xl font-semibold">Instagram</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              Подойдет, если хотите посмотреть стиль работ и обсудить заказ в
              директе.
            </p>
            <div className="mt-auto pt-6">
              {instagramLink ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href={instagramLink} target="_blank" rel="noreferrer">
                    Открыть Instagram
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="border-border text-muted-foreground rounded-2xl border border-dashed px-4 py-3 text-sm">
                  Добавьте NEXT_PUBLIC_INSTAGRAM_URL, чтобы активировать ссылку.
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

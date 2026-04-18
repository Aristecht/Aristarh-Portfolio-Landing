import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import { Button } from "@/components/common/Button";

export default function NotFound() {
  return (
    <main className="bg-background relative flex items-center justify-center overflow-x-clip px-4 py-28 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/12 absolute top-0 left-1/2 h-112 w-md -translate-x-1/2 rounded-full blur-3xl" />
        <div className="bg-accent/10 absolute right-0 bottom-0 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <section className="glass-lg relative z-10 w-full max-w-2xl overflow-hidden rounded-[2rem] p-6 text-center sm:p-10">
        <div className="from-primary/15 to-accent/10 pointer-events-none absolute inset-0 bg-linear-to-br via-transparent" />

        <div className="relative z-10">
          <div className="bg-primary/10 text-primary mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl">
            <SearchX className="h-7 w-7" />
          </div>

          <div className="text-primary text-sm font-semibold tracking-[0.18em] uppercase">
            Ошибка 404
          </div>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Страница не найдена
          </h1>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
            Возможно, ссылка устарела или страница была перемещена. Вернитесь на
            главную и продолжите просмотр сайта.
          </p>

          <div className="mt-8 flex justify-center">
            <Button asChild size="lg" variant="cyan">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                На главную
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

import { workflow } from "./home-content";

export function HomeWorkflowSection() {
  return (
    <section className="relative mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass rounded-[1.75rem] p-6 sm:p-7">
          <div className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            Процесс
          </div>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            Четкий маршрут от идеи до готового запуска
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed sm:text-base">
            Работаем по этапам, чтобы решение не расползалось по срокам и не
            теряло фокус по ходу проекта.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {workflow.map((item) => (
            <article
              key={item.step}
              className="border-border/60 bg-card/85 shadow-soft rounded-[1.5rem] border p-5"
            >
              <div className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                {item.step}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

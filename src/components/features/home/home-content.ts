import { BadgeCheck, Layers3, LineChart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProjectStatus } from "@/types/api.types";

export interface AdvantageItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface WorkflowItem {
  step: string;
  title: string;
  description: string;
}

export const advantages: AdvantageItem[] = [
  {
    title: "Стратегия до дизайна",
    description:
      "Сначала собираем структуру, смысл и сценарий продаж, затем переводим это в сильный интерфейс.",
    icon: LineChart,
  },
  {
    title: "Сборка под запуск",
    description:
      "Делаем не просто красивый экран, а готовый продукт с адаптивом, скоростью и продуманным UX.",
    icon: Layers3,
  },
  {
    title: "Чистая реализация",
    description:
      "Пишу чистый, грамотный код и довожу проект до надежного результата, который легко развивать дальше.",
    icon: BadgeCheck,
  },
];

export const workflow: WorkflowItem[] = [
  {
    step: "01",
    title: "Погружение",
    description: "Разбираем задачу, аудиторию, цели и точку роста проекта.",
  },
  {
    step: "02",
    title: "Концепция",
    description:
      "Собираем структуру, тексты, визуальное направление и прототип решения.",
  },
  {
    step: "03",
    title: "Разработка",
    description:
      "Верстаем, подключаем логику, анимации, формы и нужные интеграции.",
  },
  {
    step: "04",
    title: "Запуск",
    description:
      "Тестируем, публикуем и доводим до состояния, которое можно показывать клиентам.",
  },
];

export function formatPrice(value: number) {
  return value.toLocaleString("ru-RU");
}

export function getImageSrc(imageUrl?: string) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  try {
    const parsedApiUrl = new URL(rawApiUrl);
    const apiOrigin = parsedApiUrl.origin;
    const apiPath = parsedApiUrl.pathname.replace(/\/+$/, "");
    const normalizedImagePath = imageUrl.replace(/^\/+/, "");

    if (apiPath && apiPath !== "/") {
      const normalizedApiPath = apiPath.replace(/^\/+/, "");
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

export function getStatusMeta(status: ProjectStatus) {
  if (status === ProjectStatus.DONE) {
    return {
      label: "Завершен",
      tone: "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300",
    };
  }

  if (status === ProjectStatus.IN_PROGRESS) {
    return {
      label: "В работе",
      tone: "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-300",
    };
  }

  return {
    label: "Черновик",
    tone: "border-slate-500/30 bg-slate-500/12 text-slate-700 dark:text-slate-300",
  };
}

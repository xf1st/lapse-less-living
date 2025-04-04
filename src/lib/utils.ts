
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Функция форматирования даты для admin panel
export function formatDate(date: string | null): string {
  if (!date) return "Never";
  return new Date(date).toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Функция для форматирования цены
export function formatPrice(price: number | null): string {
  if (price === null || price === 0) return "Бесплатно";
  return `${price.toLocaleString("ru-RU")} ₽`;
}

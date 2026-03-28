import en from "@/locales/en.json";
import ptBR from "@/locales/pt-BR.json";

export type Locale = "en" | "pt-BR";

const I18N = {
  en,
  "pt-BR": ptBR,
} as const;

export function normalizeLocale(value: unknown): Locale {
  if (typeof value !== "string") return "en";

  const normalized = value.toLowerCase();
  if (
    normalized === "pt" ||
    normalized === "pt-br" ||
    normalized === "pt_br"
  ) {
    return "pt-BR";
  }

  return "en";
}

export function getI18n(locale: Locale) {
  return I18N[locale];
}

export function interpolate(
  template: string,
  variables: Record<string, string | number>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = variables[key];
    return value === undefined ? "" : String(value);
  });
}

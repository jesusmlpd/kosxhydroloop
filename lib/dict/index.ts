import type { Locale } from "@/lib/i18n";
import { en } from "./en";
import { es, type Dict } from "./es";

const dicts: Record<Locale, Dict> = { es, en };

export function getDict(locale: Locale): Dict {
  return dicts[locale];
}

export type { Dict };

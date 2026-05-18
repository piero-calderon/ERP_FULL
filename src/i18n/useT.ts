// Hook principal de traduccion
import { useLangStore } from "@/store/lang.store";
import { translations } from "./translations";

export function useT() {
  const { lang } = useLangStore();
  const t = translations[lang];
  return t;
}

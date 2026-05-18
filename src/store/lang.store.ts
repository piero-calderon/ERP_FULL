// Store de idioma - ES / IT
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "es" | "it";

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
}

export const useLangStore = create<LangState>()(
  persist(
    (set, get) => ({
      lang: "es",
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === "es" ? "it" : "es" }),
    }),
    { name: "erp-lang" }
  )
);

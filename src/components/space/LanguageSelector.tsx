import { Check, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LANGUAGES, useI18n, type LangCode } from "@/lib/i18n";

export default function LanguageSelector() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t("language")}
        title={t("language")}
        className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[11px] transition-colors sm:px-3 ${
          open
            ? "border-gold/40 bg-gold/10 text-gold"
            : "border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:border-gold/40 hover:text-gold"
        }`}
      >
        <Globe size={14} />
        <span className="font-mono text-[10px] tracking-[0.12em]">{current.short}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-[80] w-44 origin-top-right overflow-hidden rounded-xl border border-white/[0.1] bg-[oklch(0.09_0.016_265_/_0.92)] p-1 shadow-2xl backdrop-blur-xl">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code as LangCode);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors hover:bg-white/[0.06] ${
                l.code === lang ? "text-gold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[9px] tracking-[0.14em] opacity-70">{l.short}</span>
              <span className="truncate">{l.label}</span>
              {l.code === lang && <Check size={13} className="ml-auto shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

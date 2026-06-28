import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, Copy, Send } from "lucide-react";
import { uah } from "../lib/catalog";
import { useCart } from "../lib/store";

const ANNA = "Anna_L_Kosmetolog"; // особистий акаунт косметолога

type Delivery = "ua" | "intl";
type Form = { name: string; phone: string; city: string; delivery: Delivery; note: string };

const empty: Form = { name: "", phone: "", city: "", delivery: "ua", note: "" };

export function Checkout({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { rows, total, clear } = useCart();
  const [f, setF] = useState<Form>(empty);
  const [touched, setTouched] = useState(false);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) { setF(empty); setTouched(false); setDone(false); setCopied(false); }
  }, [open]);

  const phoneOk = /^[+\d][\d\s()-]{8,}$/.test(f.phone.trim());
  const valid = f.name.trim().length >= 2 && phoneOk && f.city.trim().length >= 2;

  const message = useMemo(() => {
    const lines = rows.map(
      (r) => `• ${r.product.brand} — ${r.product.name} (${r.ml ? `розпив ${r.ml} мл` : r.product.vol}) ×${r.qty} — ${uah(r.sum)} грн`
    );
    return [
      "🛍️ Нове замовлення — K-Beauty Profi",
      "",
      ...lines,
      "",
      `Разом: ${uah(total)} грн`,
      "",
      `Ім'я: ${f.name}`,
      `Телефон: ${f.phone}`,
      `Місто/відділення: ${f.city}`,
      `Доставка: ${f.delivery === "ua" ? "по Україні" : "за кордон"}`,
      f.note.trim() ? `Коментар: ${f.note}` : "",
      "",
      "Оплата повна — доставка після оплати.",
    ].filter(Boolean).join("\n");
  }, [rows, total, f]);

  const submit = () => {
    setTouched(true);
    if (!valid || rows.length === 0) return;
    setDone(true);
  };

  const copyOrder = async () => {
    try { await navigator.clipboard.writeText(message); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* noop */ }
  };

  const openTelegram = () => {
    copyOrder();
    window.open(`https://t.me/${ANNA}`, "_blank", "noopener");
  };

  const field = "h-11 w-full rounded-[var(--r-md)] border bg-surface-2 px-4 text-[14px] text-ink outline-none transition-colors focus:border-brand";
  const errBorder = (bad: boolean) => (touched && bad ? "border-[#e74c3c]" : "border-line");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-end overflow-y-auto bg-[rgba(20,16,12,.5)] backdrop-blur-sm sm:place-items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog" aria-modal="true"
            className="relative w-full max-w-[520px] overflow-hidden rounded-t-[var(--r-lg)] border border-line bg-surface shadow-[var(--e-4)] sm:rounded-[var(--r-lg)]"
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-line px-[var(--sp-5)] py-4">
              <strong className="font-display text-[18px]">{done ? "Замовлення готове" : "Оформлення замовлення"}</strong>
              <button onClick={onClose} aria-label="Закрити" className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-ink">
                <X size={20} />
              </button>
            </header>

            {!done ? (
              <div className="stack p-[var(--sp-5)]" style={{ gap: "var(--sp-3)" }}>
                <div className="stack" style={{ gap: 6 }}>
                  <label className="text-[12px] font-bold text-ink">Ім'я та прізвище *</label>
                  <input className={`${field} ${errBorder(f.name.trim().length < 2)}`} value={f.name}
                    onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Напр., Олена Коваль" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="stack" style={{ gap: 6 }}>
                    <label className="text-[12px] font-bold text-ink">Телефон *</label>
                    <input className={`${field} ${errBorder(!phoneOk)}`} value={f.phone} inputMode="tel"
                      onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+380…" />
                  </div>
                  <div className="stack" style={{ gap: 6 }}>
                    <label className="text-[12px] font-bold text-ink">Місто / відділення *</label>
                    <input className={`${field} ${errBorder(f.city.trim().length < 2)}`} value={f.city}
                      onChange={(e) => setF({ ...f, city: e.target.value })} placeholder="Київ, НП №12" />
                  </div>
                </div>

                <div className="stack" style={{ gap: 6 }}>
                  <label className="text-[12px] font-bold text-ink">Доставка</label>
                  <div className="inline-flex gap-1 rounded-[var(--r-pill)] border border-line bg-surface-2 p-[5px]">
                    {([["ua", "🇺🇦 По Україні"], ["intl", "✈️ За кордон"]] as [Delivery, string][]).map(([v, l]) => (
                      <button key={v} onClick={() => setF({ ...f, delivery: v })}
                        style={f.delivery === v ? { background: "var(--grad-brand)" } : undefined}
                        className={`h-9 flex-1 rounded-[var(--r-pill)] px-4 text-[13px] font-bold transition-colors ${f.delivery === v ? "text-[var(--on-brand)]" : "text-muted hover:text-ink"}`}>
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="stack" style={{ gap: 6 }}>
                  <label className="text-[12px] font-bold text-ink">Коментар (необов'язково)</label>
                  <textarea className={`${field} border-line`} style={{ height: 64, paddingTop: 10, resize: "none" }} value={f.note}
                    onChange={(e) => setF({ ...f, note: e.target.value })} placeholder="Побажання, уточнення…" />
                </div>

                <div className="flex items-center justify-between rounded-[var(--r-md)] bg-surface-2 px-4 py-3">
                  <span className="text-[14px] text-muted">До сплати</span>
                  <span className="font-display text-[20px] font-bold text-ink">{uah(total)} грн</span>
                </div>

                {touched && rows.length === 0 && <p className="text-[12px] text-[#e74c3c]">Кошик порожній.</p>}

                <motion.button whileTap={{ scale: 0.98 }} onClick={submit} disabled={rows.length === 0}
                  style={{ background: "var(--grad-brand)" }}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--r-md)] text-[15px] font-bold text-[var(--on-brand)] shadow-[var(--glow)] disabled:opacity-50">
                  Підтвердити замовлення →
                </motion.button>
                <p className="text-center text-[11.5px] leading-snug text-muted">
                  Оплата повна. Доставка по Україні та за кордон — після оплати.
                </p>
              </div>
            ) : (
              <div className="stack p-[var(--sp-5)]" style={{ gap: "var(--sp-3)" }}>
                <div className="grid place-items-center gap-2 py-2 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-mint text-[var(--ok)]"><Check size={28} /></span>
                  <h3 className="font-display text-[19px]">Замовлення сформовано</h3>
                  <p className="max-w-[360px] text-[13.5px] text-muted">
                    Натисніть «Надіслати в Telegram» — текст замовлення скопіюється, відкриється чат косметолога. Вставте й надішліть повідомлення.
                  </p>
                </div>

                <pre className="max-h-[220px] overflow-y-auto whitespace-pre-wrap rounded-[var(--r-md)] border border-line bg-surface-2 p-4 text-[12.5px] leading-relaxed text-ink">{message}</pre>

                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <motion.button whileTap={{ scale: 0.98 }} onClick={openTelegram}
                    className="flex h-12 items-center justify-center gap-2 rounded-[var(--r-md)] bg-[#229ED9] text-[15px] font-bold text-white transition-opacity hover:opacity-90">
                    <Send size={18} /> Надіслати в Telegram
                  </motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={copyOrder} aria-label="Скопіювати"
                    className={`grid h-12 w-12 place-items-center rounded-[var(--r-md)] border transition-colors ${copied ? "border-[var(--ok)] text-[var(--ok)]" : "border-line text-ink hover:border-brand"}`}>
                    {copied ? <Check size={20} /> : <Copy size={18} />}
                  </motion.button>
                </div>

                <button onClick={() => { clear(); onClose(); }} className="text-center text-[12px] text-muted underline-offset-2 hover:underline">
                  Готово — очистити кошик і закрити
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

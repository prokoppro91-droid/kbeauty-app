import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Check, FlaskConical, ShoppingBag } from "lucide-react";
import type { Product } from "../data/products";
import { emojiFor, catName, uah, decantSizes, decantPrice, discPct } from "../lib/catalog";
import { useCart } from "../lib/store";

const badgeLabel: Record<string, string> = { hit: "Хіт продажів", new: "Новинка", pro: "Преміум" };

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { add } = useCart();
  // null = повний об'єм; число = розпив, мл
  const [ml, setMl] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setMl(null);
    setAdded(false);
  }, [product?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (product) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  const sizes = product ? decantSizes(product) : [];
  const price = !product ? 0 : ml ? decantPrice(product, ml) : product.price;
  const disc = product ? discPct(product) : 0;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-end overflow-y-auto bg-[rgba(20,16,12,.5)] backdrop-blur-sm sm:place-items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[760px] overflow-hidden rounded-t-[var(--r-lg)] border border-line bg-surface shadow-[var(--e-4)] sm:rounded-[var(--r-lg)]"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Закрити"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/80 text-ink backdrop-blur transition-colors hover:border-brand"
            >
              <X size={18} />
            </button>

            <div className="grid sm:grid-cols-[300px_1fr]">
              {/* візуал */}
              <div className="relative grid h-[220px] place-items-center bg-[radial-gradient(120%_90%_at_50%_0%,var(--surface)_0%,transparent_60%),linear-gradient(135deg,var(--surface-2),var(--surface))] sm:h-auto">
                <span className="text-[88px]">{emojiFor(product)}</span>
                {disc > 0 && (
                  <span className="absolute left-4 top-4 rounded-[var(--r-pill)] bg-[#e74c3c] px-2.5 py-1 text-[11px] font-extrabold text-white">
                    −{disc}%
                  </span>
                )}
              </div>

              {/* інфо */}
              <div className="flex flex-col gap-3 p-[var(--sp-5)]">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--brand-strong)]">
                    {catName(product.cat)}
                  </span>
                  {product.badge && <span className={`badge badge--${product.badge}`}>{badgeLabel[product.badge] ?? product.badge}</span>}
                </div>

                <div>
                  <p className="text-[13px] font-semibold text-muted">{product.brand}</p>
                  <h2 className="font-display text-[22px] font-semibold leading-tight text-ink">{product.name}</h2>
                  <p className="mt-1 text-[13px] text-muted">Об'єм: {product.vol}</p>
                </div>

                {product.desc && <p className="text-[14px] leading-relaxed text-muted">{product.desc}</p>}

                {/* вибір об'єму / розпив */}
                {sizes.length > 0 && (
                  <div className="stack" style={{ gap: "var(--sp-2)" }}>
                    <span className="flex items-center gap-1.5 text-[12px] font-bold text-ink">
                      <FlaskConical size={13} className="text-[var(--ok)]" /> Об'єм / розпив
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setMl(null)}
                        className={`chip ${ml === null ? "is-active" : ""}`}
                      >
                        Повний · {product.vol}
                      </button>
                      {sizes.map((s) => (
                        <button key={s} onClick={() => setMl(s)} className={`chip ${ml === s ? "is-active" : ""}`}>
                          {s} мл · {uah(decantPrice(product, s))} грн
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto flex items-center gap-3 pt-2">
                  <div className="flex-1 font-display text-[26px] font-bold text-ink">
                    {uah(price)} <span className="text-[14px] font-semibold text-muted">грн</span>
                    {ml === null && product.old && (
                      <span className="ml-2 text-[14px] font-normal text-[#b9aa92] line-through">{uah(product.old)}</span>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      add(product.id, ml);
                      setAdded(true);
                      setTimeout(() => setAdded(false), 1400);
                    }}
                    className={`inline-flex h-12 items-center gap-2 rounded-[var(--r-md)] px-6 text-[15px] font-bold transition-colors ${
                      added ? "bg-mint text-[var(--ok)]" : "text-[var(--on-brand)] shadow-[var(--glow)]"
                    }`}
                    style={added ? undefined : { background: "var(--brand)" }}
                  >
                    {added ? <Check size={18} /> : <ShoppingBag size={18} />}
                    {added ? "Додано" : "У кошик"}
                  </motion.button>
                </div>

                <p className="text-[11.5px] leading-snug text-muted">
                  {ml
                    ? "Розпив у фірмовому флаконі з підписом. Доставка після повної оплати."
                    : "Лише в оригінальній упаковці. Доставка по Україні та за кордон після повної оплати."}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

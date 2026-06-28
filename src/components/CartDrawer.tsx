import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { emojiFor, uah } from "../lib/catalog";
import { useCart } from "../lib/store";

export function CartDrawer({ open, onClose, onCheckout }: { open: boolean; onClose: () => void; onCheckout: () => void }) {
  const { rows, total, count, setQty, remove, clear } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-[rgba(20,16,12,.45)] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-line bg-surface shadow-[var(--e-4)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <header className="flex items-center justify-between border-b border-line px-[var(--sp-5)] py-4">
              <strong className="font-display text-[18px]">Кошик{count > 0 ? ` · ${count}` : ""}</strong>
              <button onClick={onClose} aria-label="Закрити" className="grid h-9 w-9 place-items-center rounded-full text-muted hover:text-ink">
                <X size={20} />
              </button>
            </header>

            {rows.length === 0 ? (
              <div className="grid flex-1 place-items-center gap-2 px-6 text-center">
                <span className="text-[44px]">🛍️</span>
                <h3 className="font-display text-[18px]">Кошик порожній</h3>
                <p className="text-[14px] text-muted">Додайте засоби з каталогу — повним об'ємом або на розпив.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-3 overflow-y-auto px-[var(--sp-5)] py-4">
                  {rows.map((r) => (
                    <div key={r.key} className="flex gap-3 rounded-[var(--r-md)] border border-line bg-surface-2 p-3">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--r-sm)] bg-surface text-[28px]">
                        {emojiFor(r.product)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-ink">{r.product.name}</p>
                        <p className="text-[12px] text-muted">
                          {r.product.brand} · {r.ml ? `розпив ${r.ml} мл` : r.product.vol}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center gap-1 rounded-[var(--r-pill)] border border-line bg-surface">
                            <button onClick={() => setQty(r.key, r.qty - 1)} aria-label="Менше" className="grid h-7 w-7 place-items-center text-muted hover:text-ink">
                              <Minus size={14} />
                            </button>
                            <span className="min-w-[20px] text-center text-[13px] font-bold">{r.qty}</span>
                            <button onClick={() => setQty(r.key, r.qty + 1)} aria-label="Більше" className="grid h-7 w-7 place-items-center text-muted hover:text-ink">
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="font-display text-[15px] font-bold text-ink">{uah(r.sum)} грн</span>
                        </div>
                      </div>
                      <button onClick={() => remove(r.key)} aria-label="Прибрати" className="grid h-8 w-8 shrink-0 place-items-center self-start rounded-full text-muted hover:text-[#e74c3c]">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button onClick={clear} className="text-[12px] text-muted underline-offset-2 hover:underline">
                    Очистити кошик
                  </button>
                </div>

                <footer className="border-t border-line px-[var(--sp-5)] py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[14px] text-muted">Разом</span>
                    <span className="font-display text-[22px] font-bold text-ink">{uah(total)} грн</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { onClose(); onCheckout(); }}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-[var(--r-md)] bg-ink text-[15px] font-bold text-surface transition-colors hover:bg-[var(--brand-strong)]"
                  >
                    <ShoppingBag size={18} /> Оформити замовлення
                  </motion.button>
                  <p className="mt-2 text-center text-[11.5px] leading-snug text-muted">
                    Доставка по Україні та за кордон — після повної оплати.
                  </p>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";
import { useCart } from "../lib/store";

export function Navbar({
  query,
  onQuery,
  onCart,
}: {
  query: string;
  onQuery: (v: string) => void;
  onCart: () => void;
}) {
  const { count } = useCart();

  return (
    <div className="glass sticky top-0 z-40 border-x-0 border-t-0">
      <div className="wrap flex h-[68px] items-center gap-4">
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <span
            className="grid h-10 w-10 place-items-center rounded-[var(--r-md)] font-display text-[15px] font-bold text-[var(--on-brand)] shadow-[var(--glow)]"
            style={{ background: "var(--grad-brand)" }}
          >
            KB
          </span>
          <strong className="hidden font-display text-[18px] sm:inline">K-Beauty Profi</strong>
        </a>

        <label className="relative ml-auto w-full max-w-[420px]">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Пошук засобу або бренду…"
            className="glass h-11 w-full rounded-[var(--r-pill)] pl-11 pr-4 text-[14px] text-ink outline-none transition-colors focus:border-brand"
          />
        </label>

        <ThemeToggle />

        <motion.button
          type="button"
          onClick={onCart}
          whileTap={{ scale: 0.92 }}
          aria-label="Кошик"
          className="glass relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink transition-colors hover:border-brand"
        >
          <ShoppingBag size={18} />
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-[var(--brand-strong)] px-1 text-[11px] font-extrabold text-[var(--on-brand)]"
            >
              {count}
            </motion.span>
          )}
        </motion.button>
      </div>
    </div>
  );
}

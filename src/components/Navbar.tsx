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
      <div className="wrap flex h-[52px] items-center gap-5">
        <a href="#top" className="flex shrink-0 items-center gap-2 text-[17px] font-semibold tracking-[-.4px] text-ink">
          <span className="grid h-6 w-6 place-items-center rounded-[6px] bg-ink text-[11px] font-bold text-snow">K</span>
          K-Beauty Profi
        </a>

        <nav className="ml-2 hidden gap-6 text-[12px] text-graphite md:flex">
          <a href="#catalog" className="transition-colors hover:text-ink">Каталог</a>
          <a href="#feature-decant" className="transition-colors hover:text-ink">Розпив</a>
          <a href="#feature-pro" className="transition-colors hover:text-ink">Професійне</a>
        </nav>

        <label className="relative ml-auto w-full max-w-[300px]">
          <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-graphite" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Пошук"
            className="h-9 w-full rounded-[var(--r-pill)] border border-line bg-snow pl-9 pr-4 text-[14px] text-ink outline-none transition-colors focus:border-brand"
          />
        </label>

        <ThemeToggle />

        <motion.button
          type="button"
          onClick={onCart}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.1 }}
          aria-label="Кошик"
          className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-fog"
        >
          <ShoppingBag size={18} />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}

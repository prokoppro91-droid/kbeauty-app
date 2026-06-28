import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "../data/products";
import { ProductCard } from "./ProductCard";
import { useCart } from "../lib/store";

export function Shelf({
  title,
  emoji,
  items,
  onOpen,
}: {
  title: string;
  emoji?: string;
  items: Product[];
  onOpen: (p: Product) => void;
}) {
  const { add, toggleFav, fav, inCart } = useCart();
  const track = useRef<HTMLDivElement>(null);

  const nudge = (dir: number) => track.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <section className="stack" style={{ gap: "var(--sp-4)" }}>
      <div className="flex items-end justify-between gap-4">
        <motion.h2 className="t-h2 font-display"
          initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          {emoji && <span className="mr-2">{emoji}</span>}{title}
        </motion.h2>
        <div className="hidden gap-2 sm:flex">
          <button onClick={() => nudge(-1)} aria-label="Назад" className="grid h-9 w-9 place-items-center rounded-full bg-fog text-ink transition-colors hover:bg-silver">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => nudge(1)} aria-label="Далі" className="grid h-9 w-9 place-items-center rounded-full bg-fog text-ink transition-colors hover:bg-silver">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={track} className="no-sb -mx-[var(--gutter)] flex snap-x snap-mandatory gap-[var(--sp-4)] overflow-x-auto px-[var(--gutter)] pb-2">
        {items.map((p, i) => (
          <motion.div key={p.id} className="w-[240px] shrink-0 snap-start"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }}
            transition={{ delay: Math.min(i, 6) * 0.05, duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}>
            <ProductCard
              p={p}
              inCart={inCart(p.id)}
              faved={fav.has(p.id)}
              onAdd={(id) => add(id)}
              onFav={(id) => toggleFav(id)}
              onOpen={() => onOpen(p)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

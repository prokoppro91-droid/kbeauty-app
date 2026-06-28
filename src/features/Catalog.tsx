import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PRODUCTS, CATEGORIES, type Product } from "../data/products";
import { catName } from "../lib/catalog";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../lib/store";

type Group = "care" | "pro";
type Sort = "pop" | "new" | "price-asc" | "price-desc";

const ORDER: Record<string, number> = { hit: 0, new: 1, pro: 2 };

export function Catalog({ query, onOpen }: { query: string; onOpen: (p: Product) => void }) {
  const { add, toggleFav, fav, inCart } = useCart();
  const [group, setGroup] = useState<Group>("care");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("pop");
  const [decantOnly, setDecantOnly] = useState(false);

  const cats = useMemo(() => CATEGORIES.filter((c) => c.group === group), [group]);

  const list = useMemo(() => {
    let l: Product[] = PRODUCTS.filter((p) => p.group === group);
    if (cat !== "all") l = l.filter((p) => p.cat === cat);
    if (query.trim()) {
      const s = query.toLowerCase();
      l = l.filter((p) =>
        `${p.name} ${p.brand} ${catName(p.cat)} ${(p.tags ?? []).join(" ")}`.toLowerCase().includes(s)
      );
    }
    const sorted = [...l];
    switch (sort) {
      case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
      case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
      case "new": sorted.sort((a, b) => (a.badge === "new" ? -1 : 1) - (b.badge === "new" ? -1 : 1)); break;
      default: sorted.sort((a, b) => (ORDER[a.badge ?? ""] ?? 3) - (ORDER[b.badge ?? ""] ?? 3));
    }
    return sorted;
  }, [group, cat, query, sort]);

  // фільтр «лише на розпив» застосовуємо тут, щоб не плодити залежності хука вище
  const shown = decantOnly ? list.filter((p) => ["cream", "serum", "toner", "cleanser"].includes(p.cat)) : list;

  const switchGroup = (g: Group) => { setGroup(g); setCat("all"); };

  return (
    <section id="catalog" className="stack" style={{ gap: "var(--sp-5)" }}>
      {/* розділи */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="glass inline-flex w-fit gap-1 rounded-[var(--r-pill)] p-[5px] shadow-[var(--e-1)]">
          {(["care", "pro"] as Group[]).map((g) => (
            <button
              key={g}
              onClick={() => switchGroup(g)}
              className={`h-11 rounded-[var(--r-pill)] px-5 text-[14px] font-bold transition-colors ${
                group === g ? "text-[var(--on-brand)] shadow-[var(--glow)]" : "text-muted hover:text-ink"
              }`}
              style={group === g ? { background: "var(--grad-brand)" } : undefined}
            >
              {g === "care" ? "🧴 Догляд" : "💉 Професійна"}
            </button>
          ))}
        </div>

        <button
          onClick={() => setDecantOnly((v) => !v)}
          className={`chip ${decantOnly ? "is-active" : ""}`}
          title="Засоби, доступні на розпив"
        >
          🧪 Лише на розпив
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="glass ml-auto h-11 rounded-[var(--r-pill)] px-4 text-[14px] text-ink outline-none"
        >
          <option value="pop">Спочатку популярні</option>
          <option value="new">Спочатку новинки</option>
          <option value="price-asc">Ціна: за зростанням</option>
          <option value="price-desc">Ціна: за спаданням</option>
        </select>
      </div>

      {/* категорії-чіпи */}
      <div className="flex flex-wrap gap-2">
        <button className={`chip ${cat === "all" ? "is-active" : ""}`} onClick={() => setCat("all")}>Усі</button>
        {cats.map((c) => (
          <button key={c.id} className={`chip ${cat === c.id ? "is-active" : ""}`} onClick={() => setCat(c.id)}>
            {c.name}
          </button>
        ))}
      </div>

      <p className="text-[13px] text-muted">Знайдено товарів: {shown.length}</p>

      {/* сітка */}
      {shown.length === 0 ? (
        <div className="grid place-items-center gap-2 py-16 text-center">
          <span className="text-[40px]">🔍</span>
          <h3 className="font-display text-[20px]">Нічого не знайдено</h3>
          <p className="text-[14px] text-muted">Спробуйте змінити запит або категорію.</p>
        </div>
      ) : (
        <div className="grid gap-[var(--sp-4)]" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(216px,1fr))" }}>
          {shown.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: Math.min(i, 8) * 0.03, duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            >
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
      )}
    </section>
  );
}

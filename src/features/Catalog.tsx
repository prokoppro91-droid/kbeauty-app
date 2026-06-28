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
      l = l.filter((p) => `${p.name} ${p.brand} ${catName(p.cat)} ${(p.tags ?? []).join(" ")}`.toLowerCase().includes(s));
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

  const shown = decantOnly ? list.filter((p) => ["cream", "serum", "toner", "cleanser"].includes(p.cat)) : list;
  const switchGroup = (g: Group) => { setGroup(g); setCat("all"); };

  return (
    <section id="catalog" className="band-fog">
      <div className="wrap section">
        <h2 className="t-h1 mb-2">Весь каталог</h2>
        <p className="t-lead mb-8">{PRODUCTS.length} засобів · {CATEGORIES.length} категорій</p>

        {/* сегмент-контрол розділів */}
        <div className="mb-6 inline-flex rounded-[var(--r-pill)] bg-silver p-1" style={{ background: "var(--frost)" }}>
          {(["care", "pro"] as Group[]).map((g) => (
            <button key={g} onClick={() => switchGroup(g)}
              className={`h-9 rounded-[var(--r-pill)] px-5 text-[14px] font-medium transition-colors ${group === g ? "bg-snow text-ink" : "text-graphite hover:text-ink"}`}>
              {g === "care" ? "Догляд" : "Професійне"}
            </button>
          ))}
        </div>

        {/* sub-nav категорій (sticky) */}
        <div className="no-sb sticky top-[52px] z-20 -mx-[var(--gutter)] mb-6 flex items-center gap-6 overflow-x-auto border-b border-line bg-fog/85 px-[var(--gutter)] py-3 backdrop-blur">
          {[{ id: "all", name: "Усі" }, ...cats].map((c) => (
            <button key={c.id} onClick={() => setCat(c.id)}
              className={`relative shrink-0 whitespace-nowrap pb-2 text-[14px] transition-colors ${cat === c.id ? "font-semibold text-ink" : "text-graphite hover:text-ink"}`}>
              {c.name}
              {cat === c.id && <motion.span layoutId="catUnderline" className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-ink" />}
            </button>
          ))}
        </div>

        {/* допоміжні фільтри */}
        <div className="mb-7 flex flex-wrap items-center gap-3">
          <button onClick={() => setDecantOnly((v) => !v)} className={`chip ${decantOnly ? "is-active" : ""}`}>Лише на розпив</button>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
            className="ml-auto h-9 rounded-[var(--r-pill)] border border-line bg-snow px-4 text-[14px] text-ink outline-none">
            <option value="pop">Популярні</option>
            <option value="new">Новинки</option>
            <option value="price-asc">Ціна ↑</option>
            <option value="price-desc">Ціна ↓</option>
          </select>
        </div>

        <p className="mb-4 text-[13px] text-graphite">Знайдено: {shown.length}</p>

        {shown.length === 0 ? (
          <div className="grid place-items-center gap-2 py-20 text-center">
            <h3 className="t-title">Нічого не знайдено</h3>
            <p className="text-[14px] text-graphite">Змініть запит або категорію.</p>
          </div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
            {shown.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: Math.min(i, 8) * 0.03, duration: 0.344, ease: "easeOut" }}>
                <ProductCard p={p} inCart={inCart(p.id)} faved={fav.has(p.id)}
                  onAdd={(id) => add(id)} onFav={(id) => toggleFav(id)} onOpen={() => onOpen(p)} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

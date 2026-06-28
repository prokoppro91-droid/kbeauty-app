import { CATEGORIES, type Product } from "../data/products";

export const catName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? "";
export const emojiFor = (p: Product) => CATEGORIES.find((c) => c.id === p.cat)?.icon ?? "🧴";
export const originOf = (p: Product) => p.origin ?? "kr";
export const uah = (n: number) => n.toLocaleString("uk-UA");
export const discPct = (p: Product) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);

/* розпив (відлив) */
const DECANT_CATS = ["cream", "serum", "toner", "cleanser"];
const DECANT_SIZES = [5, 10, 20, 30, 50];
export const volMl = (p: Product): number | null => {
  const m = String(p.vol ?? "").match(/(\d+)\s*мл/i);
  return m ? +m[1] : null;
};
export const decantSizes = (p: Product): number[] => {
  const v = volMl(p);
  return p && DECANT_CATS.includes(p.cat) && v ? DECANT_SIZES.filter((s) => s < v) : [];
};
export const canDecant = (p: Product) => decantSizes(p).length > 0;
export const decantPrice = (p: Product, ml: number) => {
  const v = volMl(p);
  if (!v) return 0;
  return Math.max(40, Math.round(((p.price / v) * ml * 1.25) / 5) * 5);
};

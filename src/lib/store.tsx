import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import { PRODUCTS, type Product } from "../data/products";
import { decantPrice } from "./catalog";

/** Позиція кошика. ml=null → повний об'єм; ml=число → розпив. */
export type CartLine = { id: number; ml: number | null; qty: number };
const keyOf = (id: number, ml: number | null) => `${id}:${ml ?? "full"}`;

type State = { lines: CartLine[]; fav: number[] };
type Action =
  | { t: "add"; id: number; ml: number | null; qty?: number }
  | { t: "setQty"; key: string; qty: number }
  | { t: "remove"; key: string }
  | { t: "clear" }
  | { t: "fav"; id: number };

function reducer(s: State, a: Action): State {
  switch (a.t) {
    case "add": {
      const i = s.lines.findIndex((l) => keyOf(l.id, l.ml) === keyOf(a.id, a.ml));
      const lines = [...s.lines];
      if (i >= 0) lines[i] = { ...lines[i], qty: lines[i].qty + (a.qty ?? 1) };
      else lines.push({ id: a.id, ml: a.ml, qty: a.qty ?? 1 });
      return { ...s, lines };
    }
    case "setQty": {
      const lines = s.lines
        .map((l) => (keyOf(l.id, l.ml) === a.key ? { ...l, qty: a.qty } : l))
        .filter((l) => l.qty > 0);
      return { ...s, lines };
    }
    case "remove":
      return { ...s, lines: s.lines.filter((l) => keyOf(l.id, l.ml) !== a.key) };
    case "clear":
      return { ...s, lines: [] };
    case "fav":
      return { ...s, fav: s.fav.includes(a.id) ? s.fav.filter((x) => x !== a.id) : [...s.fav, a.id] };
    default:
      return s;
  }
}

const prod = (id: number) => PRODUCTS.find((p) => p.id === id);
export const linePrice = (p: Product, ml: number | null) => (ml ? decantPrice(p, ml) : p.price);

export type CartRow = CartLine & { key: string; product: Product; unit: number; sum: number };

type Ctx = {
  rows: CartRow[];
  count: number;
  total: number;
  add: (id: number, ml?: number | null, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  fav: Set<number>;
  toggleFav: (id: number) => void;
  inCart: (id: number) => boolean;
};

const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { lines: [], fav: [] });

  const value = useMemo<Ctx>(() => {
    const rows: CartRow[] = state.lines.flatMap((l) => {
      const product = prod(l.id);
      if (!product) return [];
      const unit = linePrice(product, l.ml);
      return [{ ...l, key: keyOf(l.id, l.ml), product, unit, sum: unit * l.qty }];
    });
    const inCartSet = new Set(state.lines.map((l) => l.id));
    return {
      rows,
      count: rows.reduce((n, r) => n + r.qty, 0),
      total: rows.reduce((n, r) => n + r.sum, 0),
      add: (id, ml = null, qty = 1) => dispatch({ t: "add", id, ml, qty }),
      setQty: (key, qty) => dispatch({ t: "setQty", key, qty }),
      remove: (key) => dispatch({ t: "remove", key }),
      clear: () => dispatch({ t: "clear" }),
      fav: new Set(state.fav),
      toggleFav: (id) => dispatch({ t: "fav", id }),
      inCart: (id) => inCartSet.has(id),
    };
  }, [state]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

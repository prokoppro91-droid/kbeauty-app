import { motion } from "framer-motion";
import { Plus, Check, Heart, FlaskConical } from "lucide-react";
import type { Product } from "../data/products";
import { emojiFor, canDecant, discPct, catName, uah } from "../lib/catalog";

const badgeLabel: Record<string, string> = { hit: "Хіт", new: "Новинка", pro: "Преміум" };

export function ProductCard({
  p,
  inCart = false,
  faved = false,
  onAdd,
  onFav,
  onOpen,
}: {
  p: Product;
  inCart?: boolean;
  faved?: boolean;
  onAdd?: (id: number) => void;
  onFav?: (id: number) => void;
  onOpen?: (id: number) => void;
}) {
  const discount = discPct(p);
  const decant = canDecant(p);

  return (
    <motion.article
      className="glass group relative flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] shadow-[var(--e-2)]"
      whileHover={{ y: -6, boxShadow: "var(--e-3)" }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
    >
      {/* зображення / емодзі-фолбек */}
      <button
        type="button"
        onClick={() => onOpen?.(p.id)}
        className="relative block h-[184px] w-full overflow-hidden bg-[radial-gradient(120%_95%_at_50%_0%,var(--brand-soft)_0%,transparent_62%),linear-gradient(135deg,var(--accent-soft),var(--surface-2))] text-left"
        aria-label={`Відкрити ${p.name}`}
      >
        <span className="absolute inset-0 grid place-items-center text-[46px] transition-transform duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.08]">
          {emojiFor(p)}
        </span>

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-[var(--r-pill)] bg-[#e74c3c] px-2 py-1 text-[10px] font-extrabold tracking-wide text-white shadow-[0_4px_12px_rgba(231,76,60,.32)]">
            −{discount}%
          </span>
        )}
        <span className="glass absolute bottom-3 left-3 rounded-[var(--r-pill)] px-2.5 py-1 text-[11px] font-bold text-ink">
          {p.brand}
        </span>
        {p.badge && <span className={`badge badge--${p.badge} absolute right-3 top-3`}>{badgeLabel[p.badge] ?? p.badge}</span>}

        <span className="pointer-events-none absolute bottom-3 right-3 translate-y-2 rounded-[var(--r-pill)] bg-[rgba(43,38,34,.86)] px-3 py-1.5 text-[11.5px] font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 max-[760px]:hidden">
          👁 Швидкий перегляд
        </span>
      </button>

      {/* тіло */}
      <div className="flex flex-1 flex-col p-[var(--sp-4)]">
        <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--brand-strong)]">
          {catName(p.cat)}
        </span>
        <h3
          onClick={() => onOpen?.(p.id)}
          className="mt-0.5 cursor-pointer font-display text-[15px] font-semibold leading-snug text-ink"
        >
          {p.name}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-[12px] text-muted">
          <span>{p.vol}</span>
          {decant && (
            <span className="inline-flex items-center gap-1 rounded-[var(--r-pill)] border border-[#bfe3d2] bg-mint px-2 py-0.5 text-[10px] font-extrabold text-[var(--ok)]">
              <FlaskConical size={11} /> на розпив
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-3">
          <div className="flex-1 font-display text-[20px] font-bold text-ink">
            {uah(p.price)} <span className="text-[13px] font-semibold text-muted">грн</span>
            {p.old && <span className="ml-1.5 text-[13px] font-normal text-[#b9aa92] line-through">{uah(p.old)}</span>}
          </div>

          <motion.button
            type="button"
            onClick={() => onFav?.(p.id)}
            whileTap={{ scale: 0.85 }}
            aria-label={faved ? "Прибрати з обраного" : "В обране"}
            className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${faved ? "text-[var(--fav)]" : "text-[#dac9bc] hover:text-[var(--fav)]"}`}
          >
            <Heart size={18} className={faved ? "fill-[var(--fav)]" : ""} />
          </motion.button>

          <motion.button
            type="button"
            onClick={() => onAdd?.(p.id)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            aria-label={inCart ? "У кошику" : "Додати в кошик"}
            className={`grid h-[44px] w-[44px] place-items-center rounded-[var(--r-md)] text-[var(--on-brand)] transition-colors ${inCart ? "bg-mint !text-[var(--ok)]" : "shadow-[var(--glow)]"}`}
            style={inCart ? undefined : { background: "var(--grad-brand)" }}
          >
            {inCart ? <Check size={20} /> : <Plus size={20} />}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

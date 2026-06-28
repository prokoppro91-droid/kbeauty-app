import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check, Heart } from "lucide-react";
import type { Product } from "../data/products";
import { emojiFor, canDecant, discPct, catName, uah } from "../lib/catalog";

export const imgSrc = (id: number) => `${import.meta.env.BASE_URL}img/p${id}.webp`;

const badgeLabel: Record<string, string> = { hit: "Бестселер", new: "Новинка", pro: "Преміум" };

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
  const [imgOk, setImgOk] = useState(true);

  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-[var(--r-lg)] bg-snow"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.344, ease: "easeOut" }}
    >
      {/* зображення на fog */}
      <button
        type="button"
        onClick={() => onOpen?.(p.id)}
        className="relative block aspect-square w-full overflow-hidden bg-fog text-left"
        aria-label={`Відкрити ${p.name}`}
      >
        {imgOk ? (
          <img
            src={imgSrc(p.id)}
            alt={p.name}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-[72px] transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]">
            {emojiFor(p)}
          </span>
        )}
        {p.badge && (
          <span className={`badge badge--${p.badge} absolute left-5 top-5`}>{badgeLabel[p.badge] ?? p.badge}</span>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onFav?.(p.id); }}
          aria-label={faved ? "Прибрати з обраного" : "В обране"}
          className={`absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full transition-colors ${faved ? "text-[var(--fav)]" : "text-graphite hover:text-ink"}`}
        >
          <Heart size={18} className={faved ? "fill-[var(--fav)]" : ""} />
        </button>
      </button>

      {/* тіло */}
      <div className="flex flex-1 flex-col gap-1 px-5 pb-5 pt-4">
        <span className="text-[12px] font-medium text-graphite">{p.brand}</span>
        <h3
          onClick={() => onOpen?.(p.id)}
          className="cursor-pointer text-[17px] font-semibold leading-snug text-ink"
          style={{ letterSpacing: "-0.36px" }}
        >
          {p.name}
        </h3>
        <span className="text-[13px] text-graphite">
          {catName(p.cat)} · {p.vol}{decant ? " · на розпив" : ""}
        </span>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <span className="text-[19px] font-semibold text-ink">{uah(p.price)} грн</span>
            {p.old && (
              <span className="ml-2 text-[13px] text-graphite line-through">{uah(p.old)}</span>
            )}
            {discount > 0 && <span className="ml-2 text-[13px] font-semibold text-[#b64400]">−{discount}%</span>}
          </div>
          <motion.button
            type="button"
            onClick={() => onAdd?.(p.id)}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
            aria-label={inCart ? "У кошику" : "Додати в кошик"}
            className={`grid h-9 w-9 place-items-center rounded-full text-white transition-colors ${inCart ? "bg-ink" : "bg-brand hover:bg-[#0077ed]"}`}
          >
            {inCart ? <Check size={18} /> : <Plus size={18} />}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

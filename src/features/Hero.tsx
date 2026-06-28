import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../components/ui/Button";
import { PRODUCTS } from "../data/products";
import { emojiFor, uah } from "../lib/catalog";

const featured = PRODUCTS.find((p) => p.badge === "hit") ?? PRODUCTS[0];
const reveal = (d = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: d, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const },
});

export function Hero({ onCta }: { onCta: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yProd = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const scaleProd = useTransform(scrollYProgress, [0, 1], [1, 1.18]);

  return (
    <section ref={ref} className="band-snow relative overflow-hidden text-center">
      <div className="wrap flex flex-col items-center" style={{ paddingTop: "clamp(56px,9vw,120px)" }}>
        <motion.p {...reveal(0)} className="overline mb-3">{featured.brand} · новинка сезону</motion.p>
        <motion.h1 {...reveal(0.06)} className="t-display measure-wide">
          Сяйво вашої шкіри
        </motion.h1>
        <motion.p {...reveal(0.14)} className="t-lead measure mt-4">
          Преміальна корея від косметолога. Догляд і професійні засоби, можливість придбати
          на розпив, доставка по Україні та за кордон.
        </motion.p>
        <motion.div {...reveal(0.22)} className="mt-7 flex flex-wrap items-center justify-center gap-5">
          <Button variant="primary" size="lg" onClick={onCta}>Купити</Button>
          <button onClick={onCta} className="btn btn--ghost btn--lg">Дізнатися більше ›</button>
        </motion.div>
      </div>

      {/* товар «виходить» за згин */}
      <motion.div style={{ y: yProd, scale: scaleProd }} className="relative mx-auto grid place-items-center"
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
        <div className="grid h-[clamp(260px,40vw,440px)] w-full place-items-center">
          <span className="text-[clamp(140px,24vw,300px)] leading-none">{emojiFor(featured)}</span>
        </div>
        <motion.div {...reveal(0.5)} className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-[var(--r-lg)] bg-snow/90 px-5 py-3 text-left backdrop-blur"
          style={{ boxShadow: "var(--e-3)" }}>
          <p className="text-[12px] font-medium text-graphite">{featured.brand}</p>
          <p className="text-[15px] font-semibold text-ink">{featured.name}</p>
          <p className="text-[15px] font-semibold text-ink">від {uah(featured.price)} грн</p>
        </motion.div>
      </motion.div>
    </section>
  );
}

import { motion } from "framer-motion";
import { FlaskConical, Plane, BadgeCheck, Sparkles } from "lucide-react";
import { PRODUCTS } from "../data/products";
import { emojiFor } from "../lib/catalog";

const rise = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.344, ease: "easeOut" as const },
};

const pickDecant = PRODUCTS.find((p) => p.cat === "serum") ?? PRODUCTS[0];

/** Смуга-розповідь: розпив (text 40% / visual 60%) на fog */
export function DecantFeature({ onCta }: { onCta: () => void }) {
  return (
    <section id="feature-decant" className="band-fog">
      <div className="wrap section grid items-center gap-10 md:grid-cols-[40%_60%]">
        <motion.div {...rise}>
          <p className="overline mb-3">Розпив 5–50 мл</p>
          <h2 className="t-h1">Спробуйте перед повним об'ємом.</h2>
          <p className="t-lead mt-4 measure">
            Креми, сироватки, тонери й гелі — у фірмовому флаконі з підписом. Ідеально, щоб
            підібрати догляд без переплати за велику банку.
          </p>
          <button onClick={onCta} className="btn btn--ghost mt-5 px-0">Обрати на розпив ›</button>
        </motion.div>
        <motion.div {...rise} className="grid place-items-center">
          <div className="grid aspect-[4/3] w-full place-items-center rounded-[var(--r-lg)] bg-snow">
            <span className="text-[clamp(120px,16vw,200px)]">{emojiFor(pickDecant)}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** Темна сцена: професійний догляд */
export function ProStage({ onCta }: { onCta: () => void }) {
  const pro = PRODUCTS.find((p) => p.group === "pro") ?? PRODUCTS[0];
  return (
    <section id="feature-pro" className="band-dark">
      <div className="wrap section text-center">
        <motion.p {...rise} className="mb-3 text-[17px] font-semibold text-[#2997ff]">Професійна косметологія</motion.p>
        <motion.h2 {...rise} className="t-h1" style={{ color: "#f5f5f7" }}>Засоби, яким довіряють кабінети.</motion.h2>
        <motion.p {...rise} className="t-lead mx-auto mt-4 measure" style={{ color: "#a1a1a6" }}>
          Пілінги, ампули та активи салонного рівня — з підбором від косметолога.
        </motion.p>
        <motion.div {...rise} className="mt-10 grid place-items-center">
          <span className="text-[clamp(140px,22vw,260px)] leading-none">{emojiFor(pro)}</span>
        </motion.div>
        <motion.div {...rise}>
          <button onClick={onCta} className="btn btn--primary btn--lg mt-2">Перейти до професійного</button>
        </motion.div>
      </div>
    </section>
  );
}

/** Bento-сітка переваг */
export function Bento() {
  const tiles = [
    { icon: BadgeCheck, t: "Лише оригінал", d: "Уся косметика в оригінальній упаковці. Розпив — у фірмовому флаконі.", cls: "bg-snow" },
    { icon: Plane, t: "Доставка за кордон", d: "Відправка по Україні та світу після повної оплати.", cls: "bg-snow" },
    { icon: FlaskConical, t: "Розпив 5–50 мл", d: "Тестуйте догляд маленькими об'ємами.", cls: "bg-snow" },
    { icon: Sparkles, t: "Кураторський відбір", d: "Кожен засіб обрано косметологом особисто.", cls: "bg-snow" },
  ];
  return (
    <section className="band-snow">
      <div className="wrap section">
        <motion.h2 {...rise} className="t-h2 mb-8">Чому K-Beauty Profi</motion.h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile, i) => (
            <motion.div key={tile.t} {...rise} transition={{ duration: 0.344, ease: "easeOut", delay: i * 0.05 }}
              className={`flex flex-col gap-3 rounded-[var(--r-lg)] ${tile.cls} p-7`} style={{ background: "var(--fog)" }}>
              <tile.icon size={26} className="text-brand" strokeWidth={1.75} />
              <h3 className="text-[19px] font-semibold text-ink" style={{ letterSpacing: "-0.4px" }}>{tile.t}</h3>
              <p className="text-[14px] leading-relaxed text-graphite">{tile.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* ───────────── фонова сцена (повноекранний градієнт, що проявляється) ───────────── */
function Bg({ p, range, gradient }: { p: MotionValue<number>; range: [number, number, number, number]; gradient: string }) {
  const opacity = useTransform(p, range, [0, 1, 1, 0]);
  return <motion.div className="absolute inset-0" style={{ opacity, background: gradient }} />;
}

/* ───────────── об'єкт, що левітує з паралаксом ───────────── */
function Floaty({
  p, emoji, left, top, drift, size, spin = 0,
}: { p: MotionValue<number>; emoji: string; left: number; top: number; drift: number; size: number; spin?: number }) {
  const y = useTransform(p, [0, 1], [0, drift]);
  const rotate = useTransform(p, [0, 1], [0, spin]);
  return (
    <motion.span
      className="pointer-events-none absolute select-none"
      style={{ left: `${left}%`, top: `${top}%`, y, rotate, fontSize: size, filter: "drop-shadow(0 20px 40px rgba(0,0,0,.35))" }}
      animate={{ translateY: [0, -14, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {emoji}
    </motion.span>
  );
}

/* ───────────── текст сцени (проявляється у своєму діапазоні) ───────────── */
function Scene({
  p, range, light = true, children,
}: { p: MotionValue<number>; range: [number, number, number, number]; light?: boolean; children: ReactNode }) {
  const opacity = useTransform(p, range, [0, 1, 1, 0]);
  const y = useTransform(p, [range[0], range[3]], [50, -50]);
  return (
    <motion.div
      className="absolute inset-0 grid place-items-center px-6 text-center"
      style={{ opacity, y, color: light ? "#fffdf9" : "#1a1320" }}
    >
      <div className="max-w-[760px]">{children}</div>
    </motion.div>
  );
}

const serif = { fontFamily: '"Fraunces",Georgia,serif', fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.05 };

export function Cinematic({ onEnd }: { onEnd: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // індикатор скролу зникає після старту
  const cue = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <div ref={ref} style={{ height: "560vh", position: "relative", background: "#0d0a14" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* фонові сцени, що перетікають */}
        <Bg p={p} range={[0, 0, 0.20, 0.28]} gradient="radial-gradient(130% 110% at 50% 130%, #3a2a4f 0%, #1a1326 45%, #0a0710 100%)" />
        <Bg p={p} range={[0.20, 0.28, 0.42, 0.50]} gradient="linear-gradient(180deg,#f7d9e6 0%,#e6d4f3 45%,#ffe0c9 100%)" />
        <Bg p={p} range={[0.42, 0.50, 0.64, 0.72]} gradient="linear-gradient(180deg,#cfeee9 0%,#7fc6c9 45%,#327f95 100%)" />
        <Bg p={p} range={[0.64, 0.72, 1, 1]} gradient="linear-gradient(180deg,#1e5286 0%,#0c2c4d 55%,#06182e 100%)" />

        {/* промені світла для підводної сцени */}
        <motion.div className="absolute inset-0 mix-blend-screen"
          style={{ opacity: useTransform(p, [0.64, 0.78], [0, 0.5]),
            background: "repeating-linear-gradient(105deg, rgba(255,255,255,.10) 0 2px, transparent 2px 60px)" }} />

        {/* об'єкти, що левітують */}
        <Floaty p={p} emoji="🧴" left={16} top={26} drift={-360} size={64} spin={18} />
        <Floaty p={p} emoji="💧" left={74} top={20} drift={-520} size={52} spin={-22} />
        <Floaty p={p} emoji="🌸" left={28} top={62} drift={-680} size={58} spin={30} />
        <Floaty p={p} emoji="🧫" left={66} top={70} drift={-840} size={50} spin={-16} />
        <Floaty p={p} emoji="🫧" left={45} top={40} drift={-600} size={44} spin={12} />
        <Floaty p={p} emoji="🌿" left={84} top={56} drift={-760} size={54} spin={-26} />
        <Floaty p={p} emoji="✨" left={9} top={48} drift={-500} size={40} spin={20} />
        <Floaty p={p} emoji="🧪" left={56} top={86} drift={-900} size={48} spin={-18} />

        {/* бренд */}
        <div className="absolute left-1/2 top-7 z-10 -translate-x-1/2 text-[13px] font-semibold tracking-[0.35em] text-white/90">
          K · BEAUTY · PROFI
        </div>

        {/* тексти сцен */}
        <Scene p={p} range={[0, 0.02, 0.18, 0.26]}>
          <p className="mb-5 text-[13px] uppercase tracking-[0.3em] text-white/70">Корейський догляд</p>
          <h1 style={serif} className="text-[clamp(44px,8vw,104px)]">Сяйво<br />починається тут</h1>
          <p className="mt-6 text-[clamp(15px,2vw,19px)] text-white/75">Преміальна корея від косметолога</p>
        </Scene>

        <Scene p={p} range={[0.22, 0.30, 0.40, 0.48]} light={false}>
          <h2 style={serif} className="text-[clamp(36px,6.5vw,80px)]">Догляд, що справді працює</h2>
          <p className="mt-5 text-[clamp(15px,2vw,19px)] text-[#5a4a55]">Кожен засіб обрано особисто — без випадкових позицій</p>
        </Scene>

        <Scene p={p} range={[0.44, 0.52, 0.62, 0.70]}>
          <h2 style={serif} className="text-[clamp(36px,6.5vw,80px)]">Можна на розпив</h2>
          <p className="mt-5 text-[clamp(15px,2vw,19px)] text-white/80">5 · 10 · 20 · 30 · 50 мл — спробуйте перед повним об'ємом</p>
        </Scene>

        <Scene p={p} range={[0.66, 0.74, 0.92, 1]}>
          <h2 style={serif} className="text-[clamp(36px,6.5vw,80px)]">Професійна косметологія</h2>
          <p className="mt-5 text-[clamp(15px,2vw,19px)] text-white/80">Засоби салонного рівня — з підбором під вашу шкіру</p>
          <button onClick={onEnd}
            className="mt-9 inline-flex h-12 items-center rounded-full border border-white/40 bg-white/10 px-8 text-[15px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/20">
            Перейти до каталогу ↓
          </button>
        </Scene>

        {/* індикатор скролу */}
        <motion.div style={{ opacity: cue }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70">
          <span className="text-[12px] uppercase tracking-[0.3em]">гортайте вниз</span>
        </motion.div>
      </div>
    </div>
  );
}

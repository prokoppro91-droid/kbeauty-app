import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, type MotionValue } from "framer-motion";

const asset = (n: string) => `${import.meta.env.BASE_URL}img/${n}`;

/* повноекранна сцена: фото, що ВХОДИТЬ розмитим→різким і ВИХОДИТЬ назад у розмиття,
   з безперервним push-in зумом — кадри плавно перетікають один в одний */
function SceneBg({
  p, range, src,
}: { p: MotionValue<number>; range: [number, number, number, number]; src: string }) {
  const opacity = useTransform(p, range, [0, 1, 1, 0]);
  // розмиття на краях переходу → різкість у центрі активності сцени
  const blurPx = useTransform(p, range, [24, 0, 0, 24]);
  const blur = useMotionTemplate`blur(${blurPx}px)`;
  // безперервний зум упродовж усього життя сцени (повільний дрейф)
  const scale = useTransform(p, [range[0], range[3]], [1.22, 1.02]);
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <motion.img src={src} alt="" className="h-full w-full object-cover" style={{ scale, filter: blur }} />
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(180deg,rgba(8,6,12,.5) 0%,rgba(8,6,12,.22) 38%,rgba(8,6,12,.66) 100%)" }} />
    </motion.div>
  );
}

/* текст сцени (білий, проявляється у діапазоні) */
function Scene({ p, range, children }: { p: MotionValue<number>; range: [number, number, number, number]; children: ReactNode }) {
  const opacity = useTransform(p, range, [0, 1, 1, 0]);
  const y = useTransform(p, [range[0], range[3]], [70, -70]);
  const blurPx = useTransform(p, range, [12, 0, 0, 12]);
  const blur = useMotionTemplate`blur(${blurPx}px)`;
  return (
    <motion.div className="absolute inset-0 grid place-items-center px-6 text-center text-white" style={{ opacity, y, filter: blur }}>
      <div className="max-w-[820px]" style={{ textShadow: "0 2px 40px rgba(0,0,0,.5)" }}>{children}</div>
    </motion.div>
  );
}

const serif = { fontFamily: '"Fraunces",Georgia,serif', fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.04 };

export function Cinematic({ onEnd }: { onEnd: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const cue = useTransform(p, [0, 0.05], [1, 0]);
  const endFade = useTransform(p, [0.95, 1], [0, 1]);

  return (
    <div ref={ref} style={{ height: "640vh", position: "relative", background: "#0a0710" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* сцени з довгими зонами перетікання (фейд+розмиття накладаються) */}
        <SceneBg p={p} range={[0, 0, 0.14, 0.28]} src={asset("scene0.webp")} />
        <SceneBg p={p} range={[0.14, 0.28, 0.40, 0.54]} src={asset("scene1.webp")} />
        <SceneBg p={p} range={[0.40, 0.54, 0.64, 0.78]} src={asset("scene2.webp")} />
        <SceneBg p={p} range={[0.64, 0.78, 1, 1]} src={asset("scene3.webp")} />

        {/* постійна віньєтка — тримає кадри візуально разом */}
        <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 220px 50px rgba(0,0,0,.45)" }} />

        {/* бренд */}
        <div className="absolute left-1/2 top-7 z-10 -translate-x-1/2 text-[13px] font-semibold tracking-[0.35em] text-white/90">
          K · BEAUTY · PROFI
        </div>

        {/* тексти сцен — проявляються лише коли сцена «у фокусі» */}
        <Scene p={p} range={[0, 0.03, 0.12, 0.24]}>
          <p className="mb-5 text-[13px] uppercase tracking-[0.3em] text-white/75">Корейський догляд</p>
          <h1 style={serif} className="text-[clamp(46px,8.5vw,112px)]">Сяйво<br />починається тут</h1>
          <p className="mt-7 text-[clamp(15px,2vw,20px)] text-white/80">Преміальна корея від косметолога</p>
        </Scene>

        <Scene p={p} range={[0.22, 0.31, 0.40, 0.50]}>
          <h2 style={serif} className="text-[clamp(38px,7vw,88px)]">Догляд, що справді працює</h2>
          <p className="mt-5 text-[clamp(15px,2vw,20px)] text-white/80">Кожен засіб обрано особисто — без випадкових позицій</p>
        </Scene>

        <Scene p={p} range={[0.48, 0.57, 0.64, 0.74]}>
          <h2 style={serif} className="text-[clamp(38px,7vw,88px)]">Можна на розпив</h2>
          <p className="mt-5 text-[clamp(15px,2vw,20px)] text-white/80">5 · 10 · 20 · 30 · 50 мл — спробуйте перед повним об'ємом</p>
        </Scene>

        <Scene p={p} range={[0.72, 0.82, 0.94, 1]}>
          <h2 style={serif} className="text-[clamp(38px,7vw,88px)]">Професійна косметологія</h2>
          <p className="mt-5 text-[clamp(15px,2vw,20px)] text-white/80">Засоби салонного рівня — з підбором під вашу шкіру</p>
          <button onClick={onEnd}
            className="mt-9 inline-flex h-12 items-center rounded-full border border-white/40 bg-white/10 px-8 text-[15px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/20">
            Перейти до каталогу ↓
          </button>
        </Scene>

        {/* індикатор скролу */}
        <motion.div style={{ opacity: cue }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/75">
          <span className="text-[12px] uppercase tracking-[0.3em]">гортайте вниз</span>
        </motion.div>

        {/* плавне розчинення у каталог */}
        <motion.div className="pointer-events-none absolute inset-0 bg-fog" style={{ opacity: endFade }} />
      </div>
    </div>
  );
}

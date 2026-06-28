import { useEffect, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* Безперервний «один кадр»: послідовність кадрів малюється на canvas за скролом
   (техніка Apple) — масляно-гладке скрабування без ривків відео-кодека. */
const FRAMES = 109;
const frameSrc = (i: number) => `${import.meta.env.BASE_URL}cine/f${String(i).padStart(3, "0")}.webp`;

/* текст сцени поверх полотна */
function TextScene({
  p, range, children,
}: { p: MotionValue<number>; range: [number, number, number, number]; children: ReactNode }) {
  const opacity = useTransform(p, range, [0, 1, 1, 0]);
  const y = useTransform(p, [range[0], range[3]], [60, -60]);
  return (
    <motion.div className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center text-white"
      style={{ opacity, y }}>
      <div className="pointer-events-auto max-w-[820px]" style={{ textShadow: "0 2px 44px rgba(0,0,0,.55)" }}>
        {children}
      </div>
    </motion.div>
  );
}

const serif = { fontFamily: '"Fraunces",Georgia,serif', fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.04 };

export function Cinematic({ onEnd }: { onEnd: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgsRef = useRef<HTMLImageElement[]>([]);
  const target = useRef(0); // цільовий кадр (float)
  const cur = useRef(0);    // поточний згладжений кадр
  const lastDrawn = useRef(-1);
  const dirty = useRef(true);

  const { scrollYProgress: p } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const cue = useTransform(p, [0, 0.05], [1, 0]);
  const endFade = useTransform(p, [0.95, 1], [0, 1]);

  // прелоад усіх кадрів
  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAMES; i++) {
      const im = new Image();
      im.src = frameSrc(i);
      im.onload = () => { dirty.current = true; };
      imgs.push(im);
    }
    imgsRef.current = imgs;
  }, []);

  // canvas + цикл малювання
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty.current = true;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawCover = (im: HTMLImageElement) => {
      const cw = window.innerWidth, ch = window.innerHeight;
      const iw = im.naturalWidth, ih = im.naturalHeight;
      const s = Math.max(cw / iw, ch / ih);
      const w = iw * s, h = ih * s;
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const tick = () => {
      cur.current += (target.current - cur.current) * 0.18; // плавне доганяння
      const idx = Math.round(cur.current);
      if (idx !== lastDrawn.current || dirty.current) {
        const im = imgsRef.current[idx];
        if (im && im.complete && im.naturalWidth) {
          drawCover(im);
          lastDrawn.current = idx;
          dirty.current = false;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const setTarget = (v: number) => { target.current = Math.max(0, Math.min(FRAMES - 1, v * (FRAMES - 1))); };
    const unsub = p.on("change", setTarget);
    setTarget(p.get());
    cur.current = target.current;

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); unsub(); };
  }, [p]);

  return (
    <div ref={wrapRef} style={{ height: "640vh", position: "relative", background: "#0a0710" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* скрім для читабельності тексту — темніша центральна смуга під заголовок */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg,rgba(8,6,12,.6) 0%,rgba(8,6,12,.18) 24%,rgba(8,6,12,.55) 50%,rgba(8,6,12,.18) 76%,rgba(8,6,12,.66) 100%)" }} />

        {/* бренд */}
        <div className="absolute left-1/2 top-7 z-10 -translate-x-1/2 text-[13px] font-semibold tracking-[0.35em] text-white/90">
          K · BEAUTY · PROFI
        </div>

        {/* тексти, прив'язані до кадрів */}
        <TextScene p={p} range={[0, 0.03, 0.13, 0.21]}>
          <p className="mb-5 text-[13px] uppercase tracking-[0.3em] text-white/75">Корейський догляд</p>
          <h1 style={serif} className="text-[clamp(46px,8.5vw,112px)]">Сяйво<br />починається тут</h1>
          <p className="mt-7 text-[clamp(15px,2vw,20px)] text-white/80">Преміальна корея від косметолога</p>
        </TextScene>

        <TextScene p={p} range={[0.21, 0.28, 0.34, 0.42]}>
          <h2 style={serif} className="text-[clamp(38px,7vw,88px)]">Можна на розпив</h2>
          <p className="mt-5 text-[clamp(15px,2vw,20px)] text-white/80">5 · 10 · 20 · 30 · 50 мл — спробуйте перед повним об'ємом</p>
        </TextScene>

        <TextScene p={p} range={[0.42, 0.49, 0.55, 0.62]}>
          <h2 style={serif} className="text-[clamp(38px,7vw,88px)]">Догляд, що справді працює</h2>
          <p className="mt-5 text-[clamp(15px,2vw,20px)] text-white/80">Кожен засіб обрано особисто — без випадкових позицій</p>
        </TextScene>

        <TextScene p={p} range={[0.62, 0.69, 0.74, 0.80]}>
          <h2 style={serif} className="text-[clamp(38px,7vw,88px)]">Чисте сяйво щодня</h2>
          <p className="mt-5 text-[clamp(15px,2vw,20px)] text-white/80">Ритуал очищення — основа здорової шкіри</p>
        </TextScene>

        <TextScene p={p} range={[0.80, 0.88, 0.95, 1]}>
          <h2 style={serif} className="text-[clamp(38px,7vw,88px)]">Професійна косметологія</h2>
          <p className="mt-5 text-[clamp(15px,2vw,20px)] text-white/80">Засоби салонного рівня — з підбором під вашу шкіру</p>
          <button onClick={onEnd}
            className="pointer-events-auto mt-9 inline-flex h-12 items-center rounded-full border border-white/40 bg-white/10 px-8 text-[15px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/20">
            Перейти до каталогу ↓
          </button>
        </TextScene>

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

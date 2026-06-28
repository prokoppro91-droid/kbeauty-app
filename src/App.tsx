import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./components/ui/Button";
import { Navbar } from "./components/Navbar";
import { Catalog } from "./features/Catalog";
import { CartDrawer } from "./components/CartDrawer";
import { ProductModal } from "./components/ProductModal";
import { Checkout } from "./components/Checkout";
import type { Product } from "./data/products";

const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: 0.06 * i, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] as const },
  }),
};

function App() {
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [modal, setModal] = useState<Product | null>(null);

  return (
    <div id="top">
      <Navbar query={query} onQuery={setQuery} onCart={() => setCartOpen(true)} />

      <main className="wrap section stack" style={{ gap: "var(--sp-16)" }}>
        {/* герой */}
        <section className="relative overflow-hidden rounded-[var(--r-xl)] border border-[var(--glass-brd)]"
          style={{ backgroundImage: "var(--grad-hero)", paddingBlock: "clamp(48px,8vw,104px)", paddingInline: "clamp(20px,5vw,64px)" }}>
          {/* плаваючі блоби */}
          <span className="blob" style={{ width: 260, height: 260, top: -60, left: -40, background: "var(--brand)" }} />
          <span className="blob" style={{ width: 220, height: 220, bottom: -50, right: -30, background: "var(--accent)", animationDelay: "1.5s" }} />
          <span className="blob" style={{ width: 160, height: 160, top: 40, right: 120, background: "var(--peach)", animationDelay: "3s" }} />

          <div className="relative stack" style={{ gap: "var(--sp-5)", maxWidth: 680 }}>
            <motion.span className="overline inline-flex w-fit items-center gap-2 rounded-[var(--r-pill)] glass px-4 py-2"
              variants={fadeUp} custom={0} initial="hidden" animate="show">
              ✨ Корейський догляд · кураторський відбір
            </motion.span>
            <motion.h1 className="t-display" variants={fadeUp} custom={1} initial="hidden" animate="show">
              Сяйво вашої шкіри <span className="text-gradient">починається тут</span>
            </motion.h1>
            <motion.p className="t-lead measure" variants={fadeUp} custom={2} initial="hidden" animate="show">
              Преміальна корея від косметолога: догляд і професійні засоби. Можна придбати
              на розпив, доставка по Україні та за кордон.
            </motion.p>
            <motion.div className="row" style={{ gap: "var(--sp-3)", flexWrap: "wrap" }}
              variants={fadeUp} custom={3} initial="hidden" animate="show">
              <Button variant="primary" size="lg" onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>
                ✨ До каталогу
              </Button>
              <Button variant="ghost" size="lg">Підібрати догляд →</Button>
            </motion.div>
          </div>
        </section>

        {/* каталог */}
        <Catalog query={query} onOpen={setModal} />

        <footer className="t-small text-muted" style={{ paddingBottom: "var(--sp-8)" }}>
          K-Beauty Profi — нова React-основа. Жива версія сайту працює окремо.
        </footer>
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => setCheckoutOpen(true)} />
      <ProductModal product={modal} onClose={() => setModal(null)} />
      <Checkout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}

export default App;

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

      <main className="wrap section stack" style={{ gap: "var(--sp-12)" }}>
        {/* герой */}
        <section className="stack" style={{ gap: "var(--sp-4)", paddingTop: "var(--sp-6)" }}>
          <motion.span className="overline" variants={fadeUp} custom={0} initial="hidden" animate="show">
            Корейський догляд · Quiet Luxury
          </motion.span>
          <motion.h1 className="t-display measure-wide" variants={fadeUp} custom={1} initial="hidden" animate="show">
            Преміальна корея <em style={{ color: "var(--brand-strong)" }}>з підбором</em> під вашу шкіру
          </motion.h1>
          <motion.p className="t-lead measure" variants={fadeUp} custom={2} initial="hidden" animate="show">
            Кураторський каталог від косметолога: догляд і професійні засоби. Можливість придбати
            на розпив, доставка по Україні та за кордон.
          </motion.p>
          <motion.div className="row" style={{ gap: "var(--sp-3)", flexWrap: "wrap" }}
            variants={fadeUp} custom={3} initial="hidden" animate="show">
            <Button variant="primary" size="lg" onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}>
              ✨ До каталогу
            </Button>
            <Button variant="ghost" size="lg">Підібрати догляд →</Button>
          </motion.div>
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

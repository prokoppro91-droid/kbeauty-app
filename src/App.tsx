import { useMemo, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Cinematic } from "./features/Cinematic";
import { Shelf } from "./components/Shelf";
import { DecantFeature, ProStage, Bento } from "./features/Features";
import { Catalog } from "./features/Catalog";
import { CartDrawer } from "./components/CartDrawer";
import { ProductModal } from "./components/ProductModal";
import { Checkout } from "./components/Checkout";
import { PRODUCTS, type Product } from "./data/products";

function App() {
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [modal, setModal] = useState<Product | null>(null);

  const bestsellers = useMemo(() => PRODUCTS.filter((p) => p.badge === "hit").slice(0, 12), []);
  const novelties = useMemo(() => PRODUCTS.filter((p) => p.badge === "new").slice(0, 12), []);
  const toCatalog = () => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div id="top">
      <Cinematic onEnd={toCatalog} />

      <Navbar query={query} onQuery={setQuery} onCart={() => setCartOpen(true)} />

      <section className="band-snow">
        <div className="wrap section">
          <Shelf title="Бестселери" items={bestsellers} onOpen={setModal} />
        </div>
      </section>

      <DecantFeature onCta={toCatalog} />

      {novelties.length > 0 && (
        <section className="band-snow">
          <div className="wrap section">
            <Shelf title="Новинки" items={novelties} onOpen={setModal} />
          </div>
        </section>
      )}

      <ProStage onCta={toCatalog} />

      <Bento />

      <Catalog query={query} onOpen={setModal} />

      <footer className="band-snow border-t border-line">
        <div className="wrap py-10 text-[12px] leading-relaxed text-graphite">
          K-Beauty Profi — кураторський каталог корейського догляду від косметолога.
          Оплата повна, доставка по Україні та за кордон після оплати.
          <br />Нова React-основа · дизайн за системою Apple. Жива версія сайту працює окремо.
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => setCheckoutOpen(true)} />
      <ProductModal product={modal} onClose={() => setModal(null)} />
      <Checkout open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}

export default App;

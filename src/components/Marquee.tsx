export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee py-2">
      <div className="marquee__track">
        {row.map((b, i) => (
          <span key={i} className="flex items-center gap-[var(--sp-10)] text-[clamp(18px,2.4vw,30px)] font-bold text-[var(--text-subtle)]">
            {b}
            <span className="text-[var(--brand)]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

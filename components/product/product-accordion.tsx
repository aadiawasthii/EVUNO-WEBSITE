type ProductAccordionProps = {
  items: Array<{
    title: string;
    content: string;
  }>;
};

export function ProductAccordion({ items }: ProductAccordionProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details key={item.title} className="glass-panel group p-5">
          <summary className="cursor-pointer list-none text-sm uppercase tracking-[0.22em] text-mist">
            {item.title}
          </summary>
          <p className="mt-4 text-sm leading-7 text-steel">{item.content}</p>
        </details>
      ))}
    </div>
  );
}

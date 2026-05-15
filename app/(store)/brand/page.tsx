export const metadata = {
  title: "Brand"
};

const principles = [
  {
    title: "Evolution",
    description: "The brand language is built around iteration, discipline, and visible personal growth."
  },
  {
    title: "Identity",
    description: "Every silhouette is designed to feel like part of a future uniform rather than a disposable trend cycle."
  },
  {
    title: "Restraint",
    description: "Dark palettes, soft metallic accents, and exacting minimalism keep the presentation premium instead of loud."
  }
];

export default function BrandPage() {
  return (
    <section className="shell py-14 sm:py-20">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="section-frame p-8 sm:p-10 lg:p-12">
          <p className="eyebrow">Brand</p>
          <h1 className="mt-5 max-w-3xl text-4xl uppercase tracking-[0.14em] sm:text-5xl lg:text-6xl">
            EVUNO is streetwear for the version of you that is still under construction.
          </h1>
        </div>
        <div className="section-frame p-8 sm:p-10 lg:p-12">
          <p className="text-sm leading-8 text-steel">
            EVUNO stands at the intersection of self-improvement, future identity, and premium minimal design. The visual system leans cinematic and restrained so the garments feel sharp, not loud.
          </p>
          <p className="mt-5 text-sm leading-8 text-steel">
            Series 01 focuses the launch into one engineered silhouette because discipline starts with repetition. Three color systems. Better intent. Clearer signal.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {principles.map((principle) => (
          <article key={principle.title} className="glass-panel p-6">
            <p className="eyebrow">{principle.title}</p>
            <p className="mt-4 text-sm leading-7 text-steel">{principle.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export const metadata = {
  title: "About"
};

const principles = [
  {
    title: "Discipline",
    description: "EVUNO is built for people who treat progress like a practice and want clothing that feels sharp, calm, and intentional."
  },
  {
    title: "Identity",
    description: "The brand language centers one engineered silhouette and lets repetition turn it into a clearer personal uniform."
  },
  {
    title: "Restraint",
    description: "Dark palettes, reflective structure, and minimal technical detailing keep the system premium instead of loud."
  }
];

export default function AboutPage() {
  return (
    <section className="shell py-12 sm:py-20">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="section-frame p-6 sm:p-10 lg:p-12">
          <p className="eyebrow">About</p>
          <h1 className="mt-5 max-w-3xl text-[2.6rem] uppercase tracking-[0.12em] sm:text-5xl sm:tracking-[0.14em] lg:text-6xl">
            EVUNO is built around evolution, restraint, and future identity.
          </h1>
        </div>
        <div className="section-frame p-6 sm:p-10 lg:p-12">
          <p className="text-sm leading-8 text-steel">
            EVUNO sits between performance wear and elevated daily uniform. The system is minimal, technical, and disciplined so each piece feels intentional the moment it lands on body.
          </p>
          <p className="mt-5 text-sm leading-8 text-steel">
            Series 01 keeps the launch narrow on purpose: one engineered silhouette, three exact color systems, and a cleaner signal for people building the next version of themselves.
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

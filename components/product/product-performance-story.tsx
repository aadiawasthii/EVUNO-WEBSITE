import Image from "next/image";

import { series01Editorial } from "@/lib/catalog";
import type { StoreProduct } from "@/lib/storefront";

type ProductPerformanceStoryProps = {
  product: Pick<StoreProduct, "color" | "material" | "manufacturingNote">;
};

const performanceNotes = [
  {
    title: "Reflective back spine",
    body: "The vertical EVUNO spine detail catches light with a clean chrome read and gives the garment a sharper nighttime signature from behind."
  },
  {
    title: "Reflective shoulder hits",
    body: "The shoulder detailing is designed to stay subtle in daylight and come alive under direct light, keeping the look premium instead of loud."
  },
  {
    title: "Engineered breathability",
    body: "Mapped knit zones across the upper back and side body help release heat without disrupting the silhouette."
  },
  {
    title: "4-way recovery",
    body: "Stretch material is tuned to move through training, commuting, and repeat wear without losing shape."
  }
];

export function ProductPerformanceStory({ product }: ProductPerformanceStoryProps) {
  return (
    <section className="mt-8 grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
      <article className="section-frame overflow-hidden">
        <div className="relative aspect-[3/4]">
          <Image
            src={series01Editorial.performanceImageUrl}
            alt="Series 01 performance editorial study shown in Onyx"
            fill
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-cover"
          />
        </div>
      </article>

      <div className="space-y-4">
        <div className="glass-panel p-6 sm:p-7">
          <p className="eyebrow">Reflective architecture</p>
          <h2 className="mt-4 text-3xl uppercase tracking-[0.14em] sm:text-4xl">Designed to catch light cleanly</h2>
          <p className="mt-5 text-sm leading-7 text-steel sm:text-base">
            The shoulder hits, chest crest, and full rear spine are built to read like chrome under direct light,
            while the rest of the garment stays restrained. Every {product.color} colorway keeps the same technical
            structure with a different visual mood.
          </p>
          <div className="mt-5 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <p className="text-xs uppercase tracking-[0.26em] text-mist">Material platform</p>
            <p className="mt-3 text-sm leading-7 text-steel">{product.manufacturingNote}</p>
            <p className="mt-2 text-sm leading-7 text-steel">{product.material}</p>
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.28em] text-steel">Editorial shown in Onyx for technical clarity.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {performanceNotes.map((note) => (
            <article key={note.title} className="glass-panel p-5">
              <p className="text-xs uppercase tracking-[0.26em] text-mist">{note.title}</p>
              <p className="mt-3 text-sm leading-7 text-steel">{note.body}</p>
            </article>
          ))}
        </div>

        <article className="glass-panel overflow-hidden">
          <div className="relative aspect-[5/4]">
            <Image
              src={series01Editorial.fabricDetailUrl}
              alt="Series 01 performance fabric close-up"
              fill
              sizes="(max-width: 1024px) 100vw, 36vw"
              className="object-cover"
            />
          </div>
          <div className="p-5 sm:p-6">
            <p className="eyebrow">Fabric close-up</p>
            <p className="mt-3 text-sm leading-7 text-steel">
              Seamless knit texture, breathable mapping, and reflective finishing are integrated into the body of the
              tee instead of sitting on top of it as decoration.
            </p>
          </div>
        </article>

        <article className="glass-panel p-6 sm:p-7">
          <p className="text-3xl uppercase tracking-[0.16em] text-mist sm:text-4xl">Evolve Yourself.</p>
          <p className="mt-4 text-sm uppercase tracking-[0.32em] text-steel">Performance made precise.</p>
        </article>
      </div>
    </section>
  );
}

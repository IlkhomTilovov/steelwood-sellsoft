import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingCart } from 'lucide-react';
import { LazyImage } from '@/components/LazyImage';

type Lang = 'uz' | 'ru';

interface SetLike {
  id: string;
  title_uz: string;
  title_ru: string;
  image?: string | null;
  href?: string | null;
}

/** Har bir to'plam faqat o'z mahsulotlarini ko'rsatishi uchun ?set= havolasi ustuvor. */
function setHref(set: SetLike) {
  const href = set.href?.trim();
  if (href && href.includes('set=')) return href;
  return `/catalog?set=${set.id}`;
}

const TINTS = ['bg-secondary', 'bg-muted', 'bg-accent/15'];

/**
 * Bento uslubidagi hero: chapda bitta keng, katta to'q kartochka (birinchi
 * to'plam), o'ng tomonda 2x2 to'rda qolgan tayyor to'plam kartochkalari.
 */
export function HeroBento({
  sets,
  loading,
  language,
}: {
  sets: SetLike[];
  loading: boolean;
  language: Lang;
}) {
  if (loading) {
    return (
      <section className="container mx-auto px-4 lg:px-8 pt-6 lg:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="h-[340px] lg:h-[520px] rounded-[2rem] bg-muted/50 animate-pulse" />
          <div className="grid grid-cols-2 grid-rows-2 gap-4 lg:gap-6 h-[340px] lg:h-[520px]">
            <div className="rounded-[2rem] bg-muted/50 animate-pulse" />
            <div className="rounded-[2rem] bg-muted/50 animate-pulse" />
            <div className="rounded-[2rem] bg-muted/50 animate-pulse" />
            <div className="rounded-[2rem] bg-muted/50 animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  if (sets.length === 0) return null;

  const [main, ...rest] = sets;
  const mainTitle = language === 'uz' ? main.title_uz : main.title_ru;
  const mainHref = setHref(main);
  const topSets = rest.slice(0, 4);

  return (
    <section className="container mx-auto px-4 lg:px-8 pt-6 lg:pt-10">
      <div className={`grid gap-4 lg:gap-6 ${topSets.length > 0 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        <Link
          to={mainHref}
          className="group relative block overflow-hidden rounded-[2rem] bg-foreground min-h-[340px] lg:min-h-[520px] shadow-soft hover:shadow-soft-lg transition-shadow duration-500 ease-luxe"
        >
          {main.image && (
            <LazyImage
              src={main.image}
              alt={mainTitle}
              priority
              sizes="100vw"
              width={1600}
              height={700}
              wrapperClassName="absolute inset-0"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-luxe"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/40 to-foreground/10" />

          <div className="relative h-full p-6 lg:p-12 flex flex-col justify-between">
            <div>
              <span className="text-[10px] lg:text-xs font-semibold uppercase tracking-[0.24em] text-background/60">
                {language === 'uz' ? "To'plamlar" : 'Комплекты'}
              </span>
              <h1 className="mt-4 font-sans text-3xl sm:text-4xl lg:text-6xl font-black leading-[1.05] text-background max-w-[16ch]">
                {mainTitle}
              </h1>
            </div>
            <div className="inline-flex items-center gap-3 self-start bg-background/95 rounded-full pl-5 pr-2 py-2">
              <span className="text-xs lg:text-sm font-medium text-foreground">
                {language === 'uz' ? "To'plamni ko'rish" : 'Смотреть комплект'}
              </span>
              <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-primary-foreground" />
              </span>
            </div>
          </div>
        </Link>

        {/* O'ng panel — qolgan tayyor to'plamlar, 2x2 to'r */}
        {topSets.length > 0 && (
          <div className="grid grid-cols-2 grid-rows-2 gap-4 lg:gap-6 min-h-[340px] lg:min-h-[520px]">
            {topSets.map((s, i) => (
              <SetTile key={s.id} set={s} language={language} tint={TINTS[i % TINTS.length]} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SetTile({
  set,
  language,
  tint,
}: {
  set: SetLike;
  language: Lang;
  tint: string;
}) {
  const title = language === 'uz' ? set.title_uz : set.title_ru;
  return (
    <Link
      to={setHref(set)}
      className={`group relative h-full overflow-hidden rounded-[2rem] ${tint} shadow-soft hover:shadow-soft-lg transition-all duration-500 ease-luxe`}
    >
      {set.image && (
        <LazyImage
          src={set.image}
          alt={title}
          wrapperClassName="absolute inset-0"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-luxe"
        />
      )}
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative h-full p-4 lg:p-6 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-media-foreground/70">
            {language === 'uz' ? 'Tayyor to‘plam' : 'Готовый комплект'}
          </span>
          <ArrowUpRight className="w-4 h-4 shrink-0 text-media-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
        <h2 className="font-sans text-lg lg:text-2xl font-bold leading-tight text-media-foreground">
          {title}
        </h2>
      </div>
    </Link>
  );
}

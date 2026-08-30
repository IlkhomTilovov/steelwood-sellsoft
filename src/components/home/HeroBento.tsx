import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingCart, Sparkles } from 'lucide-react';
import { LazyImage } from '@/components/LazyImage';
import { PROMO_ICONS } from '@/lib/promoIcons';
import type { PromoTile } from '@/hooks/usePromoTiles';

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
 * Bento uslubidagi hero: yuqorida bir necha kichik to'plam kartochkasi,
 * pastda bitta keng, katta to'q kartochka (birinchi to'plam).
 */
export function HeroBento({
  sets,
  loading,
  language,
  promoTiles = [],
}: {
  sets: SetLike[];
  loading: boolean;
  language: Lang;
  /** Pastki-o'ng panelda 2x2 to'rda ko'rsatiladigan promo kartochkalar (ixtiyoriy). */
  promoTiles?: PromoTile[];
}) {
  if (loading) {
    return (
      <section className="container mx-auto px-4 lg:px-8 pt-6 lg:pt-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
          <div className="aspect-square lg:aspect-auto lg:h-[300px] rounded-[2rem] bg-muted/50 animate-pulse" />
          <div className="aspect-square lg:aspect-auto lg:h-[300px] rounded-[2rem] bg-muted/50 animate-pulse" />
          <div className="hidden sm:block aspect-square lg:aspect-auto lg:h-[300px] rounded-[2rem] bg-muted/50 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="h-[300px] lg:h-[420px] rounded-[2rem] bg-muted/50 animate-pulse" />
          <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-4 lg:gap-6 h-[420px]">
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
  const topSets = rest.slice(0, 3);
  const heroPromoTiles = promoTiles.slice(0, 4);

  return (
    <section className="container mx-auto px-4 lg:px-8 pt-6 lg:pt-10">
      {/* Yuqori qator — kichik to'plam kartochkalari */}
      {topSets.length > 0 && (
        <div
          className={`grid gap-4 lg:gap-6 mb-4 lg:mb-6 ${
            topSets.length === 1
              ? 'grid-cols-1'
              : topSets.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-2 sm:grid-cols-3'
          }`}
        >
          {topSets.map((s, i) => (
            <SetTile key={s.id} set={s} language={language} tint={TINTS[i % TINTS.length]} />
          ))}
        </div>
      )}

      {/* Pastki qator — keng to'q kartochka + promo kartochkalar paneli */}
      <div className={`grid gap-4 lg:gap-6 ${heroPromoTiles.length > 0 ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
        <Link
          to={mainHref}
          className="group relative block overflow-hidden rounded-[2rem] bg-foreground min-h-[300px] lg:min-h-[420px] shadow-soft hover:shadow-soft-lg transition-shadow duration-500 ease-luxe"
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
              <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-6xl font-bold leading-[1.05] text-background max-w-[16ch]">
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

        {heroPromoTiles.length > 0 && (
          <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-4 lg:gap-6 min-h-[420px]">
            {heroPromoTiles.map((tile) => (
              <HeroPromoTile key={tile.id} tile={tile} language={language} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function HeroPromoTile({ tile, language }: { tile: PromoTile; language: Lang }) {
  const Icon = PROMO_ICONS[tile.icon] || Sparkles;
  const title = language === 'uz' ? tile.title_uz : tile.title_ru;
  return (
    <Link
      to={tile.href || '/catalog'}
      className={`group relative overflow-hidden rounded-[2rem] shadow-soft hover:shadow-soft-lg transition-all duration-500 ease-luxe ${tile.bg_class}`}
    >
      <Icon
        className={`absolute -bottom-4 -right-3 w-20 h-20 ${tile.text_class} opacity-[0.1] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-700 ease-luxe`}
        strokeWidth={1}
      />
      <div className="relative h-full p-4 lg:p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`w-8 h-8 rounded-full border border-current/20 bg-background/25 flex items-center justify-center ${tile.text_class}`}
          >
            <Icon className="w-3.5 h-3.5" strokeWidth={1.75} />
          </span>
          <ArrowUpRight
            className={`w-3.5 h-3.5 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${tile.text_class}`}
          />
        </div>
        <h3 className={`font-sans font-semibold text-sm leading-snug ${tile.text_class}`}>{title}</h3>
      </div>
    </Link>
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
      className={`group relative aspect-square lg:aspect-auto lg:h-[300px] overflow-hidden rounded-[2rem] ${tint} shadow-soft hover:shadow-soft-lg transition-all duration-500 ease-luxe`}
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
        <h2 className="font-serif text-lg lg:text-2xl font-bold leading-tight text-media-foreground">
          {title}
        </h2>
      </div>
    </Link>
  );
}

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Headphones, Play, Instagram } from 'lucide-react';
import { LazyImage } from '@/components/LazyImage';
import { Button } from '@/components/ui/button';
import { EditableText } from '@/components/EditableText';

type Lang = 'uz' | 'ru';

interface CategoryLike {
  id: string;
  slug?: string | null;
  name_uz: string;
  name_ru: string;
  image?: string | null;
  show_in_banner?: boolean | null;
}

interface ProductLike {
  id: string;
  name_uz: string;
  name_ru: string;
  slug?: string | null;
  price?: number | null;
  original_price?: number | null;
  images?: string[] | null;
}

/* ============ 0. Xalqaro tovarlar (Global) banneri ============
   Matn admin tomonidan sayt ustidagi "Tahrirlash" rejimi orqali
   (EditableText, site_content jadvali) o'zgartiriladi — alohida
   admin sahifasi shart emas. */
export function GlobalBanner({ language }: { language: Lang }) {
  return (
    <section className="container mx-auto px-4 lg:px-8 pt-6 lg:pt-10">
      <Link
        to="/catalog"
        className="group relative block overflow-hidden rounded-[2rem] min-h-[130px] sm:min-h-[150px] lg:min-h-[180px] flex items-center px-6 sm:px-10 lg:px-16 py-6 shadow-soft hover:shadow-soft-lg transition-shadow duration-500 ease-luxe"
        style={{
          backgroundImage:
            'radial-gradient(100% 140% at 75% 40%, #fa9a72 0%, #f46734 55%, #f46734 100%)',
        }}
      >
        <div className="relative z-10">
          <EditableText
            contentKey="home_global_banner_title"
            fallback={language === 'uz' ? 'Xalqaro tovarlar' : 'Международные товары'}
            as="h2"
            className="font-sans text-xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight"
          />
          <EditableText
            contentKey="home_global_banner_subtitle"
            fallback={language === 'uz' ? 'Uyingiz va siz uchun topilmalar' : 'Находки для вашего дома и вас'}
            as="p"
            className="mt-2 block text-xs sm:text-sm lg:text-base text-white/85"
          />
        </div>
      </Link>
    </section>
  );
}

/* ============ 1. Ikki ustunli kolleksiya bannerlari ============ */
export function CollectionBanners({
  categories,
  loading,
  language,
}: {
  categories: CategoryLike[];
  loading: boolean;
  language: Lang;
}) {
  // Admin panelda "Bosh sahifa bannerida ko'rsatish" yoqilgan toifalar ustuvor.
  // Bitta toifa belgilangan bo'lsa ham u birinchi o'rinda chiqadi, ikkinchi joy qolganlardan to'ldiriladi.
  const withImage = categories.filter((c) => c.image);
  const selected = withImage.filter((c) => c.show_in_banner);
  const others = withImage.filter((c) => !c.show_in_banner);
  const picks = [...selected, ...others].slice(0, 2);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Mobilda (grid emas, karusel) har 5 soniyada avtomatik keyingi toifaga o'tadi.
  // Foydalanuvchi qo'lda sudrayotganda (pointerdown) vaqtincha to'xtaydi.
  useEffect(() => {
    if (loading || picks.length < 2) return;
    const el = scrollRef.current;
    const mql = window.matchMedia('(max-width: 767px)');
    let timer: ReturnType<typeof setInterval> | null = null;

    const stop = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };
    const start = () => {
      stop();
      if (mql.matches) {
        timer = setInterval(() => {
          setActiveIndex((prev) => (prev + 1) % picks.length);
        }, 5000);
      }
    };

    start();
    mql.addEventListener('change', start);
    el?.addEventListener('pointerdown', stop);
    el?.addEventListener('pointerup', start);
    el?.addEventListener('pointercancel', start);

    return () => {
      stop();
      mql.removeEventListener('change', start);
      el?.removeEventListener('pointerdown', stop);
      el?.removeEventListener('pointerup', start);
      el?.removeEventListener('pointercancel', start);
    };
  }, [loading, picks.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[activeIndex] as HTMLElement | undefined;
    if (!child) return;
    // el.scrollTo, not child.scrollIntoView: scrollIntoView can also move the
    // page's own vertical scroll position (e.g. to bring an off-screen card
    // into view), which yanked the whole page back to this section every
    // autoplay tick. Scrolling only this container's scrollLeft never
    // touches page scroll.
    el.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
  }, [activeIndex]);

  if (loading) {
    return (
      <section className="container mx-auto px-4 lg:px-8 mt-10 lg:mt-16">
        <div className="flex gap-4 md:grid md:grid-cols-2 md:gap-6">
          <div className="shrink-0 w-full sm:w-[60%] md:w-auto aspect-[16/9] rounded-[2rem] bg-muted/50 animate-pulse" />
          <div className="shrink-0 w-full sm:w-[60%] md:w-auto aspect-[16/9] rounded-[2rem] bg-muted/50 animate-pulse" />
        </div>
      </section>
    );
  }

  if (picks.length < 2) return null;

  return (
    <section className="container mx-auto px-4 lg:px-8 mt-10 lg:mt-16">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:snap-none"
      >
        {picks.map((cat, i) => {
          const name = language === 'uz' ? cat.name_uz : cat.name_ru;
          return (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className="group relative shrink-0 w-full sm:w-[60%] md:w-auto snap-start overflow-hidden rounded-[2rem] bg-[#f46734] shadow-soft hover:shadow-soft-lg transition-all duration-500 ease-luxe"
            >
              <div className="grid grid-cols-[1fr_1.1fr] items-center min-h-[210px] lg:min-h-[260px]">
                <div className="relative self-stretch flex flex-col justify-center overflow-hidden p-6 lg:p-9">
                  {/* Fon texturasi — yog'och parket (herringbone) naqsh, faqat o'ng chetda (rasmga tutash joyda), #f46734 rangida, juda xira */}
                  <div
                    className="absolute inset-y-0 right-0 w-16 lg:w-24 pointer-events-none opacity-[0.18]"
                    style={{
                      color: '#ffffff',
                      backgroundImage:
                        'linear-gradient(135deg, currentColor 25%, transparent 25%), linear-gradient(225deg, currentColor 25%, transparent 25%), linear-gradient(45deg, currentColor 25%, transparent 25%), linear-gradient(315deg, currentColor 25%, transparent 25%)',
                      backgroundPosition: '10px 0, 10px 0, 0 0, 0 0',
                      backgroundSize: '20px 20px',
                      maskImage: 'linear-gradient(to left, black 45%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to left, black 45%, transparent 100%)',
                    }}
                  />
                  <div className="relative">
                    <h3 className="font-serif text-2xl lg:text-3xl font-bold text-white leading-tight">
                      {name}
                    </h3>
                    <p className="mt-2 text-sm text-white/80 max-w-[22ch]">
                      {language === 'uz'
                        ? 'Zamonaviy dizayn, uzoq muddatli sifat.'
                        : 'Современный дизайн, долговечное качество.'}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white">
                      {language === 'uz' ? 'Ko‘rish' : 'Смотреть'}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
                <div className="relative h-full min-h-[210px] lg:min-h-[260px]">
                  <LazyImage
                    src={cat.image as string}
                    alt={name}
                    wrapperClassName="absolute inset-0"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-luxe"
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ============ 2. Chegirma banneri ============ */
export function DiscountBanner({
  products,
  language,
}: {
  products: ProductLike[];
  language: Lang;
}) {
  const [picked, setPicked] = useState<ProductLike | null>(null);

  // Admin panelda "Chegirma bannerida ko'rsatish" belgilangan mahsulot ustuvor.
  useEffect(() => {
    let alive = true;
    supabase
      .from('products')
      .select('id, name_uz, name_ru, slug, price, original_price, images')
      .eq('is_active', true)
      .eq('show_in_discount_banner', true)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (alive && data) setPicked(data as ProductLike);
      });
    return () => {
      alive = false;
    };
  }, []);

  const withDiscount = products
    .filter((p) => p.price && p.original_price && p.original_price > p.price)
    .map((p) => ({
      ...p,
      percent: Math.round(((p.original_price! - p.price!) / p.original_price!) * 100),
    }))
    .sort((a, b) => b.percent - a.percent);

  const source = picked ?? withDiscount[0];
  if (!source) return null;
  const percent =
    source.price && source.original_price && source.original_price > source.price
      ? Math.round(((source.original_price - source.price) / source.original_price) * 100)
      : null;
  const best = { ...source, percent };
  if (best.percent === null) return null;
  const image = best.images?.[0];

  return (
    <section className="container mx-auto px-4 lg:px-8 mt-16 lg:mt-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-secondary">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          <div className="order-2 md:order-1 p-8 lg:p-14">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              {language === 'uz' ? 'Cheklangan taklif' : 'Ограниченное предложение'}
            </span>
            <h2 className="mt-4 font-serif text-4xl lg:text-6xl font-bold text-foreground leading-[1.05]">
              {language === 'uz' ? 'Chegirma' : 'Скидка'}{' '}
              <span className="text-accent">{best.percent}%</span>
              <span className="block text-2xl lg:text-3xl font-medium mt-2 text-muted-foreground/90">
                {language === 'uz' ? 'eng sara mahsulotlarda' : 'на бестселлеры'}
              </span>
            </h2>
            <Button asChild size="lg" className="mt-8 rounded-full px-8 gap-2">
              <Link to="/catalog?discounted=1">
                {language === 'uz' ? 'Taklifni olish' : 'Получить предложение'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="order-1 md:order-2 relative aspect-[16/10] md:aspect-auto md:h-full md:min-h-[320px]">

            {image && (
              <LazyImage
                src={image}
                alt={language === 'uz' ? best.name_uz : best.name_ru}
                wrapperClassName="absolute inset-0"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface InstagramVideoLike {
  id: string;
  video_url?: string | null;
  instagram_url?: string | null;
  caption_uz?: string | null;
  caption_ru?: string | null;
}

// Instagram's official embed widget (window.instgrm) turns a
// `<blockquote class="instagram-media">` into the real Instagram post/reel
// player. It's the officially supported way to show an Instagram video on
// another site with no backend involved — no scraping, no link that expires
// — at the cost of carrying Instagram's own chrome (like/comment count,
// "View on Instagram", avatar) rather than a fully custom player.
declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

let instagramEmbedScriptPromise: Promise<void> | null = null;
function loadInstagramEmbedScript(): Promise<void> {
  if (window.instgrm) return Promise.resolve();
  if (!instagramEmbedScriptPromise) {
    instagramEmbedScriptPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }
  return instagramEmbedScriptPromise;
}

/** Bitta video kartochkasi: `video_url` bo'lsa to'g'ridan-to'g'ri <video>
 * bilan (qo'lda yuklangan/havola qilingan fayl), aks holda `instagram_url`
 * Instagram'ning rasmiy embed vidjeti orqali ko'rsatiladi. */
function InstagramVideoCard({ video, caption }: { video: InstagramVideoLike; caption?: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.muted = false;
      el.play().catch(() => {});
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (video.video_url || !video.instagram_url) return;
    let cancelled = false;
    loadInstagramEmbedScript().then(() => {
      if (!cancelled) window.instgrm?.Embeds.process();
    });
    return () => {
      cancelled = true;
    };
  }, [video.video_url, video.instagram_url]);

  if (video.video_url) {
    return (
      <div className="overflow-hidden rounded-[2rem] bg-card shadow-soft hover:shadow-soft-lg transition-shadow duration-500 ease-luxe">
        <div className="relative aspect-[4/5] bg-black overflow-hidden">
          <video
            ref={videoRef}
            src={video.video_url}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            loop
            playsInline
            muted
            preload="metadata"
            onClick={toggle}
            onEnded={() => setPlaying(false)}
          />
          {!playing && (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center pointer-events-none">
              <span className="w-14 h-14 rounded-full bg-background/95 flex items-center justify-center shadow-soft-lg">
                <Play className="w-5 h-5 text-foreground fill-foreground ml-0.5" />
              </span>
            </div>
          )}
          {video.instagram_url && (
            <a
              href={video.instagram_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4 text-foreground" />
            </a>
          )}
        </div>
        {caption && (
          <div className="p-5">
            <h3 className="font-sans font-semibold text-base text-foreground">{caption}</h3>
          </div>
        )}
      </div>
    );
  }

  if (!video.instagram_url) return null;

  // Faqat videoning o'zi ko'rinsin: Instagram embed'ining tepa (profil) va
  // past (like/comment) qismlari konteyner tashqarisiga chiqarib kesiladi.
  const embedSrc = `${video.instagram_url.split('?')[0].replace(/\/$/, '')}/embed/`;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-card shadow-soft hover:shadow-soft-lg transition-shadow duration-500 ease-luxe">
      <div className="relative aspect-[4/5] overflow-hidden bg-black">
        <iframe
          src={embedSrc}
          title={caption || 'Instagram video'}
          scrolling="no"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute left-0 w-full border-0"
          style={{ top: '-54px', height: '2400px' }}
        />
      </div>
      {caption && (
        <div className="p-5">
          <h3 className="font-sans font-semibold text-base text-foreground">{caption}</h3>
        </div>
      )}
    </div>
  );
}


/* ============ 3. Ilhom bloki (Instagram videolar) ============ */
export function InspirationSection({
  videos,
  loading,
  language,
}: {
  videos: InstagramVideoLike[];
  loading: boolean;
  language: Lang;
}) {
  if (loading) {
    return (
      <section className="container mx-auto px-4 lg:px-8 mt-16 lg:mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-[2rem] bg-muted/50 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const picks = videos.filter((v) => v.video_url || v.instagram_url).slice(0, 3);
  if (picks.length === 0) return null;

  return (
    <section className="container mx-auto px-4 lg:px-8 mt-16 lg:mt-24 mb-16 lg:mb-24">
      <div className="mb-8">
        <h2 className="font-serif text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
          {language === 'uz' ? 'Interyer uchun ilhom' : 'Вдохновение для интерьера'}
        </h2>
        <p className="mt-3 text-muted-foreground/80">
          {language === 'uz'
            ? "Instagram'dagi so'nggi videolarimiz."
            : 'Наши последние видео в Instagram.'}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {picks.map((v) => (
          <InstagramVideoCard
            key={v.id}
            video={v}
            caption={language === 'uz' ? v.caption_uz : v.caption_ru}
          />
        ))}
      </div>
    </section>
  );
}

/* ============ 4. Afzalliklar qatori ============ */
export function FeatureStrip({ language }: { language: Lang }) {
  const items = [
    {
      Icon: Truck,
      title: language === 'uz' ? 'Bepul yetkazib berish' : 'Бесплатная доставка',
      text: language === 'uz' ? 'Toshkent bo‘ylab' : 'По Ташкенту',
    },
    {
      Icon: RotateCcw,
      title: language === 'uz' ? 'Qulay qaytarish' : 'Удобный возврат',
      text: language === 'uz' ? '14 kun ichida' : 'В течение 14 дней',
    },
    {
      Icon: ShieldCheck,
      title: language === 'uz' ? 'Kafolat' : 'Гарантия',
      text: language === 'uz' ? '24 oygacha kafolat' : 'До 24 месяцев',
    },
    {
      Icon: Headphones,
      title: language === 'uz' ? 'Qo‘llab-quvvatlash' : 'Поддержка',
      text: language === 'uz' ? 'Har kuni 9:00–20:00' : 'Ежедневно 9:00–20:00',
    },
  ];

  return (
    <section className="container mx-auto px-4 lg:px-8 mt-16 lg:mt-24 pb-16 lg:pb-24">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 border-t border-border pt-10">
        {items.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="shrink-0 w-11 h-11 rounded-full bg-muted flex items-center justify-center">
              <Icon className="w-5 h-5 text-foreground" strokeWidth={1.6} />
            </span>
            <div>
              <h3 className="font-sans font-semibold text-sm text-foreground leading-tight">{title}</h3>
              <p className="mt-1 text-xs text-muted-foreground/80">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

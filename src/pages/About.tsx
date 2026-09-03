import { MessageCircle, PenTool, Hammer, Truck, ArrowRight, Factory, Ruler, ShieldCheck, Play } from 'lucide-react';
import delivery1 from '@/assets/videos/delivery-1.mp4.asset.json';
import delivery2 from '@/assets/videos/delivery-2.mp4.asset.json';
import delivery3 from '@/assets/videos/delivery-3.mp4.asset.json';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useSEO } from '@/hooks/useSEO';
import { EditableText } from '@/components/EditableText';
import { EditableImage } from '@/components/EditableImage';
import { getPageSeo } from '@/lib/pageSeo';

export default function About() {
  const { language, t } = useLanguage();
  const seo = getPageSeo('about', language);

  useSEO({ title: seo.title, description: seo.description, ogTitle: seo.title, ogDescription: seo.description });

  const stats = [
    { value: '10+', label: t.about.stats.years, valueKey: 'about_stat_years_value', labelKey: 'about_stat_years_label' },
    { value: '5000+', label: t.about.stats.products, valueKey: 'about_stat_products_value', labelKey: 'about_stat_products_label' },
    { value: '3000+', label: t.about.stats.customers, valueKey: 'about_stat_customers_value', labelKey: 'about_stat_customers_label' },
    { value: '12+', label: t.about.stats.cities, valueKey: 'about_stat_cities_value', labelKey: 'about_stat_cities_label' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero — single banner: photo bleeding in behind a dark gradient, text on top */}
      <section id="hero" className="pt-16 lg:pt-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] shadow-soft-lg min-h-[230px] lg:min-h-[300px] flex items-center">
            <div className="absolute inset-0">
              <EditableImage
                contentKey="about_hero_image"
                fallbackSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920"
                alt="Workshop"
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full relative"
                section="about"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/10 pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-2xl px-8 sm:px-12 lg:px-16 py-7">
              <span className="block text-xs uppercase tracking-[0.2em] text-primary-foreground/70 font-medium mb-3">
                <EditableText
                  contentKey="about_title"
                  fallback={t.about.title}
                  as="span"
                  section="about"
                  field="title"
                />
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold leading-[1.15] tracking-tight text-primary-foreground">
                <EditableText
                  contentKey="about_subtitle"
                  fallback={language === 'uz'
                    ? "Metall karkasli loft mebellarni o'z seximizda ishlab chiqaramiz — mustahkam, minimalist va uzoq xizmat qiladigan yechimlar"
                    : "Производим лофт-мебель на металлическом каркасе в собственном цехе — прочные, минималистичные и долговечные решения"
                  }
                  as="span"
                  multiline
                  section="about"
                  field="subtitle"
                />
              </h1>
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground border-b border-primary-foreground/40 pb-1 hover:border-primary-foreground transition-colors"
              >
                {language === 'uz' ? "Biz bilan bog'laning" : 'Связаться с нами'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Stats — hairline row, scale does the work instead of icon cards */}
          <div className="mt-16 lg:mt-24 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="font-serif text-4xl lg:text-5xl font-semibold text-foreground tracking-tight">
                  <EditableText
                    contentKey={stat.valueKey}
                    fallback={stat.value}
                    as="span"
                    className="font-serif text-4xl lg:text-5xl font-semibold"
                    section="about"
                    field={stat.valueKey}
                  />
                </div>
                <div className="mt-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  <EditableText
                    contentKey={stat.labelKey}
                    fallback={stat.label}
                    as="span"
                    className="text-xs uppercase tracking-[0.14em]"
                    section="about"
                    field={stat.labelKey}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story — premium two-column positioning block */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-[45fr_55fr] gap-12 lg:gap-16 xl:gap-20 items-center">
            {/* Left — content */}
            <div className="animate-fade-in">
              <span className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground mb-5">
                <EditableText
                  contentKey="about_story_eyebrow"
                  fallback={language === 'uz' ? 'KOMPANIYA HAQIDA' : 'О КОМПАНИИ'}
                  as="span"
                  section="about"
                  field="story_eyebrow"
                />
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground">
                <EditableText
                  contentKey="about_story_title"
                  fallback={language === 'uz'
                    ? "Biznesingiz uchun ishlaydigan mebel yaratamiz"
                    : 'Создаём мебель, которая работает на ваш бизнес'}
                  as="span"
                  multiline
                  section="about"
                  field="story_title"
                />
              </h2>
              <p className="mt-6 text-[15px] lg:text-base text-muted-foreground leading-relaxed max-w-xl">
                <EditableText
                  contentKey="about_story_text_1"
                  fallback={t.about.storyText}
                  as="span"
                  multiline
                  section="about"
                  field="story_text_1"
                />
              </p>
              <p className="mt-4 text-[15px] lg:text-base text-muted-foreground leading-relaxed max-w-xl">
                <EditableText
                  contentKey="about_story_text_2"
                  fallback={language === 'uz'
                    ? "Seriyali modellarni ishlab chiqaramiz va mijoz o'lchovlari hamda talablariga ko'ra individual buyurtmalarni bajaramiz."
                    : 'Выпускаем серийные модели и выполняем индивидуальные заказы по размерам и требованиям клиента.'}
                  as="span"
                  multiline
                  section="about"
                  field="story_text_2"
                />
              </p>

              {/* Feature blocks */}
              <div className="mt-10 grid sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  {
                    Icon: Factory,
                    title: language === 'uz' ? "O'z ishlab chiqarishimiz" : 'Собственное производство',
                    text: language === 'uz'
                      ? "Ishlab chiqarishning asosiy bosqichlarini o'zimiz nazorat qilamiz."
                      : 'Контролируем ключевые этапы производства самостоятельно.',
                  },
                  {
                    Icon: Ruler,
                    title: language === 'uz' ? "Individual o'lchovlar" : 'Индивидуальные размеры',
                    text: language === 'uz'
                      ? "Sizning o'lchov va vazifalaringizga mos mebel tayyorlaymiz."
                      : 'Изготавливаем мебель по вашим размерам и задачам.',
                  },
                  {
                    Icon: ShieldCheck,
                    title: language === 'uz' ? 'Sifat nazorati' : 'Контроль качества',
                    text: language === 'uz'
                      ? "Karkas, payvand va yig'ish sifatini kuzatib boramiz."
                      : 'Следим за качеством каркаса, сварки и сборки.',
                  },
                ].map(({ Icon, title, text }) => (
                  <div
                    key={title}
                    className="rounded-[20px] border border-border/70 bg-card/60 p-5 transition-colors hover:border-border"
                  >
                    <Icon className="w-5 h-5 text-foreground/70" strokeWidth={1.5} />
                    <h3 className="mt-4 text-sm font-semibold text-foreground leading-snug">{title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/catalog"
                className="mt-10 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                {language === 'uz' ? 'Katalogni ko\u2019rish' : 'Смотреть каталог'}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — image */}
            <div className="relative animate-fade-in">
              <div className="relative overflow-hidden rounded-[24px] border border-border/60 shadow-soft-lg aspect-[4/3] lg:aspect-[5/4]">
                <EditableImage
                  contentKey="about_story_image"
                  fallbackSrc="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1400"
                  alt={language === 'uz' ? 'Ishlab chiqarish sexi' : 'Производственный цех'}
                  className="w-full h-full object-cover"
                  wrapperClassName="w-full h-full"
                  section="about"
                />
              </div>

              {/* Floating info card */}
              <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 max-w-[320px] rounded-[20px] border border-border/60 bg-card/95 backdrop-blur-sm px-5 py-4 shadow-soft-lg">
                <p className="text-sm font-semibold text-foreground">
                  {language === 'uz' ? "O'z ishlab chiqarishimiz" : 'Собственное производство'}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {language === 'uz'
                    ? 'Loft mebel • Metall • Individual buyurtma'
                    : 'Loft мебель • Металл • Индивидуальные заказы'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery process — 3 customer-facing videos */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="max-w-2xl mb-12 lg:mb-16">
            <span className="inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground mb-5">
              {language === 'uz' ? 'YETKAZIB BERISH' : 'ДОСТАВКА'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-foreground">
              {language === 'uz'
                ? "Buyurtmadan xonangizgacha"
                : 'От заказа до вашего помещения'}
            </h2>
            <p className="mt-5 text-[15px] lg:text-base text-muted-foreground leading-relaxed max-w-xl">
              {language === 'uz'
                ? "Har bir buyurtma bizning nazoratimizdan o'tadi — ishlab chiqarishdan boshlab, qadoqlash va o'rnatib berishgacha."
                : 'Каждый заказ проходит под нашим контролем — от производства до упаковки и установки.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                src: delivery1.url,
                title: language === 'uz' ? 'Ishlab chiqarish' : 'Производство',
                text: language === 'uz'
                  ? 'Mebelni o‘z seximizda, mustahkam metall karkas asosida yasaymiz.'
                  : 'Изготавливаем мебель в собственном цехе на прочном металлическом каркасе.',
              },
              {
                src: delivery2.url,
                title: language === 'uz' ? 'Sifat nazorati' : 'Контроль качества',
                text: language === 'uz'
                  ? 'Har bir detalni tekshirib, qadoqlashdan oldin tayyor mahsulotni qabul qilamiz.'
                  : 'Проверяем каждую деталь и принимаем готовое изделие перед упаковкой.',
              },
              {
                src: delivery3.url,
                title: language === 'uz' ? 'Yetkazib berish va o‘rnatish' : 'Доставка и установка',
                text: language === 'uz'
                  ? 'Buyurtmani xavfsiz yetkazib, kerak bo‘lsa o‘rnatib ham beramiz.'
                  : 'Бережно доставляем заказ и при необходимости производим установку.',
              },
            ].map((video, i) => (
              <div
                key={i}
                className="group rounded-[24px] border border-border/60 bg-card overflow-hidden shadow-soft-lg transition-all hover:shadow-soft-xl hover:-translate-y-1"
              >
                <div className="relative aspect-[9/16] bg-muted">
                  <video
                    src={video.src}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    poster=""
                  />
                </div>
                <div className="p-5 lg:p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {video.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {video.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-warm">
              <h3 className="font-serif text-2xl font-bold mb-4">
                <EditableText 
                  contentKey="about_mission_title" 
                  fallback={t.about.mission}
                  as="span"
                  className="font-serif text-2xl font-bold"
                  section="about"
                  field="mission_title"
                />
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                <EditableText 
                  contentKey="about_mission_text" 
                  fallback={t.about.missionText}
                  as="span"
                  multiline
                  section="about"
                  field="mission_text"
                />
              </p>
            </div>
            <div className="bg-card p-8 rounded-2xl shadow-warm">
              <h3 className="font-serif text-2xl font-bold mb-4">
                <EditableText 
                  contentKey="about_values_title" 
                  fallback={t.about.values}
                  as="span"
                  className="font-serif text-2xl font-bold"
                  section="about"
                  field="values_title"
                />
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                <EditableText 
                  contentKey="about_values_text" 
                  fallback={t.about.valuesText}
                  as="span"
                  multiline
                  section="about"
                  field="values_text"
                />
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Process */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-center mb-10">
            <EditableText 
              contentKey="about_process_title" 
              fallback={language === 'uz' ? 'Ishlab chiqarish jarayoni' : 'Процесс производства'}
              as="span"
              className="font-serif text-3xl font-bold"
              section="about"
              field="process_title"
            />
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { Icon: MessageCircle, titleKey: 'about_process_1_title', descKey: 'about_process_1_desc', title: language === 'uz' ? 'Konsultatsiya' : 'Консультация', desc: language === 'uz' ? "Sizning talablaringizni o'rganamiz" : 'Изучаем ваши требования' },
              { Icon: PenTool, titleKey: 'about_process_2_title', descKey: 'about_process_2_desc', title: language === 'uz' ? 'Dizayn' : 'Дизайн', desc: language === 'uz' ? '3D loyiha tayyorlaymiz' : 'Готовим 3D проект' },
              { Icon: Hammer, titleKey: 'about_process_3_title', descKey: 'about_process_3_desc', title: language === 'uz' ? 'Ishlab chiqarish' : 'Производство', desc: language === 'uz' ? 'Sifatli materiallardan yasaymiz' : 'Изготавливаем из качественных материалов' },
              { Icon: Truck, titleKey: 'about_process_4_title', descKey: 'about_process_4_desc', title: language === 'uz' ? 'Yetkazib berish' : 'Доставка', desc: language === 'uz' ? "O'rnatib beramiz" : 'Доставляем и устанавливаем' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <item.Icon className="w-7 h-7" strokeWidth={1.6} />
                </div>
                <h4 className="font-medium mb-2">
                  <EditableText 
                    contentKey={item.titleKey} 
                    fallback={item.title}
                    as="span"
                    className="font-medium"
                    section="about"
                    field={item.titleKey}
                  />
                </h4>
                <p className="text-sm text-muted-foreground">
                  <EditableText 
                    contentKey={item.descKey} 
                    fallback={item.desc}
                    as="span"
                    className="text-sm"
                    section="about"
                    field={item.descKey}
                  />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
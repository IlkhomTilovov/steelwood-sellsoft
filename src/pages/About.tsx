import { MessageCircle, PenTool, Hammer, Truck, ArrowRight } from 'lucide-react';
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
          <div className="relative overflow-hidden rounded-[2rem] shadow-soft-lg min-h-[340px] lg:min-h-[420px] flex items-center">
            <div className="absolute inset-0">
              <EditableImage
                contentKey="about_hero_image"
                fallbackSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920"
                alt="Workshop"
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full relative"
                section="about"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/10" />
            </div>

            <div className="relative z-10 max-w-xl px-8 sm:px-12 lg:px-16 py-12">
              <span className="block text-xs uppercase tracking-[0.2em] text-primary-foreground/70 font-medium mb-5">
                <EditableText
                  contentKey="about_title"
                  fallback={t.about.title}
                  as="span"
                  section="about"
                  field="title"
                />
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-primary-foreground">
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
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary-foreground border-b border-primary-foreground/40 pb-1 hover:border-primary-foreground transition-colors"
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

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl font-bold mb-6">
                <EditableText 
                  contentKey="about_story_title" 
                  fallback={t.about.story}
                  as="span"
                  className="font-serif text-3xl font-bold"
                  section="about"
                  field="story_title"
                />
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <EditableText 
                  contentKey="about_story_text_1" 
                  fallback={t.about.storyText}
                  as="span"
                  multiline
                  section="about"
                  field="story_text_1"
                />
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <EditableText 
                  contentKey="about_story_text_2" 
                  fallback={language === 'uz'
                    ? "Metall karkas payvandlash va yig'ish jarayonini to'liq o'zimiz, o'z seximizda nazorat qilamiz. Seriyali modellar bilan bir qatorda, o'lchov bo'yicha individual buyurtmalarni ham bajaramiz."
                    : "Процесс сварки металлического каркаса и сборки полностью контролируем сами, в собственном цехе. Наряду с серийными моделями выполняем индивидуальные заказы по размерам."
                  }
                  as="span"
                  multiline
                  section="about"
                  field="story_text_2"
                />
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <EditableImage
                contentKey="about_story_image"
                fallbackSrc="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800"
                alt="Workshop"
                className="w-full h-full object-cover"
                wrapperClassName="w-full h-full"
                section="about"
              />
            </div>
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
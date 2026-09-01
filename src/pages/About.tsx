import { Award, Users, Package, MapPin, MessageCircle, PenTool, Hammer, Truck } from 'lucide-react';
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
    { icon: Award, value: '10+', label: t.about.stats.years, valueKey: 'about_stat_years_value', labelKey: 'about_stat_years_label' },
    { icon: Package, value: '5000+', label: t.about.stats.products, valueKey: 'about_stat_products_value', labelKey: 'about_stat_products_label' },
    { icon: Users, value: '3000+', label: t.about.stats.customers, valueKey: 'about_stat_customers_value', labelKey: 'about_stat_customers_label' },
    { icon: MapPin, value: '12+', label: t.about.stats.cities, valueKey: 'about_stat_cities_value', labelKey: 'about_stat_cities_label' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section id="hero" className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0 z-0">
          <EditableImage
            contentKey="about_hero_image"
            fallbackSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920"
            alt="Workshop"
            className="w-full h-full object-cover"
            wrapperClassName="w-full h-full relative z-10"
            section="about"
          />
          <div className="absolute inset-0 bg-black/60 pointer-events-none z-20" />
        </div>
        <div className="container mx-auto px-4 relative z-30 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            <EditableText 
              contentKey="about_title" 
              fallback={t.about.title}
              as="span"
              className="font-serif text-4xl md:text-5xl font-bold"
              section="about"
              field="title"
            />
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            <EditableText 
              contentKey="about_subtitle" 
              fallback={language === 'uz'
                ? "Metall karkasli loft mebellarni o'z seximizda ishlab chiqaramiz — mustahkam, minimalist va uzoq xizmat qiladigan yechimlar"
                : "Производим лофт-мебель на металлическом каркасе в собственном цехе — прочные, минималистичные и долговечные решения"
              }
              as="span"
              className="text-lg"
              section="about"
              field="subtitle"
            />
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 bg-card rounded-2xl shadow-warm">
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-primary" />
                <div className="font-serif text-3xl font-bold text-foreground">
                  <EditableText 
                    contentKey={stat.valueKey} 
                    fallback={stat.value}
                    as="span"
                    className="font-serif text-3xl font-bold"
                    section="about"
                    field={stat.valueKey}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <EditableText 
                    contentKey={stat.labelKey} 
                    fallback={stat.label}
                    as="span"
                    className="text-sm"
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
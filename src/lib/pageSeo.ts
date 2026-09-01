// Per-page SEO metadata (title/description/ogTitle) in both languages.
// Used with the useSEO hook to give each route unique meta tags.

export type Lang = 'uz' | 'ru';

type PageSeo = {
  title: string;
  description: string;
};

type PageKey = 'home' | 'catalog' | 'about' | 'contact' | 'faq';

const SEO: Record<PageKey, Record<Lang, PageSeo>> = {
  home: {
    uz: {
      title: 'SteelWood — Premium mebel va interyer',
      description:
        "SteelWood — zamonaviy va minimalist premium mebel do'koni: divanlar, stollar, kreslolar va to'liq xona dizayni. Samarqand va butun O'zbekiston bo'ylab yetkazib berish.",
    },
    ru: {
      title: 'SteelWood — Премиальная мебель и интерьер',
      description:
        'SteelWood — современный магазин премиальной мебели: диваны, столы, кресла и комплексный дизайн интерьера. Доставка по Самарканду и всему Узбекистану.',
    },
  },
  catalog: {
    uz: {
      title: 'Katalog — SteelWood mebel va interyer',
      description:
        "SteelWood katalogi: divanlar, kreslolar, stollar, shkaflar va boshqa premium mebel mahsulotlari. Narxlar, o'lchamlar va foto bilan tanlang.",
    },
    ru: {
      title: 'Каталог — мебель и интерьер SteelWood',
      description:
        'Каталог SteelWood: диваны, кресла, столы, шкафы и другая премиальная мебель. Выбирайте по цене, размеру и фото.',
    },
  },
  about: {
    uz: {
      title: 'Biz haqimizda — SteelWood',
      description:
        "SteelWood — metall karkasli loft mebellar ishlab chiqaruvchi o'z sexi. Seriyali modellar va o'lchov bo'yicha individual buyurtmalar. Qadriyatlarimiz va ishlab chiqarish jarayoni haqida.",
    },
    ru: {
      title: 'О нас — SteelWood',
      description:
        'SteelWood — собственный цех по производству лофт-мебели на металлическом каркасе. Серийные модели и изготовление на заказ по индивидуальным размерам.',
    },
  },
  contact: {
    uz: {
      title: 'Aloqa — SteelWood filiallari va manzillari',
      description:
        "SteelWood filiallari, manzillari va telefon raqamlari. Xaritada joylashuvni ko'ring, savolingizni yozing yoki bevosita bog'laning.",
    },
    ru: {
      title: 'Контакты — филиалы и адреса SteelWood',
      description:
        'Филиалы, адреса и телефоны SteelWood. Посмотрите расположение на карте, напишите нам или свяжитесь напрямую.',
    },
  },
  faq: {
    uz: {
      title: 'Savol-javob — SteelWood',
      description:
        "SteelWood bo'yicha eng ko'p beriladigan savollar: buyurtma, yetkazib berish, to'lov, kafolat va individual buyurtmalar haqida javoblar.",
    },
    ru: {
      title: 'Вопросы и ответы — SteelWood',
      description:
        'Самые частые вопросы об SteelWood: оформление заказа, доставка, оплата, гарантия и индивидуальные заказы.',
    },
  },
};

export function getPageSeo(page: PageKey, language: Lang): PageSeo {
  return SEO[page][language] || SEO[page].uz;
}

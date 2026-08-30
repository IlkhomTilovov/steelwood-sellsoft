-- 4 ta boshlang'ich promo kartochka — bosh sahifadagi Hero bento panelida
-- (2x2 to'r) va promo karuselida ko'rsatiladi. Ranglar/ikonlar
-- src/lib/promoIcons.ts dagi PROMO_ICONS / BG_PRESETS bilan mos.

insert into public.promo_tiles (title_uz, title_ru, icon, href, bg_class, text_class, is_active, sort_order)
values
  ('Yangi kolleksiya', 'Новая коллекция', 'Sparkles', '/catalog', 'bg-accent/15', 'text-foreground', true, 1),
  ('Chegirmalar', 'Скидки', 'Percent', '/catalog?discounted=1', 'bg-destructive/15', 'text-foreground', true, 2),
  ('Bepul yetkazib berish', 'Бесплатная доставка', 'Truck', '/contact', 'bg-primary/10', 'text-foreground', true, 3),
  ('Individual buyurtma', 'Индивидуальный заказ', 'Briefcase', '/contact', 'bg-primary', 'text-primary-foreground', true, 4);

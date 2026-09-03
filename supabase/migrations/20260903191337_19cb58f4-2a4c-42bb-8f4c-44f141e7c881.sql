UPDATE public.products SET sort_order = 9999 WHERE sort_order IS NULL OR sort_order <= 0;
ALTER TABLE public.products ALTER COLUMN sort_order SET DEFAULT 9999;
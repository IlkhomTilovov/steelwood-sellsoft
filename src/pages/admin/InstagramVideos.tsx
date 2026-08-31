import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Instagram, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAllInstagramVideos, type InstagramVideo } from '@/hooks/useInstagramVideos';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useLanguage } from '@/hooks/useLanguage';

type VideoForm = Omit<InstagramVideo, 'id'>;

const emptyForm: VideoForm = {
  instagram_url: '',
  video_url: '',
  caption_uz: '',
  caption_ru: '',
  sort_order: 0,
  is_active: true,
};

export default function InstagramVideosAdmin() {
  const { language } = useLanguage();
  const { data: videos = [], isLoading } = useAllInstagramVideos();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InstagramVideo | null>(null);
  const [form, setForm] = useState<VideoForm>(emptyForm);
  const [deleting, setDeleting] = useState<InstagramVideo | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['instagram_videos'] });
    qc.invalidateQueries({ queryKey: ['instagram_videos_all'] });
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, sort_order: (videos[videos.length - 1]?.sort_order ?? 0) + 1 });
    setOpen(true);
  };

  const openEdit = (v: InstagramVideo) => {
    setEditing(v);
    const { id, ...rest } = v;
    setForm({
      ...rest,
      instagram_url: rest.instagram_url || '',
      video_url: rest.video_url || '',
      caption_uz: rest.caption_uz || '',
      caption_ru: rest.caption_ru || '',
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.instagram_url?.trim() && !form.video_url?.trim()) {
      toast.error(
        language === 'ru'
          ? 'Укажите ссылку на Instagram или прямую ссылку на видео'
          : 'Instagram havolasini yoki video havolasini kiriting'
      );
      return;
    }
    const payload = {
      ...form,
      instagram_url: form.instagram_url?.trim() || null,
      video_url: form.video_url?.trim() || null,
      caption_uz: form.caption_uz?.trim() || null,
      caption_ru: form.caption_ru?.trim() || null,
    };
    const res = editing
      ? await supabase.from('instagram_videos').update(payload).eq('id', editing.id)
      : await supabase.from('instagram_videos').insert(payload);
    if (res.error) {
      toast.error(res.error.message);
      return;
    }
    toast.success(language === 'ru' ? 'Сохранено' : 'Saqlandi');
    setOpen(false);
    refresh();
  };

  const toggleActive = async (v: InstagramVideo) => {
    await supabase.from('instagram_videos').update({ is_active: !v.is_active }).eq('id', v.id);
    refresh();
  };

  const confirmRemove = async () => {
    if (!deleting) return;
    await supabase.from('instagram_videos').delete().eq('id', deleting.id);
    toast.success(language === 'ru' ? 'Удалено' : 'O‘chirildi');
    setDeleting(null);
    refresh();
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const a = videos[idx];
    const b = videos[idx + dir];
    if (!a || !b) return;
    await Promise.all([
      supabase.from('instagram_videos').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('instagram_videos').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    refresh();
  };

  const displayCaption = (v: InstagramVideo) =>
    (language === 'ru' ? v.caption_ru || v.caption_uz : v.caption_uz || v.caption_ru) || '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {language === 'ru' ? 'Instagram видео' : 'Instagram videolar'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {language === 'ru'
              ? 'Главная страница, раздел «Вдохновение для интерьера» — вставьте ссылку на пост/Reels Instagram'
              : "Bosh sahifadagi \"Interyer uchun ilhom\" bo'limi — Instagram post/Reels havolasini kiriting"}
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="w-4 h-4 mr-2" />
          {language === 'ru' ? 'Новое видео' : 'Yangi video'}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          {language === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...'}
        </div>
      ) : videos.length === 0 ? (
        <Card className="p-12 text-center">
          <Instagram className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            {language === 'ru' ? 'Пока нет видео' : 'Hozircha video yo‘q'}
          </p>
          <Button onClick={openNew}>
            <Plus className="w-4 h-4 mr-2" />
            {language === 'ru' ? 'Добавить первое' : 'Birinchisini qo‘shish'}
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {videos.map((v, idx) => (
            <Card key={v.id} className="p-4 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center shrink-0">
                <Instagram className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium truncate">
                    {displayCaption(v) || (language === 'ru' ? '(без подписи)' : '(sarlavhasiz)')}
                  </span>
                  {!v.is_active && <Badge variant="secondary">{language === 'ru' ? 'Скрыт' : 'Yashirin'}</Badge>}
                  {v.video_url && (
                    <Badge variant="outline" className="text-[10px]">
                      {language === 'ru' ? 'ручная ссылка' : "qo'lda havola"}
                    </Badge>
                  )}
                </div>
                {v.instagram_url && (
                  <a
                    href={v.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-muted-foreground hover:underline inline-flex items-center gap-1 truncate"
                  >
                    {v.instagram_url}
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                )}
                <p className="text-xs text-muted-foreground mt-1">#{v.sort_order}</p>
              </div>
              <div className="flex gap-1 shrink-0 items-center">
                <Button variant="ghost" size="icon" onClick={() => move(idx, -1)} disabled={idx === 0}>
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => move(idx, 1)} disabled={idx === videos.length - 1}>
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toggleActive(v)}>
                  {v.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(v)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleting(v)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing
                ? (language === 'ru' ? 'Редактировать видео' : 'Videoni tahrirlash')
                : (language === 'ru' ? 'Новое видео' : 'Yangi video')}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>{language === 'ru' ? 'Ссылка на Instagram (пост/Reels)' : 'Instagram havolasi (post/Reels)'}</Label>
              <Input
                value={form.instagram_url || ''}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                placeholder="https://www.instagram.com/reel/xxxxxxxxx/"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {language === 'ru'
                  ? 'Видео показывается через официальный виджет Instagram прямо на сайте'
                  : "Video Instagram'ning rasmiy vidjeti orqali saytning o'zida ko'rsatiladi"}
              </p>
            </div>

            <div>
              <Label>{language === 'ru' ? 'Или прямая ссылка на видео (опционально)' : "Yoki to'g'ridan video havolasi (ixtiyoriy)"}</Label>
              <Input
                value={form.video_url || ''}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                placeholder="https://.../video.mp4"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {language === 'ru'
                  ? 'Используется вместо автоопределения — заполните, если ссылка на Instagram не сработала'
                  : "Avtomatik aniqlash o'rniga ishlatiladi — Instagram havolasi ishlamasa shuni to'ldiring"}
              </p>
              {form.video_url && (
                <div className="relative w-full aspect-[4/5] max-h-64 rounded-lg overflow-hidden mt-2 bg-black">
                  <video src={form.video_url} className="w-full h-full object-contain" controls />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>{language === 'ru' ? 'Подпись (UZ, опционально)' : 'Sarlavha (UZ, ixtiyoriy)'}</Label>
                <Input value={form.caption_uz || ''} onChange={(e) => setForm({ ...form, caption_uz: e.target.value })} />
              </div>
              <div>
                <Label>{language === 'ru' ? 'Подпись (RU, опционально)' : 'Sarlavha (RU, ixtiyoriy)'}</Label>
                <Input value={form.caption_ru || ''} onChange={(e) => setForm({ ...form, caption_ru: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 items-end">
              <div>
                <Label>{language === 'ru' ? 'Порядок' : 'Tartib'}</Label>
                <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label>{language === 'ru' ? 'Активен' : 'Faol'}</Label>
                <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {language === 'ru' ? 'Отмена' : 'Bekor qilish'}
            </Button>
            <Button onClick={save}>
              {language === 'ru' ? 'Сохранить' : 'Saqlash'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === 'ru' ? 'Удалить видео?' : 'Videoni o‘chirish?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && displayCaption(deleting)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === 'ru' ? 'Отмена' : 'Bekor qilish'}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {language === 'ru' ? 'Удалить' : 'O‘chirish'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

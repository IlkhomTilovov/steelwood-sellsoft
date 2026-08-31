import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface InstagramVideo {
  id: string;
  instagram_url: string | null;
  video_url: string | null;
  caption_uz: string | null;
  caption_ru: string | null;
  sort_order: number;
  is_active: boolean;
}

export function useInstagramVideos(enabled = true) {
  return useQuery({
    queryKey: ['instagram_videos'],
    queryFn: async (): Promise<InstagramVideo[]> => {
      const { data, error } = await supabase
        .from('instagram_videos')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []) as InstagramVideo[];
    },
    enabled,
  });
}

export function useAllInstagramVideos() {
  return useQuery({
    queryKey: ['instagram_videos_all'],
    queryFn: async (): Promise<InstagramVideo[]> => {
      const { data, error } = await supabase
        .from('instagram_videos')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data || []) as InstagramVideo[];
    },
  });
}

/**
 * A row's `video_url` (manual override) is used as-is when present.
 * Otherwise, resolve the pasted `instagram_url` to a direct, playable video
 * file via the `resolve-instagram-video` edge function (reads Instagram's
 * public og:video meta tag — unofficial, and the resulting CDN URL expires
 * after a few hours, so it's re-resolved on every mount rather than cached
 * in the database).
 */
export function useResolvedInstagramVideoSrc(video: Pick<InstagramVideo, 'video_url' | 'instagram_url'>) {
  return useQuery({
    queryKey: ['instagram_video_resolve', video.video_url || video.instagram_url],
    queryFn: async (): Promise<{ videoUrl: string; posterUrl?: string }> => {
      if (video.video_url) return { videoUrl: video.video_url };
      const { data, error } = await supabase.functions.invoke('resolve-instagram-video', {
        body: { url: video.instagram_url },
      });
      if (error) throw error;
      if (!data?.videoUrl) throw new Error(data?.error || 'No video URL resolved');
      return data;
    },
    enabled: !!(video.video_url || video.instagram_url),
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });
}

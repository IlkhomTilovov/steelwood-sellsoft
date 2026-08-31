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

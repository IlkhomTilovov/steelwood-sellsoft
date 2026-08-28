import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Theme } from '@/lib/themes';

const THEME_CACHE_KEY = 'furniture-active-theme';
const THEME_READY_KEY = 'furniture-theme-ready';

// Current live theme inlined as a first-paint fallback so mobile users do not
// wait for a backend round-trip before the LCP hero can render.
const DEFAULT_ACTIVE_THEME: Theme = {
  name: 'OrisHome Premium',
  slug: 'orishome-premium',
  colorPalette: {
    background: '43 30% 95%',
    foreground: '0 0% 13%',
    card: '43 26% 97%',
    cardForeground: '0 0% 13%',
    popover: '43 30% 95%',
    popoverForeground: '0 0% 13%',
    primary: '153 30% 17%',
    primaryForeground: '43 30% 95%',
    secondary: '34 36% 75%',
    secondaryForeground: '153 30% 17%',
    muted: '43 24% 90%',
    mutedForeground: '0 0% 40%',
    accent: '34 36% 75%',
    accentForeground: '153 30% 17%',
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 100%',
    border: '34 30% 85%',
    input: '34 30% 85%',
    ring: '153 30% 17%',
    warmCream: '43 30% 95%',
    warmBeige: '34 36% 75%',
    warmBrown: '153 30% 17%',
    darkWood: '0 0% 13%',
    goldAccent: '38 45% 55%',
    sageGreen: '153 30% 17%',
    mediaForeground: '0 0% 100%',
    success: '142 71% 45%',
    successForeground: '0 0% 100%',
    whatsapp: '142 70% 42%',
    whatsappForeground: '0 0% 100%',
  },
  typography: {
    fontSans: "'Inter', system-ui, sans-serif",
    fontSerif: "'Cormorant Garamond', Georgia, serif",
    fontHeading: "'Cormorant Garamond', Georgia, serif",
  },
  componentStyles: {
    borderRadius: '1rem',
    buttonRadius: '1.5rem',
    cardRadius: '2rem',
    shadowSm: '0 1px 2px hsl(0 0% 0% / 0.04), 0 1px 3px hsl(0 0% 0% / 0.03)',
    shadowMd: '0 4px 12px -4px hsl(153 30% 17% / 0.08), 0 2px 6px -2px hsl(153 30% 17% / 0.05)',
    shadowLg: '0 12px 32px -8px hsl(153 30% 17% / 0.12), 0 4px 12px -4px hsl(153 30% 17% / 0.06)',
  },
  layoutSettings: {
    containerMaxWidth: '1280px',
    sectionSpacing: '4rem',
    cardPadding: '1.5rem',
  },
  isActive: true,
  isDark: false,
};

interface ThemeContextType {
  currentTheme: Theme | null;
  themes: Theme[];
  isLoading: boolean;
  isThemeReady: boolean;
  setActiveTheme: (themeId: string) => Promise<void>;
  previewTheme: (theme: Theme) => void;
  resetPreview: () => void;
  isPreviewMode: boolean;
  refreshThemes: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const cacheTheme = (theme: Theme) => {
  try {
    localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(theme));
    localStorage.setItem(THEME_READY_KEY, 'true');
  } catch (e) {
    console.warn('Failed to cache theme:', e);
  }
};

const getCachedTheme = (): Theme | null => {
  try {
    const cached = localStorage.getItem(THEME_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.warn('Failed to get cached theme:', e);
  }
  return null;
};

const hasThemeBeenLoaded = (): boolean => {
  try {
    return localStorage.getItem(THEME_READY_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

export const applyThemeToDocument = (theme: Theme) => {
  const root = document.documentElement;
  const palette = theme.colorPalette as unknown as Record<string, string | undefined>;

  // Hosila (derived) tokenlar — mavzuda berilmagan bo'lsa asosiy ranglardan olinadi
  const derived: Record<string, string> = {
    mediaForeground: palette.mediaForeground || (theme.isDark ? palette.foreground! : palette.background!),
    success: palette.success || palette.accent!,
    successForeground: palette.successForeground || palette.accentForeground || palette.background!,
    whatsapp: palette.whatsapp || palette.accent!,
    whatsappForeground: palette.whatsappForeground || palette.accentForeground || palette.background!,
    goldAccent: palette.goldAccent || palette.accent!,
    sageGreen: palette.sageGreen || palette.accent!,
  };

  Object.entries({ ...derived, ...theme.colorPalette }).forEach(([key, value]) => {
    if (!value) return;
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    root.style.setProperty(`--${cssVar}`, value);
  });

  const sansFallback = "'Inter', system-ui, sans-serif";
  const serifFallback = "'Cormorant Garamond', Georgia, serif";
  root.style.setProperty('--font-sans', theme.typography?.fontSans || sansFallback);
  root.style.setProperty('--font-serif', theme.typography?.fontSerif || serifFallback);
  root.style.setProperty('--font-heading', theme.typography?.fontHeading || serifFallback);


  root.style.setProperty('--radius', theme.componentStyles.borderRadius);
  root.style.setProperty('--button-radius', theme.componentStyles.buttonRadius);
  root.style.setProperty('--card-radius', theme.componentStyles.cardRadius);
  root.style.setProperty('--shadow-sm', theme.componentStyles.shadowSm);
  root.style.setProperty('--shadow-md', theme.componentStyles.shadowMd);
  root.style.setProperty('--shadow-lg', theme.componentStyles.shadowLg);

  root.style.setProperty('--container-max-width', theme.layoutSettings.containerMaxWidth);
  root.style.setProperty('--section-spacing', theme.layoutSettings.sectionSpacing);
  root.style.setProperty('--card-padding', theme.layoutSettings.cardPadding);

  if (theme.isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  root.setAttribute('data-theme-loaded', 'true');
};

export const initializeTheme = (): Theme | null => {
  const cached = getCachedTheme();
  if (cached) {
    applyThemeToDocument(cached);
    return cached;
  }
  applyThemeToDocument(DEFAULT_ACTIVE_THEME);
  return DEFAULT_ACTIVE_THEME;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(() => getCachedTheme() ?? DEFAULT_ACTIVE_THEME);
  const [savedTheme, setSavedTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isThemeReady, setIsThemeReady] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const applyTheme = useCallback((theme: Theme) => {
    applyThemeToDocument(theme);
    setIsThemeReady(true);
  }, []);

  const fetchThemes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedThemes: Theme[] = data.map((t: any) => ({
          id: t.id,
          name: t.name,
          slug: t.slug,
          colorPalette: t.color_palette,
          typography: t.typography,
          componentStyles: t.component_styles,
          layoutSettings: t.layout_settings,
          isActive: t.is_active,
          isDark: t.is_dark
        }));
        setThemes(mappedThemes);

        const active = mappedThemes.find(t => t.isActive);
        if (active) {
          setCurrentTheme(active);
          setSavedTheme(active);
          applyTheme(active);
          cacheTheme(active);
        }
        // No active theme and no fallback — site stays on loader
      }
      // No themes in DB — site stays on loader, no fallback
    } catch (error) {
      console.error('Error fetching themes:', error);
      // Use cached theme if available, otherwise stay on loader
      const cached = getCachedTheme();
      if (cached) {
        setCurrentTheme(cached);
        setSavedTheme(cached);
        applyTheme(cached);
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyTheme]);

  const setActiveTheme = async (themeId: string) => {
    try {
      const themeToActivate = themes.find(t => t.id === themeId);
      
      const { error } = await supabase
        .from('themes')
        .update({ is_active: true })
        .eq('id', themeId);

      if (error) throw error;

      if (themeToActivate) {
        const updatedTheme = { ...themeToActivate, isActive: true };
        cacheTheme(updatedTheme);
        applyTheme(updatedTheme);
        setCurrentTheme(updatedTheme);
        setSavedTheme(updatedTheme);
      }

      await fetchThemes();
      setIsPreviewMode(false);
    } catch (error) {
      console.error('Error setting active theme:', error);
    }
  };

  const previewTheme = (theme: Theme) => {
    if (!isPreviewMode && currentTheme) {
      setSavedTheme(currentTheme);
    }
    setIsPreviewMode(true);
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  const resetPreview = () => {
    if (savedTheme) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
    setIsPreviewMode(false);
  };

  const refreshThemes = async () => {
    setIsLoading(true);
    await fetchThemes();
  };

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        themes,
        isLoading,
        isThemeReady,
        setActiveTheme,
        previewTheme,
        resetPreview,
        isPreviewMode,
        refreshThemes
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

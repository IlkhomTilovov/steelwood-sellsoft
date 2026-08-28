import { useTheme } from '@/hooks/useTheme';

interface ThemeLoaderProps {
  children: React.ReactNode;
}

export function ThemeLoader({ children }: ThemeLoaderProps) {
  const { isThemeReady, isLoading } = useTheme();

  // Block rendering until active theme is loaded — no fallback UI
  if (!isThemeReady) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: '#F5F3EE' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#D6C2A8', borderTopColor: '#1F3A2E' }}
          />
          {!isLoading && (
            <p className="text-sm" style={{ color: '#1F3A2E' }}>
              No active theme configured
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

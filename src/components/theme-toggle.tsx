import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const Component = theme === 'dark' ? Sun : Moon;

  return (
    <Component
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="cursor-pointer"
    />
  );
}

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-9 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label={`Cambiar a tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
          >
            <span
              className={`absolute left-1 inline-block h-7 w-7 transform rounded-full bg-white dark:bg-gray-900 transition-transform duration-300 shadow-lg ${
                theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
              }`}
            >
              <span className="flex h-full w-full items-center justify-center">
                {theme === 'light' ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-blue-400" />
                )}
              </span>
            </span>
            <span className="sr-only">Toggle theme</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cambiar a tema {theme === 'light' ? 'oscuro' : 'claro'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle;
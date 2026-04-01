import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../utils/cn.ts';

interface CardProps extends PropsWithChildren<HTMLAttributes<HTMLDivElement>> {
  isActive?: boolean;
}

export function Card({ children, className, isActive = true, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border rounded-lg p-4 border-gray-200 dark:border-neutral-800',
        className,
        !isActive &&
          'opacity-50 pointer-events-none border-neutral-600/50 dark:border-neutral-600/50 bg-neutral-700/20 dark:bg-neutral-700/30',
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

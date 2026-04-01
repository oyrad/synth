import type { HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '../../utils/cn.ts';

export function Title({
  children,
  className,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) {
  return (
    <p className={cn('font-mono text-xl font-bold uppercase', className)} {...rest}>
      {children}
    </p>
  );
}

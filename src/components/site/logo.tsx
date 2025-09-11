import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-6 w-6', props.className)}
      {...props}
    >
      <path d="M22 20V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zM9.4 16.6L8 18l-1.4-1.4c-1.3-1.3-1.3-3.5 0-4.8l2.8-2.8c1.3-1.3 3.5-1.3 4.8 0l1.4 1.4M9.4 7.4L8 6l-1.4 1.4c-1.3 1.3-1.3 3.5 0 4.8l2.8 2.8c1.3 1.3 3.5 1.3 4.8 0l1.4-1.4" />
      <path d="M12 18V6" />
    </svg>
  );
}

import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn('h-6 w-6', props.className)}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      <path d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7c0-1.09-.26-2.12-.72-3.03l-1.42 1.42C16.99 11.08 17 11.53 17 12c0 2.76-2.24 5-5 5s-5-2.24-5-5 2.24-5 5-5c.47 0 .92.07 1.35.19l1.42-1.42C14.12 5.26 13.09 5 12 5zm-1 2v4h4v-2h-2V7h-2z"/>
    </svg>
  );
}

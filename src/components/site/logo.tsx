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
      <path d="M19.5,2.25H12a2.25,2.25,0,0,0-2.25,2.25v15A2.25,2.25,0,0,0,12,21.75h7.5A2.25,2.25,0,0,0,21.75,19.5V4.5A2.25,2.25,0,0,0,19.5,2.25Zm-9.75,0H4.5A2.25,2.25,0,0,0,2.25,4.5v15A2.25,2.25,0,0,0,4.5,21.75H9.75v-15A2.25,2.25,0,0,0,7.5,4.5V4.31a.19.19,0,0,1,.19-.19h0a.19.19,0,0,1,.19.19V6a.75.75,0,0,0,1.5,0V4.5A2.25,2.25,0,0,0,7.12,2.38L7,2.25Zm-3,10.5h3.75a.75.75,0,0,0,0-1.5H6.75v-1.5a.75.75,0,0,0-1.5,0v1.5H3a.75.75,0,0,0,0,1.5Z" />
    </svg>
  );
}

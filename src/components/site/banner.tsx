import { Wand2 } from 'lucide-react';

export default function Banner() {
  return (
    <div className="relative overflow-hidden bg-primary/10">
      <div className="container relative py-12 sm:py-16 lg:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 m-auto h-full w-full"
        >
          <div
            aria-hidden="true"
            className="absolute bottom-0 right-0 top-0 h-full w-2/3 bg-gradient-to-l from-primary/10 via-primary/5 to-transparent"
          ></div>
           <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 top-0 h-full w-1/2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
          ></div>
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            NovelNest
          </h1>
          <p className="mt-4 text-lg leading-8 text-foreground/80">
            Your AI-powered marketplace for swapping beloved books. Discover hidden gems, sell your old favorites, and connect with a community of readers.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-2 text-sm font-medium text-primary">
            <Wand2 className="h-5 w-5" />
            <span>Powered by Generative AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

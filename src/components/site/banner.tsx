import Logo from './logo';

export default function Banner() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-orange-100 via-rose-100 to-purple-200">
      <div className="container relative py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center sm:text-left">
            <Logo className="h-24 w-24 text-white drop-shadow-lg" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
                NovelNest
              </h1>
              <p className="mt-2 text-xl font-medium text-foreground/90">
                Exchange & Resell
              </p>
              <p className="mt-1 text-md text-foreground/80">
                Discover hidden gems, sell your old favorites.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

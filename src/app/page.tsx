import BookList from '@/components/site/book-list';
import Header from '@/components/site/header';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-6 text-3xl font-bold tracking-tight font-headline text-foreground/90 sm:text-4xl">
            Available Books
          </h1>
          <BookList />
        </div>
      </main>
    </div>
  );
}

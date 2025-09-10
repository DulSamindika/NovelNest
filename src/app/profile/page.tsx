
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUser } from '@/lib/data';
import type { User, Rating } from '@/lib/types';
import { Mail, Phone, Home as HomeIcon, Star } from 'lucide-react';
import Header from '@/components/site/header';
import { Separator } from '@/components/ui/separator';
import BookList from '@/components/site/book-list';
import AddBookDialog from '@/components/site/add-book-dialog';
import EditProfileDialog from '@/components/site/edit-profile-dialog';
import { useBooks } from '@/context/book-context';
import RateSellerDialog from '@/components/site/rate-seller-dialog';

export default function ProfilePage() {
  const [user, setUser] = useState<User>(mockUser);
  const { books, toggleFavorite, addBook } = useBooks();

  const handleProfileUpdate = (updatedUser: Partial<User>) => {
    setUser(prevUser => ({ ...prevUser, ...updatedUser }));
  };
  
  const handleAddRating = (newRating: Omit<Rating, 'id' | 'customerId'>) => {
    setUser(prevUser => ({
      ...prevUser,
      ratings: [
        { 
          ...newRating, 
          id: `rating-${Date.now()}`,
          customerId: `customer-${Date.now()}` // Simulate a unique customer
        }, 
        ...prevUser.ratings
      ],
    }));
  };

  const userBooks = books.filter(book => book.sellerId === user.uid);
  const favoriteBooks = books.filter(book => book.isFavorite);
  const averageRating = user.ratings.length > 0
    ? (user.ratings.reduce((acc, r) => acc + r.rating, 0) / user.ratings.length).toFixed(1)
    : 'N/A';

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profilePicUrl} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold font-headline">{user.firstName} {user.lastName}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-yellow-500">
                    <Star className="h-5 w-5 fill-current" />
                    <span>{averageRating} ({user.ratings.length} ratings)</span>
                  </div>
                </div>
                <div className="flex gap-2 self-start sm:self-auto">
                  <RateSellerDialog onAddRating={handleAddRating} sellerName={`${user.firstName} ${user.lastName}`} />
                  <EditProfileDialog user={user} onProfileUpdate={handleProfileUpdate} />
                  <AddBookDialog addBook={addBook} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-foreground/90">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span>{user.contactInfo}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{user.mobileNumber}</span>
                </div>
                <div className="flex items-center gap-3 col-span-full">
                  <HomeIcon className="h-5 w-5 text-muted-foreground" />
                  <span>{user.address}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Favorite Books</h2>
            {favoriteBooks.length > 0 ? (
              <BookList books={favoriteBooks} onToggleFavorite={toggleFavorite} />
            ) : (
              <p className="text-muted-foreground">You haven't favorited any books yet.</p>
            )}
          </div>

          <Separator className="my-8" />
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Your Books for Sale</h2>
            {userBooks.length > 0 ? (
              <BookList books={userBooks} onToggleFavorite={toggleFavorite} />
            ) : (
              <p className="text-muted-foreground">You haven't listed any books for sale yet.</p>
            )}
          </div>
          
          <Separator className="my-8" />
          
          <div>
            <h2 className="text-2xl font-bold mb-4">Feedback & Ratings</h2>
            <div className="space-y-6">
              {user.ratings.map((rating) => (
                <Card key={rating.id} className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < rating.rating ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <p className="ml-auto text-xs text-muted-foreground">by {rating.customerName}</p>
                    </div>
                    <p className="text-sm text-foreground/80">{rating.feedback}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

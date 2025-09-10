
export type User = {
  uid: string;
  firstName: string;
  lastName: string;
  username: string;
  mobileNumber: string;
  contactInfo: string;
  address: string;
  profilePicUrl: string;
  ratings: Rating[];
};

export type Rating = {
  id: string;
  rating: number; // 1-5
  feedback: string;
  customerId: string;
  customerName: string;
}

export type BookCondition = 'new' | 'used-good' | 'used-fair';

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  condition: BookCondition;
  originalPrice: number;
  sellingPrice: number;
  sellerId: string;
  sellerName: string;
  sellerContact: string;
  bookImageUrl: string;
  isFavorite?: boolean;
};
